import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import i18n from 'i18n';
import routes from './shared/routes';
import errorHandler from './shared/middlewares/errorHandler';
import localeConfig from './config/localeConfig';

export default function setupWebApplication(): void {
  console.log('Setting up express application...');

  const app = express();

  i18n.configure(localeConfig);

  app.use(cors());
  app.use(express.json());
  app.use(i18n.init);
  app.use(routes);

  // Handles celebrate validation errors
  app.use(errors());
  // Handles application errors
  app.use(errorHandler);

  const port = process.env.PORT ?? 3333;

  app.listen(port, () => {
    console.log(`Podcastic server running on port ${port} ...`);
  });
}
