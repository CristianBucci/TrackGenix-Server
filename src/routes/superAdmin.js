import express from 'express';
import superAdminControllers from '../controllers/superAdmin';
import { validateCreation, validateUpdate } from '../validations/admins';

const router = express.Router();

router.get('/', superAdminControllers.getAllSuperAdmins);
router.get('/:id', superAdminControllers.getSuperAdminById);
router.post('/', validateCreation, superAdminControllers.createSuperAdmin);
router.put('/:id', validateUpdate, superAdminControllers.editSuperAdmin);
router.delete('/:id', superAdminControllers.deleteSuperAdmin);

export default router;
