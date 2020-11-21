import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import AllPodcastsController from '../controllers/AllPodcastsController';
import RecentPodcastsController from '../controllers/RecentPodcastsController';
import SearchPodcastsController from '../controllers/SearchPodcastsController';

const router = Router();
const allPodcastsController = new AllPodcastsController();
const searchPodcastsController = new SearchPodcastsController();
const recentPodcastsController = new RecentPodcastsController();

router.get('/', allPodcastsController.index);
router.get('/search', searchPodcastsController.list);
router.get('/recent', recentPodcastsController.index);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      rssUrl: Joi.string().uri().required(),
    },
  }),
  allPodcastsController.create,
);

export default router;
