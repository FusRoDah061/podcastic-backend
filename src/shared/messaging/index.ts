import setupPodcastsMessaging from '../../modules/podcasts/messaging/setupPodcastsMessaging';

export default function setupMessaging(): void {
  console.log('Setting up queue consumers...');

  setupPodcastsMessaging();
}
