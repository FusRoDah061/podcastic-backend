import { container } from 'tsyringe';
import RabbitMqMessagingConsumerProvider from './implementations/RabbitMqMessagingConsumerProvider';
import IMessagingConsumerProvider from './models/IMessagingConsumerProvider';
import messaginConfig from '../../../config/messagingConfig';

export default function setupMessagingConsumerProviderInjection(): void {
  const providers = {
    rabbit: new RabbitMqMessagingConsumerProvider(),
  };

  container.registerInstance<IMessagingConsumerProvider>(
    'MessagingConsumerProvider',
    providers[messaginConfig.driver],
  );
}
