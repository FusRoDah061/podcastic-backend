import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IFeedParserProvider from '../../../shared/providers/FeedParserProvider/models/IFeedParserProvider';
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

  public async execute({ rssUrl }: IPodcastQueueMessage): Promise<void> {
    console.log('Refresh feed ', rssUrl);

    try {
      await this.feedHealthcheckProvider.ping(rssUrl);
    } catch (err) {
      console.error('Error checking feed: ', err);
      throw new AppError(`Error checking feed ${rssUrl}`);
    }

    console.log('Feed url is valid');

    let podcast = await this.podcastsRepository.findByFeedUrl(rssUrl);

    console.log('Parsed feed');

    const feed = await this.feedParserProvider.parse(rssUrl);

    if (!podcast) {
      console.log('Adding a new podcast: ', rssUrl);

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

          const audioFiles = feedItem.files.filter(file => {
            return file.mediaType?.startsWith('audio/');
          });

          return {
            title: feedItem.title,
            description: feedItem.description,
            date: feedItem.date,
            image: feedItem.image || existingPodcast.imageUrl,
            file: audioFiles[0],
          };
        });

      console.log(`Adding ${newPodcastEpisodes.length} new episodes`);

      existingPodcast.episodes.push(...newPodcastEpisodes);

      await existingPodcast.save();
    }

    console.log('Feed updated.');
  }
}
