import { container } from 'tsyringe';
import FeedParserProvider from './implementations/FeedParserProvider';
import IFeedParserProvider from './models/IFeedParserProvider';

export default function setupFeedParserProviderInjection(): void {
  container.registerSingleton<IFeedParserProvider>(
    'FeedParserProvider',
    FeedParserProvider,
  );
}
