import express from 'express';
import testLogin from '../controllers/login';

const router = express.Router();

router.post('/', testLogin);

export default router;
