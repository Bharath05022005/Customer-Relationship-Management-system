import { Router } from 'express';
import { register, login, getUsers } from "../controllers/auth.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Only an Admin can register a new Salesman
router.post('/register', authenticate, requireAdmin, register);
router.post('/login', login);
router.get('/users', authenticate, requireAdmin, getUsers);

export default router;