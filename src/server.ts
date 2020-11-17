import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './shared/routes';
import setupDatabase from './setupDatabase';
import setupInjections from './setupInjections';
import setupMessaging from './shared/messaging';

setupDatabase().then(() => {
  setupInjections();
  setupMessaging();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);

  const port = process.env.PORT || 3333;

  app.listen(port, () => {
    console.log(`Podcastic server running on port ${port} ...`);
  });
});
