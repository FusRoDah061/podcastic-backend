import { inject, injectable } from 'tsyringe';
import messagingConfig from '../../../config/messagingConfig';
import IMessagingSenderProvider from '../../../shared/providers/MessagingSenderProvider/models/IMessagingSenderProvider';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';

type IRequestDTO = Omit<IPodcastQueueMessage, 'id'>;

@injectable()
export default class AddPodcastFeedService {
  constructor(
    @inject('MessagingSenderProvider')
    private messagingSenderProvider: IMessagingSenderProvider,
  ) {}

  public async execute({ rss_url }: IRequestDTO): Promise<void> {
    // TODO: Fazer uma chamada para a url e ver se existe

    console.log('Posting new feed url to queue');

    await this.messagingSenderProvider.post({
      queueName: messagingConfig.queueNames.podcasts,
      message: {
        rss_url,
      },
    });
  }
}
