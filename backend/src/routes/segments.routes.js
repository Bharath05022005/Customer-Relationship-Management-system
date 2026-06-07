import { Router } from 'express';
import { getSegments, createSegment } from "../controllers/segments.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get('/', getSegments);
router.post('/', createSegment);

export default router;