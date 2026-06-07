import { Router } from 'express';
import { getContacts, createContact } from "../controllers/contacts.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get('/', getContacts);
router.post('/', createContact);

export default router;