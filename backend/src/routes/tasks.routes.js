import { Router } from 'express';
import { getTasks, createTask, updateTask } from "../controllers/tasks.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);

export default router;