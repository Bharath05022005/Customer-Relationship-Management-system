import { Router } from 'express';
import { getDeals, createDeal, updateDeal } from '../controllers/deals.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getDeals);
router.post('/', createDeal);
router.put('/:id', updateDeal);

export default router;
