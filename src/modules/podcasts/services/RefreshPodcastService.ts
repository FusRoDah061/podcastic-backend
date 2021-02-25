import { inject, injectable } from 'tsyringe';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IFeed from '../../../shared/providers/FeedParserProvider/dtos/IFeed';
import IFeedItem from '../../../shared/providers/FeedParserProvider/dtos/IFeedItem';
import IFeedParserProvider from '../../../shared/providers/FeedParserProvider/models/IFeedParserProvider';
import formatDuration from '../../../shared/utils/formatDuration';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IEpisode } from '../schemas/Podcast';

@injectable()
export default class RefreshPodcastService {
  constructor(
    @inject('PodcastRepository')
    private podcastsRepository: IPodcastRepository,

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

        await podcast.updateOne({
          isServiceAvailable: false,
        });

        await podcast.save();
      } else {
        // If the podcast doesn't exist, we throw an error so that the message consumption is rolled back to be reprocessed later
        throw new Error(`Error checking feed ${feedUrl}`);
      }
    }

    console.log(LOG_TAG, 'Parsing feed');

    let feed: IFeed;

    try {
      feed = await this.feedParserProvider.parse(feedUrl);
    } catch (err) {
      console.error(LOG_TAG, `Error reading feed: `, err);
      throw new Error(`Error reading feed ${feedUrl}`);
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

    console.log(LOG_TAG, 'Updating episodes.');

    if (podcast) {
      const existingPodcast = podcast;
      const newPodcastEpisodes: Array<IEpisode> = [];

      await existingPodcast.updateOne({
        isServiceAvailable: true,
        lastSuccessfulHealthcheckAt: new Date(),
        imageUrl: feed.image,
      });

      // Loop through feed items to create or update episodes
      feed.items.forEach(feedItem => {
        let existingEpisode = existingPodcast.episodes.find(episode => {
          return episode.title === feedItem.title;
        });

        const audioFile = feedItem.files.find(file => {
          return file.mediaType?.startsWith('audio/');
        });

        // If an audio file wasn't found, we ignore this item
        if (!audioFile) return;

        // Prefer itunes duration since it might be more accurate and already formatted
        let audioDuration = feedItem.itunesDuration?.trim();

        if (audioDuration && !audioDuration.includes(':')) {
          audioDuration = formatDuration(Number(audioDuration) * 1000);
        }

        const episodeObject = {
          title: feedItem.title,
          description: feedItem.description,
          date: feedItem.date ?? new Date(),
          image: feedItem.image ?? existingPodcast.imageUrl,
          duration: audioDuration as string,
          file: {
            url: audioFile.url,
            mediaType: audioFile.mediaType ?? 'audio/mpeg',
            sizeBytes: Number(audioFile.length ?? 0),
          },
        };

        if (!existingEpisode) {
          // Create the new episode
          newPodcastEpisodes.push(episodeObject);
        } else {
          // Update the episode
          existingEpisode = {
            ...existingEpisode,
            ...episodeObject,
          };
        }
      });

      console.log(
        LOG_TAG,
        "Updating episodes that aren't available on the feed",
      );

      // Update existing episodes that don't exist on feed anymore
      const updatedEpisodes = existingPodcast.episodes.map<IEpisode>(
        episode => {
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
        },
      );

      console.log(LOG_TAG, `Adding ${newPodcastEpisodes.length} new episodes`);

      // Add new podcasts
      const allEpisodes = updatedEpisodes;
      allEpisodes.push(...newPodcastEpisodes);

      await existingPodcast.updateOne({
        episodes: allEpisodes,
      });

      await existingPodcast.save();
    }

    console.log(LOG_TAG, 'Feed updated.');
  }
}
