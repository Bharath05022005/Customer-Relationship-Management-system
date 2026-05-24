import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Only an Admin can register a new Salesman
router.post('/register', authenticate, requireAdmin, register);
router.post('/login', login);
router.get('/users', authenticate, requireAdmin, require('../controllers/auth.controller').getUsers);

export default router;
