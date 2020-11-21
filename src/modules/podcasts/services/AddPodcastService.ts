import { inject, injectable } from 'tsyringe';
import messagingConfig from '../../../config/messagingConfig';
import AppError from '../../../shared/errors/AppError';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IMessagingSenderProvider from '../../../shared/providers/MessagingSenderProvider/models/IMessagingSenderProvider';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';

type IRequestDTO = Omit<IPodcastQueueMessage, 'id'>;

@injectable()
export default class AddPodcastService {
  constructor(
    @inject('MessagingSenderProvider')
    private messagingSenderProvider: IMessagingSenderProvider,

    @inject('FeedHealthcheckProvider')
    private feedHealthcheckProvider: IFeedHealthcheckProvider,
  ) {}

  public async execute({ feedUrl }: IRequestDTO): Promise<void> {
    try {
      await this.feedHealthcheckProvider.ping(feedUrl);
    } catch (err) {
      console.error('Error checking feed: ', err);
      throw new AppError(
        "Couldn't reach feed. Check if the URL is correct or try again later.",
      );
    }

    console.log('Posting new feed url to queue');

    await this.messagingSenderProvider.post({
      queueName: messagingConfig.queueNames.podcasts,
      message: {
        feedUrl,
      },
    });
  }
}
