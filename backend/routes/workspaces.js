import express from 'express';
import {
    createWorkspace,
    getAllWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
} from '../controllers/workspaceController.js';
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Workspace CRUD routes
router.post('/', verifyToken, createWorkspace);        // Create
router.get('/', verifyToken, getAllWorkspaces);        // Read (All)
router.get('/:id', verifyToken, getWorkspaceById);     // Read (Single)
router.put('/:id', verifyToken, updateWorkspace);      // Update
router.delete('/:id', verifyToken, deleteWorkspace);   // Delete

export default router;