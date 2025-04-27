import express from 'express';
import { verifyToken } from "../utils/verifyToken.js";
import { chatBot } from '../controllers/chatbotController.js';

const router = express.Router();

// Workspace CRUD routes
router.post('/', verifyToken, chatBot);        // chat


export default router;