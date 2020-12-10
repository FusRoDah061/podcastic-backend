import setupDatabaseHealthcheckProviderInjection from './DatabaseHealthcheckProvider';
import setupFeedHealthcheckProviderInjection from './FeedHealthcheckProvider';
import setupFeedParserProviderInjection from './FeedParserProvider';
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
}
