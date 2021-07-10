import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import AllPodcastsController from '../controllers/AllPodcastsController';
import EpisodesController from '../controllers/EpisodesController';
import PodcastsController from '../controllers/PodcastsController';
import RandomEpisodeController from '../controllers/RandomEpisodeController';
import RecentPodcastsController from '../controllers/RecentPodcastsController';
import SearchPodcastsController from '../controllers/SearchPodcastsController';

const router = Router();
const allPodcastsController = new AllPodcastsController();
const searchPodcastsController = new SearchPodcastsController();
const recentPodcastsController = new RecentPodcastsController();
const episodesController = new EpisodesController();
const podcastsController = new PodcastsController();
const randomEpisodeController = new RandomEpisodeController();

router.get('/', allPodcastsController.index);
router.get('/recent', recentPodcastsController.index);

router.get(
  '/search',
  celebrate({
    [Segments.QUERY]: {
      q: Joi.string().required(),
    },
  }),
  searchPodcastsController.list,
);

router.get(
  '/:podcastId',
  celebrate({
    [Segments.PARAMS]: {
      podcastId: Joi.string().required(),
    },
  }),
  podcastsController.index,
);

router.get(
  '/:podcastId/episodes',
  celebrate({
    [Segments.PARAMS]: {
      podcastId: Joi.string().required(),
    },
    [Segments.QUERY]: {
      sort: Joi.string()
        .valid('newest', 'oldest', 'longest', 'shortest')
        .empty('')
        .default('newest'),
      q: Joi.string().optional().allow(''),
    },
  }),
  episodesController.index,
);

router.get(
  '/:podcastId/episodes/random',
  celebrate({
    [Segments.PARAMS]: {
      podcastId: Joi.string().required(),
    },
  }),
  randomEpisodeController.index,
);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      feedUrl: Joi.string().uri().required(),
    },
  }),
  allPodcastsController.create,
);

export default router;
