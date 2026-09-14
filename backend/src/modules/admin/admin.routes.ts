import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

const router = Router();

// Strict Admin/Moderator protection
router.use(authenticateToken);
router.use(requireRole('ADMIN', 'MODERATOR'));

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
