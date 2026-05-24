import { Router } from 'express';
import { getSegments, createSegment } from '../controllers/segments.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getSegments);
router.post('/', createSegment);

export default router;
