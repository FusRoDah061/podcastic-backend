import { container } from 'tsyringe';
import messaginConfig from '../../../config/messagingConfig';
import RabbitMqMessagingSenderProvider from './implementations/RabbitMqMessagingSenderProvider';
import IMessagingSenderProvider from './models/IMessagingSenderProvider';

export default function setupMessagingSenderProviderInjection(): void {
  const providers = {
    rabbit: RabbitMqMessagingSenderProvider,
  };

  container.registerSingleton<IMessagingSenderProvider>(
    'MessagingSenderProvider',
    providers[messaginConfig.driver],
  );
}
