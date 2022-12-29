import express from 'express';
import TimesheetController from '../controllers/timeSheet';
import timesheetValidation from '../validations/timeSheet';
import checkAuth from '../middlewares/authMiddleware';

import { ADMIN, EMPLOYEE } from '../constants/roles';

const router = express.Router();

router.get('/', checkAuth([ADMIN, EMPLOYEE]), TimesheetController.getAllTimesheets);
router.get('/:id', checkAuth([ADMIN, EMPLOYEE]), TimesheetController.getTimesheetById);
router.post('/', checkAuth([ADMIN, EMPLOYEE]), timesheetValidation.validateCreate, TimesheetController.createTimesheet);
router.put('/:id', checkAuth([ADMIN, EMPLOYEE]), timesheetValidation.validateUpdate, TimesheetController.editTimesheet);
router.delete('/:id', checkAuth([ADMIN, EMPLOYEE]), TimesheetController.deleteTimesheet);

export default router;
