import { Router } from 'express';
import { healthController } from '../controllers/health.controller.ts';

const router = Router();

router.get('/', (req, res) => healthController.checkHealth(req, res));

export default router;
