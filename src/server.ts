import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import routes from './shared/routes';
import setupDatabase from './setupDatabase';
import setupInjections from './setupInjections';
import setupMessaging from './shared/messaging';
import errorHandler from './shared/middlewares/errorHandler';

setupDatabase().then(() => {
  setupInjections();
  setupMessaging();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);

  // Handles celebrate validation errors
  app.use(errors());

  app.use(errorHandler);

  const port = process.env.PORT || 3333;

  app.listen(port, () => {
    console.log(`Podcastic server running on port ${port} ...`);
  });
});
