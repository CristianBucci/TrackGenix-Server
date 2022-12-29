import express from 'express';
import timesheetRouter from './timeSheets';
import taskRouter from './task';
import adminRouter from './admins';
import projectsRouter from './projects';
import superAdminRouter from './superAdmin';
import employeesRouter from './employee';
import loginRouter from './login';

const router = express.Router();

router.use('/tasks', taskRouter);
router.use('/projects', projectsRouter);
router.use('/superAdmin', superAdminRouter);
router.use('/employees', employeesRouter);
router.use('/admin', adminRouter);
router.use('/timesheets', timesheetRouter);
router.use('/login', loginRouter);

export default router;
