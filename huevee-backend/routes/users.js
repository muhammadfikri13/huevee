import express from 'express';
import { getAllUsers, deleteUser, changeUserPassword } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { requireRoot } from '../middleware/requireRoot.js';

const router = express.Router();

// Get all users (root only)
router.get('/', authenticateToken, requireRoot, getAllUsers);

// Delete user (root only)
router.delete('/:id', authenticateToken, requireRoot, deleteUser);

// Change user password (root only)
router.post('/:id/change-password', authenticateToken, requireRoot, changeUserPassword);

export default router;
