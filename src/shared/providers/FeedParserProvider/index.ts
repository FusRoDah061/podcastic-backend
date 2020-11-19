import { container } from 'tsyringe';
import FeedParserProvider from './implementations/FeedParserProvider';
import IFeedParserProvider from './models/IFeedParserProvider';

container.registerSingleton<IFeedParserProvider>(
  'FeedParserProvider',
  FeedParserProvider,
);
