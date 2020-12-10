import { Router } from 'express';
import podcastsRouter from '../../modules/podcasts/routes';
import healthcheckController from '../../modules/healthcheck/routes';

const routes = Router();

routes.use('/podcasts', podcastsRouter);
routes.use('/healthcheck', healthcheckController);

export default routes;
