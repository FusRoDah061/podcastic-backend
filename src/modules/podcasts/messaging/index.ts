import { container } from 'tsyringe';
import messagingConfig from '../../../config/messagingConfig';
import AppError from '../../../shared/errors/AppError';
import IMessagingConsumerProvider from '../../../shared/providers/MessagingConsumerProvider/models/IMessagingConsumerProvider';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import RefreshPodcastFeedService from '../services/RefreshPodcastFeedService';

export default function setupPodcastsMessaging(): void {
  const messagingConsumer = container.resolve<IMessagingConsumerProvider>(
    'MessagingConsumerProvider',
  );

  messagingConsumer.consume({
    queueName: messagingConfig.queueNames.podcasts,
    callback: async message => {
      if (!message) return;

      console.log('Consuming message from podcasts queue.');

      const refreshPodcastService = container.resolve(
        RefreshPodcastFeedService,
      );

      const messageContent = message.content.toString();
      const parsedMessage = JSON.parse(messageContent) as IPodcastQueueMessage;

      console.log('Message: ', messageContent);

      await refreshPodcastService.execute(parsedMessage);
    },
  });
}
