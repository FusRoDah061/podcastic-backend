import setupFeedHealthcheckProviderInjection from './FeedHealthcheckProvider';
import setupFeedParserProviderInjection from './FeedParserProvider';
import setupMessagingConsumerProviderInjection from './MessagingConsumerProvider';
import setupMessagingSenderProviderInjection from './MessagingSenderProvider';

export default function setupProviderInjections(): void {
  setupFeedHealthcheckProviderInjection();
  setupFeedParserProviderInjection();
  setupMessagingConsumerProviderInjection();
  setupMessagingSenderProviderInjection();
}
