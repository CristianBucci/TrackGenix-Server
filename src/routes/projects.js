import express from 'express';
import dataValidator from '../validations/projects';
import dbController from '../controllers/projects';
import checkAuth from '../middlewares/authMiddleware';

import { ADMIN, EMPLOYEE } from '../constants/roles';

const router = express.Router();

router.get('/', checkAuth([ADMIN, EMPLOYEE]), dbController.getAllProjects);
router.get('/:id', checkAuth([ADMIN, EMPLOYEE]), dbController.getProjectById);
router.post('/', checkAuth([ADMIN]), dataValidator, dbController.createProject);
router.put('/:id', checkAuth([ADMIN, EMPLOYEE]), dataValidator, dbController.editProject);
router.delete('/:id', checkAuth([ADMIN]), dbController.deleteById);

export default router;
