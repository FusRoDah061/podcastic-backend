import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import AddPodcastFeedController from '../controllers/AddPodcastFeedController';

const router = Router();
const addPodcastController = new AddPodcastFeedController();

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      rss_url: Joi.string().uri().required(),
    },
  }),
  addPodcastController.create,
);

export default router;
