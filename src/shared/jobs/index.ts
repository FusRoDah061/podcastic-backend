import setupPodcastRefereshJob from '../../modules/podcasts/jobs/setupPodcastRefereshJob';

export default function setupJobs(): void {
  console.log('Setting up cron jobs...');

  setupPodcastRefereshJob();
}
