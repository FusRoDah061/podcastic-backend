import { inject, injectable } from 'tsyringe';
import messagingConfig from '../../../config/messagingConfig';
import IMessagingSenderProvider from '../../../shared/providers/MessagingSenderProvider/models/IMessagingSenderProvider';
import IPodcastRepository from '../repositories/IPodcastsRepository';

@injectable()
export default class SendPodcastToRefresh {
  constructor(
    @inject('MessagingSenderProvider')
    private messagingSenderProvider: IMessagingSenderProvider,

    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute(): Promise<void> {
    const podcasts = await this.podcastRepository.findAll();
    const postPromises: Promise<void>[] = [];

    podcasts.forEach(podcast => {
      postPromises.push(
        this.messagingSenderProvider.post({
          queueName: messagingConfig.queueNames.podcasts,
          message: {
            feedUrl: podcast.feedUrl,
          },
        }),
      );
    });

    await Promise.all(postPromises);
  }
}
