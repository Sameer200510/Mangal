import { Router } from 'express';
import { NotificationController } from './notification.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, NotificationController.getNotifications);
router.patch('/:id/read', authenticateToken, NotificationController.markAsRead);
router.post('/read-all', authenticateToken, NotificationController.markAllAsRead);

export default router;
