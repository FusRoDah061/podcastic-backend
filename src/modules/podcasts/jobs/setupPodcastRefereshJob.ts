import cron from 'node-cron';
import { container } from 'tsyringe';
import SendPodcastToRefreshService from '../services/SendPodcastToRefreshService';

export default function setupPodcastRefereshJob(): void {
  console.log('Setting up podcast refresh job...');

  const cronExpression = process.env.REFRESH_JOB_CRON ?? '0 0 * * *';

  if (cron.validate(cronExpression)) {
    cron.schedule(cronExpression, async () => {
      const sendPodcastsToRefreshService = container.resolve(
        SendPodcastToRefreshService,
      );

      try {
        await sendPodcastsToRefreshService.execute();
      } catch (err) {
        console.error('Error sending podcasts to refresh: ', err);
      }
    });

    console.log('Podcast refresh job scheduled.');
  } else {
    throw new Error(
      `Invalid cron expression for refresh job: ${cronExpression}`,
    );
  }
}
