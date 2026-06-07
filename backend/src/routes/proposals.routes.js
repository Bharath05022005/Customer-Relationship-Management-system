import { Router } from 'express';
import { getProposals, createProposal } from "../controllers/proposals.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get('/', getProposals);
router.post('/', createProposal);

export default router;