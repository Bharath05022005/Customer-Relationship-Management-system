import { Router } from 'express';
import { getActivityLogs, createActivityLog } from "../controllers/activity.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get('/', getActivityLogs);
router.post('/', createActivityLog);

export default router;