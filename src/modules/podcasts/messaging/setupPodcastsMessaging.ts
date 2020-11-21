import { container } from 'tsyringe';
import messagingConfig from '../../../config/messagingConfig';
import IMessagingConsumerProvider from '../../../shared/providers/MessagingConsumerProvider/models/IMessagingConsumerProvider';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import RefreshPodcastService from '../services/RefreshPodcastService';

export default function setupPodcastsMessaging(): void {
  console.log('Setting up podcasts queue consumer...');

  const messagingConsumer = container.resolve<IMessagingConsumerProvider>(
    'MessagingConsumerProvider',
  );

  messagingConsumer.consume({
    queueName: messagingConfig.queueNames.podcasts,
    callback: async message => {
      if (!message) return;

      console.log('Consuming message from podcasts queue.');

      const refreshPodcastService = container.resolve(RefreshPodcastService);

      const messageContent = message.content.toString();
      const parsedMessage = JSON.parse(messageContent) as IPodcastQueueMessage;

      console.log('Message: ', messageContent);

      try {
        await refreshPodcastService.execute(parsedMessage);
      } catch (err) {
        // We don't throw an error because we want the message to be consumed, otherwise it will always end up here.
        // If it is a legit feed address, but it's temporarily unavailable, the user can add it again.
        // The healthchek during the add podcast request should prevent this, though.
      }
    },
  });

  console.log('Podcasts queue consumer started.');
}
