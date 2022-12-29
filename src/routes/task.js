import express from 'express';
import tasksControllers from '../controllers/task';
import tasksValidations from '../validations/task';
import checkAuth from '../middlewares/authMiddleware';

import { ADMIN, EMPLOYEE } from '../constants/roles';

const router = express.Router();

router.get('/', checkAuth([ADMIN, EMPLOYEE]), tasksControllers.getAllTasks);
router.get('/:id', checkAuth([ADMIN, EMPLOYEE]), tasksControllers.getTaskById);
router.post('/', checkAuth([ADMIN]), tasksValidations.updateTaskValidation, tasksControllers.createTask);
router.put('/:id', checkAuth([ADMIN]), tasksValidations.updateTaskValidation, tasksControllers.editTask);
router.delete('/:id', checkAuth([ADMIN]), tasksControllers.deleteTask);

export default router;
