import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IFeedParserProvider from '../../../shared/providers/FeedParserProvider/models/IFeedParserProvider';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import IPodcastRepository from '../repositories/IPodcastsRepository';

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

  public async execute({ rss_url }: IPodcastQueueMessage): Promise<void> {
    console.log('Refresh feed ', rss_url);
    const podcast = await this.podcastsRepository.findByRssUrl(rss_url);

    if (!podcast) {
      console.log('Adding a new feed: ', rss_url);

      try {
        await this.feedHealthcheckProvider.ping(rss_url);
      } catch (err) {
        console.error('Error checking feed: ', err);
        throw new AppError(`Error checking feed ${rss_url}`);
      }

      console.log('Feed url is valid');

      const feed = await this.feedParserProvider.parse(rss_url);

      console.log('Parsed feed');

      await this.podcastsRepository.create({
        name: feed.name,
        description: feed.description,
        image_url: feed.image,
        rss_url: feed.xmlUrl,
        website_url: feed.link,
      });
    }

    console.log('Updating feed.');
  }
}
