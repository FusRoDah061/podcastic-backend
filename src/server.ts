import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import setupDatabase from './setupDatabase';
import setupInjections from './setupInjections';
import setupMessaging from './shared/messaging';
import setupJobs from './shared/jobs';
import setupWebApplication from './setupWebApplication';

setupDatabase().then(() => {
  setupInjections();
  setupWebApplication();
  setupMessaging();
  setupJobs();
});
