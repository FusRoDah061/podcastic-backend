import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import routes from './shared/routes';
import errorHandler from './shared/middlewares/errorHandler';

export default function setupWebApplication(): void {
  console.log('Setting up express application...');

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);

  // Handles celebrate validation errors
  app.use(errors());
  // Handles application errors
  app.use(errorHandler);

  const port = process.env.PORT || 3333;

  app.listen(port, () => {
    console.log(`Podcastic server running on port ${port} ...`);
  });
}
