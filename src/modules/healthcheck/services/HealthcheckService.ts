import { inject, injectable } from 'tsyringe';
import { currentlyScheduledJobs } from '../../../shared/jobs';
import IDatabaseHealthcheckProvider from '../../../shared/providers/DatabaseHealthcheckProvider/models/IDatabaseHealthcheckProvider';
import IMessagingHealthcheckProvider from '../../../shared/providers/MessagingHealthcheckProvider/models/IMessagingHealthcheckProvider';
import IHealth from '../dtos/IHealth';

@injectable()
export default class HealthcheckService {
  constructor(
    @inject('DatabaseHealthcheckProvider')
    private databaseHealthcheckProvider: IDatabaseHealthcheckProvider,

    @inject('MessagingHealthcheckProvider')
    private messagingHealthcheckProvider: IMessagingHealthcheckProvider,
  ) {}

  public async execute(): Promise<IHealth> {
    let databaseUp = true;
    let messagingUp = true;
    let jobsUp = true;

    try {
      await this.databaseHealthcheckProvider.ping();
    } catch (err) {
      databaseUp = false;
    }

    try {
      await this.messagingHealthcheckProvider.ping();
    } catch (err) {
      messagingUp = false;
    }

    jobsUp =
      currentlyScheduledJobs.scheduled === currentlyScheduledJobs.totalJobs;

    return {
      status: databaseUp && jobsUp && messagingUp ? 'ok' : 'nok',
      uptime: process.uptime(),
      timestamp: Date.now(),
      services: {
        database: databaseUp ? 'up' : 'down',
        jobs: jobsUp ? 'up' : 'down',
        messaging: messagingUp ? 'up' : 'down',
      },
    };
  }
}
