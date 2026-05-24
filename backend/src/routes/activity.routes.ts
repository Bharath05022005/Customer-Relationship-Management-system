import { Router } from 'express';
import { getActivityLogs, createActivityLog } from '../controllers/activity.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getActivityLogs);
router.post('/', createActivityLog);

export default router;
