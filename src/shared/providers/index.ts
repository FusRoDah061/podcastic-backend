import setupDatabaseHealthcheckProviderInjection from './DatabaseHealthcheckProvider';
import setupDownloadFileProviderInjection from './DownloadFileProvider';
import setupFeedHealthcheckProviderInjection from './FeedHealthcheckProvider';
import setupFeedParserProviderInjection from './FeedParserProvider';
import setupHashProviderInjection from './HashProvider';
import setupMessagingConsumerProviderInjection from './MessagingConsumerProvider';
import setupMessagingHealthcheckProviderInjection from './MessagingHealthcheckProvider';
import setupMessagingSenderProviderInjection from './MessagingSenderProvider';

export default function setupProviderInjections(): void {
  setupFeedHealthcheckProviderInjection();
  setupFeedParserProviderInjection();
  setupMessagingConsumerProviderInjection();
  setupMessagingSenderProviderInjection();
  setupDatabaseHealthcheckProviderInjection();
  setupMessagingHealthcheckProviderInjection();
  setupDownloadFileProviderInjection();
  setupHashProviderInjection();
}
