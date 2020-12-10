import { container } from 'tsyringe';
import RabbitmqHealthcheckProvider from './implementations/RabbitmqHealthcheckProvider';
import IMessagingHealthcheckProvider from './models/IMessagingHealthcheckProvider';

export default function setupMessagingHealthcheckProviderInjection(): void {
  container.registerSingleton<IMessagingHealthcheckProvider>(
    'MessagingHealthcheckProvider',
    RabbitmqHealthcheckProvider,
  );
}
