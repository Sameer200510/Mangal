import { Router } from 'express';
import { ChatController } from './chat.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.get('/conversations', authenticateToken, ChatController.getConversations);
router.get('/conversations/:id/messages', authenticateToken, ChatController.getMessages);
router.post('/conversations/:id/messages', authenticateToken, ChatController.sendMessage);
router.patch('/conversations/:id/read', authenticateToken, ChatController.markAsRead);

// WebRTC Call endpoints
router.post('/calls/initiate', authenticateToken, ChatController.initiateCall);
router.patch('/calls/:id/status', authenticateToken, ChatController.updateCallStatus);

export default router;
