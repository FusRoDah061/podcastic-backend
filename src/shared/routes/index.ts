import { Router } from 'express';
import podcastsRouter from '../../modules/podcasts/routes';
import healthcheckController from '../../modules/healthcheck/routes';
import usersController from '../../modules/users/routes';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 200;

export interface IPaginatedResponse<T> {
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  totalResults: number;
  data: T[];
}

const routes = Router();

routes.use('/podcasts', podcastsRouter);
routes.use('/healthcheck', healthcheckController);
routes.use('/users', usersController);

export default routes;
