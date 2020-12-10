import setupPodcastRefereshJob from '../../modules/podcasts/jobs/setupPodcastRefereshJob';

export const currentlyScheduledJobs = {
  totalJobs: 1,
  scheduled: 0,
};

export default function setupJobs(): void {
  console.log('Setting up cron jobs...');

  try {
    setupPodcastRefereshJob();
    currentlyScheduledJobs.scheduled += 1;
  } catch (err) {
    console.error('Error scheduling podcast refresh job');
  }
}
