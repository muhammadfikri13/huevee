import express from 'express';
import {
    createPalette,
    getAllPalettes,
    getPaletteById,
    updatePalette,
    deletePalette
} from '../controllers/paletteController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Create a new palette
router.post('/', authenticateToken, createPalette);

// Get all palettes'
router.get('/', getAllPalettes);

// Get a specific palette
router.get('/:id', getPaletteById);

// Update palette
router.put('/:id', authenticateToken, updatePalette);

// Delete palette
router.delete('/:id', authenticateToken, deletePalette);

export default router;