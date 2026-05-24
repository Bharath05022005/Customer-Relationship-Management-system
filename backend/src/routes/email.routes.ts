import { Router } from 'express';
import { sendEmail } from '../controllers/email.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/send', sendEmail);

export default router;
