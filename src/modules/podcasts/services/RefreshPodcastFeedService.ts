import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IFeedParserProvider from '../../../shared/providers/FeedParserProvider/models/IFeedParserProvider';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import {} from '../repositories/implementations/PodcastsRepository';

@injectable()
export default class RefreshPodcastFeedService {
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
    let podcast = await this.podcastsRepository.findByFeedUrl(rssUrl);

    if (!podcast) {
      console.log('Adding a new feed: ', rssUrl);

      try {
        await this.feedHealthcheckProvider.ping(rssUrl);
      } catch (err) {
        console.error('Error checking feed: ', err);
        throw new AppError(`Error checking feed ${rssUrl}`);
      }

      console.log('Feed url is valid');

      const feed = await this.feedParserProvider.parse(rssUrl);

      console.log('Parsed feed');

      podcast = await this.podcastsRepository.create({
        name: feed.name,
        description: feed.description,
        imageUrl: feed.image,
        feedUrl: feed.xmlUrl,
        websiteUrl: feed.link,
      });
    }

    console.log('Updating feed.');
  }
}
