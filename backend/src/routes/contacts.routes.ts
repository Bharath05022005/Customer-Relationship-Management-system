import { Router } from 'express';
import { getContacts, createContact } from '../controllers/contacts.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getContacts);
router.post('/', createContact);

export default router;
