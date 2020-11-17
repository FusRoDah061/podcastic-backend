import { Router } from 'express';
import podcastsRouter from '../../modules/podcasts/routes';

const routes = Router();

routes.use('/podcasts', podcastsRouter);

export default routes;
