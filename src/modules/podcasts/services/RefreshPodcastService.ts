import { inject, injectable } from 'tsyringe';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
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

    try {
      await this.feedHealthcheckProvider.ping(feedUrl);
    } catch (err) {
      console.error(`Error checking feed ${feedUrl}: `, err);
      throw new Error(`Error checking feed ${feedUrl}`);
    }

    console.log('Feed url is valid');

    let podcast = await this.podcastsRepository.findByFeedUrl(feedUrl);

    console.log('Parsed feed');

    const feed = await this.feedParserProvider.parse(feedUrl);

    if (!podcast) {
      console.log('Adding a new podcast: ', feedUrl);

      podcast = await this.podcastsRepository.create({
        name: feed.name,
        description: feed.description,
        imageUrl: feed.image,
        feedUrl: feed.xmlUrl,
        websiteUrl: feed.link,
      });
    }

    console.log('Updating feed.');

    if (podcast) {
      const existingPodcast = podcast;

      const newPodcastEpisodes: Array<IEpisode> = feed.items
        .filter(feedItem => {
          // Keep only feed items that have an audio file

          const audioFile = feedItem.files.find(file => {
            return file.mediaType?.startsWith('audio/');
          });

          return !!audioFile;
        })
        .filter(feedItem => {
          // Keep only items that don't already exist

          const episodeExists = existingPodcast.episodes.find(episode => {
            return episode.title === feedItem.title;
          });

          return !episodeExists;
        })
        .map(feedItem => {
          // Normalize output

          const audioFile = feedItem.files.filter(file => {
            return file.mediaType?.startsWith('audio/');
          })[0];

          // Prefer itunes duration since it might be more precise and already formatted
          let audioDuration = feedItem.itunesDuration;

          if (audioDuration && !audioDuration.includes(':')) {
            audioDuration = formatDuration(Number(audioDuration) * 1000);
          }

          return {
            title: feedItem.title,
            description: feedItem.description,
            date: feedItem.date || new Date(),
            image: feedItem.image || existingPodcast.imageUrl,
            duration: audioDuration as string,
            file: {
              url: audioFile.url,
              mediaType: audioFile.mediaType || 'audio/mpeg',
            },
          };
        });

      console.log(`Adding ${newPodcastEpisodes.length} new episodes`);

      existingPodcast.episodes.push(...newPodcastEpisodes);

      await existingPodcast.save();
    }

    console.log('Feed updated.');
  }
}
