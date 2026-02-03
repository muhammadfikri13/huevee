import express from 'express';
import { register, login, resetPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', authenticateToken, resetPassword);

export default router;
