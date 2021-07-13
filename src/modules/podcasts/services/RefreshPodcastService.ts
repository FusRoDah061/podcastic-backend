import { container, inject, injectable } from 'tsyringe';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IFeed from '../../../shared/providers/FeedParserProvider/dtos/IFeed';
import IFeedParserProvider from '../../../shared/providers/FeedParserProvider/models/IFeedParserProvider';
import formatDuration from '../../../shared/utils/formatDuration';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import RecoverableError from '../errors/RecoverableError';
import IEpisodesRepository from '../repositories/IEpisodesRepository';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IEpisode } from '../schemas/Episode';
import FindDominantColorService from './FindDominantColorService';

@injectable()
export default class RefreshPodcastService {
  constructor(
    @inject('PodcastRepository')
    private podcastsRepository: IPodcastRepository,

    @inject('EpisodeRepository')
    private episodesRepository: IEpisodesRepository,

    @inject('FeedHealthcheckProvider')
    private feedHealthcheckProvider: IFeedHealthcheckProvider,

    @inject('FeedParserProvider')
    private feedParserProvider: IFeedParserProvider,
  ) {}

  public async execute({ feedUrl }: IPodcastQueueMessage): Promise<void> {
    console.log('Refresh feed ', feedUrl);

    let podcast = await this.podcastsRepository.findByFeedUrl(feedUrl);
    const LOG_TAG = `[${podcast?.name ?? feedUrl.substring(0, 20)}]: `;

    try {
      await this.feedHealthcheckProvider.ping(feedUrl);
      console.log(LOG_TAG, 'Feed url is valid');
    } catch (err) {
      console.error(LOG_TAG, `Error checking feed ${feedUrl}: `, err);

      if (podcast) {
        console.log(LOG_TAG, 'Podcast exists but the feed is down.');

        podcast.isServiceAvailable = false;

        await this.podcastsRepository.save(podcast);
      } else {
        // If the podcast doesn't exist, we throw an error so that the message consumption is rolled back to be reprocessed later
        throw new RecoverableError(
          `Recoverable error checking feed ${feedUrl}`,
        );
      }
    }

    console.log(LOG_TAG, 'Parsing feed');

    let feed: IFeed;

    try {
      feed = await this.feedParserProvider.parse(feedUrl);
    } catch (err) {
      console.error(LOG_TAG, `Error reading feed: `, err);
      throw new Error(`Fatal error reading feed ${feedUrl}`);
    }

    if (!podcast) {
      console.log(LOG_TAG, 'Adding a new podcast: ', feedUrl);

      podcast = await this.podcastsRepository.create({
        name: feed.name,
        description: feed.description,
        imageUrl: feed.image,
        feedUrl: feed.xmlUrl,
        websiteUrl: feed.link,
      });
    }

    console.log(LOG_TAG, 'Updating/creating episodes.');

    if (podcast) {
      const findDominantColorService = container.resolve(
        FindDominantColorService,
      );

      const existingPodcast = podcast;

      console.log(LOG_TAG, 'Getting podcast dominant color.');

      const colors = await findDominantColorService.execute({
        imageUrl: feed.image,
      });

      existingPodcast.isServiceAvailable = true;
      existingPodcast.lastSuccessfulHealthcheckAt = new Date();
      existingPodcast.imageUrl = feed.image;
      existingPodcast.themeColor = colors?.themeColor;
      existingPodcast.textColor = colors?.textColor;

      await this.podcastsRepository.save(existingPodcast);

      console.log(LOG_TAG, 'Fetching existing episodes.');

      const newPodcastEpisodes: Array<IEpisode> = [];
      const episodes = await this.episodesRepository.findAllByPodcast(
        existingPodcast.id,
      );

      const promiseList: Array<Promise<any>> = [];

      console.log(LOG_TAG, 'Looping feed items.');

      // Loop through feed items to create or update episodes
      feed.items.forEach(feedItem => {
        const existingEpisode = episodes.find(episode => {
          return episode.title === feedItem.title;
        });

        const audioFile = feedItem.files.find(file => {
          return file.mediaType?.startsWith('audio/');
        });

        // If an audio file wasn't found, we ignore this item
        if (!audioFile) return;

        // Prefer itunes duration since it might be more accurate and already formatted
        let audioDuration = feedItem.itunesDuration?.trim();

        if (audioDuration) {
          if (!audioDuration.includes(':')) {
            audioDuration = formatDuration(Number(audioDuration) * 1000);
          }

          // Duration should match format HH:MM:SS
          if (audioDuration.length < 5) {
            // If it's M:SS
            audioDuration = `00:${audioDuration.padStart(5, '0')}`;
          } else if (audioDuration.length < 7) {
            // If it's MM:SS
            audioDuration = `00:${audioDuration}`;
          } else if (audioDuration.length < 8) {
            // If it's H:MM:SS
            audioDuration = `0${audioDuration}`;
          }
        }

        if (!existingEpisode) {
          const createEpisodePromise = this.episodesRepository.create({
            podcastId: existingPodcast.id,
            title: feedItem.title,
            description: feedItem.description,
            date: feedItem.date ?? new Date(),
            image: feedItem.image ?? existingPodcast.imageUrl,
            duration: audioDuration as string,
            url: audioFile.url,
            mediaType: audioFile.mediaType ?? 'audio/mpeg',
            sizeBytes: Number(audioFile.length ?? 0),
          });

          promiseList.push(createEpisodePromise);
        } else {
          // Update the episode
          existingEpisode.title = feedItem.title;
          existingEpisode.description = feedItem.description;
          existingEpisode.date = feedItem.date ?? existingEpisode.date;
          existingEpisode.image =
            feedItem.image ?? existingEpisode.image ?? existingPodcast.imageUrl;
          existingEpisode.duration = audioDuration as string;
          existingEpisode.url = audioFile.url ?? existingEpisode.url;
          existingEpisode.mediaType = audioFile.mediaType ?? 'audio/mpeg';
          existingEpisode.sizeBytes = Number(audioFile.length ?? 0);

          promiseList.push(this.episodesRepository.save(existingEpisode));
        }
      });

      await Promise.all(promiseList);

      console.log(
        LOG_TAG,
        "Updating episodes that aren't available on the feed",
      );

      // Update existing episodes that don't exist on feed anymore
      const updatedAvailabilityEpisodes = episodes.map<IEpisode>(episode => {
        const feedItem = feed.items.find(item => {
          return episode.title === item.title;
        });

        const updatedEpisode = episode;

        updatedEpisode.existsOnFeed = !!feedItem;

        if (feedItem) {
          updatedEpisode.image = feedItem.image ?? existingPodcast.imageUrl;
          updatedEpisode.date = feedItem.date ?? new Date();
          updatedEpisode.description = feedItem.description;
        }

        return updatedEpisode;
      });

      await this.episodesRepository.save(...updatedAvailabilityEpisodes);

      console.log(LOG_TAG, `Added ${newPodcastEpisodes.length} new episodes`);

      await this.podcastsRepository.save(existingPodcast);
    }

    console.log(LOG_TAG, 'Feed updated.');
  }
}
