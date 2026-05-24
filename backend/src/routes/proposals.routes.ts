import { Router } from 'express';
import { getProposals, createProposal } from '../controllers/proposals.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getProposals);
router.post('/', createProposal);

export default router;
