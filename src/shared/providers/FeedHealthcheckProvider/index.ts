import { container } from 'tsyringe';
import AxiosFeedHealthcheckProvider from './implementations/AxiosFeedHealthcheckProvider';
import IFeedHealthcheckProvider from './models/IFeedHealthcheckProvider';

container.registerSingleton<IFeedHealthcheckProvider>(
  'FeedHealthcheckProvider',
  AxiosFeedHealthcheckProvider,
);
