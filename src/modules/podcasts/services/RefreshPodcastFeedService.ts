import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import IPodcastRepository from '../repositories/IPodcastsRepository';

@injectable()
export default class RefreshPodcastFeedService {
  constructor(
    @inject('PodcastRepository')
    private podcastsRepository: IPodcastRepository,

    @inject('FeedHealthcheckProvider')
    private feedHealthcheckProvider: IFeedHealthcheckProvider,
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
        // We don't throw error because we want the message to be consumed, otherwise it will always end up here.
        // If it is a legit feed address, but it's temporarily unavailable, the user can add it again.
        // The healthchek during the add podcast request should prevent this, though.
      }

      console.log('Feed url is valid');

      await this.podcastsRepository.create({
        name: 'Teste',
        description: 'Teste',
        image_url: 'https://via.placeholder.com/150',
        rss_url,
      });
    }
  }
}
