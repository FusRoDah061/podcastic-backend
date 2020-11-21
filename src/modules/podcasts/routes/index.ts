import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import PodcastController from '../controllers/PodcastController';

const router = Router();
const podcastController = new PodcastController();

router.get('/', podcastController.index);
router.get('/search', podcastController.list);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      rssUrl: Joi.string().uri().required(),
    },
  }),
  podcastController.create,
);

export default router;
