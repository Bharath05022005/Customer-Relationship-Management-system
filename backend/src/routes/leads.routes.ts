import { Router } from 'express';
import { getLeads, createLead, updateLead } from '../controllers/leads.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);

export default router;
