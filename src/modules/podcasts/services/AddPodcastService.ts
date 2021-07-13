import { inject, injectable } from 'tsyringe';
import messagingConfig from '../../../config/messagingConfig';
import AppError from '../../../shared/errors/AppError';
import IFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/models/IFeedHealthcheckProvider';
import IMessagingSenderProvider from '../../../shared/providers/MessagingSenderProvider/models/IMessagingSenderProvider';
import translate from '../../../shared/utils/translate';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import IPodcastRepository from '../repositories/IPodcastsRepository';

type IRequestDTO = Omit<IPodcastQueueMessage, 'id'>;

@injectable()
export default class AddPodcastService {
  constructor(
    @inject('PodcastRepository')
    private podcastsRepository: IPodcastRepository,

    @inject('MessagingSenderProvider')
    private messagingSenderProvider: IMessagingSenderProvider,

    @inject('FeedHealthcheckProvider')
    private feedHealthcheckProvider: IFeedHealthcheckProvider,
  ) {}

  public async execute(
    { feedUrl }: IRequestDTO,
    locale: string,
  ): Promise<void> {
    const podcast = await this.podcastsRepository.findByFeedUrl(feedUrl);

    if (podcast) {
      throw new AppError(translate('Podcast already exists.', locale));
    }

    try {
      await this.feedHealthcheckProvider.ping(feedUrl);
    } catch (err) {
      console.error('Error checking feed: ', err);
      throw new AppError(
        translate(
          "Couldn't reach feed. Check if the URL is correct or try again later.",
          locale,
        ),
      );
    }

    console.log('Posting new feed url to queue');

    await this.messagingSenderProvider.post({
      queueName: messagingConfig.queueNames.podcasts,
      message: {
        feedUrl,
      },
      allowRetry: true,
    });
  }
}
