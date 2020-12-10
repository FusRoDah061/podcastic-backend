import { Router } from 'express';
import HealthcheckController from '../controllers/HealthcheckController';

const router = Router();

const healthcheckController = new HealthcheckController();

router.get('/', healthcheckController.index);

export default router;
