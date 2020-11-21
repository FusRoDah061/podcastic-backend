import { container } from 'tsyringe';
import AxiosFeedHealthcheckProvider from './implementations/AxiosFeedHealthcheckProvider';
import IFeedHealthcheckProvider from './models/IFeedHealthcheckProvider';

export default function setupFeedHealthcheckProviderInjection(): void {
  container.registerSingleton<IFeedHealthcheckProvider>(
    'FeedHealthcheckProvider',
    AxiosFeedHealthcheckProvider,
  );
}
