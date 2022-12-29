import express from 'express';
import adminControllers from '../controllers/admins';
import checkAuth from '../middlewares/authMiddleware';
import { validateCreation, validateUpdate } from '../validations/admins';
import { ADMIN, SUPER_ADMIN } from '../constants/roles';

const router = express.Router();

router.get('/', checkAuth([SUPER_ADMIN, ADMIN]), adminControllers.getAllAdmins);
router.get('/:id', checkAuth([SUPER_ADMIN, ADMIN]), adminControllers.getAdminById);
router.post('/', checkAuth([SUPER_ADMIN]), validateCreation, adminControllers.createAdmin);
router.put('/:id', checkAuth([SUPER_ADMIN, ADMIN]), validateUpdate, adminControllers.editAdmin);
router.delete('/:id', checkAuth([SUPER_ADMIN]), adminControllers.deleteAdmin);

export default router;
