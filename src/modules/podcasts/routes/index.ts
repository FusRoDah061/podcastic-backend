import { Router } from 'express';
import AddPodcastFeedController from '../controllers/AddPodcastFeedController';

const router = Router();
const addPodcastController = new AddPodcastFeedController();

router.post('/', addPodcastController.create);

export default router;
