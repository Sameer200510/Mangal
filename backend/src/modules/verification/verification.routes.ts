import { Router } from 'express';
import { VerificationController } from './verification.controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

const router = Router();

// User verification endpoints (authenticated)
router.post('/upload-id', authenticateToken, VerificationController.submitDocument);
router.post('/selfie', authenticateToken, VerificationController.submitSelfie);
router.get('/status', authenticateToken, VerificationController.getStatus);

// Admin / Moderator verification review endpoints
router.get(
  '/admin/queue',
  authenticateToken,
  requireRole('ADMIN', 'MODERATOR'),
  VerificationController.getAdminQueue
);

router.patch(
  '/admin/review/:id',
  authenticateToken,
  requireRole('ADMIN', 'MODERATOR'),
  VerificationController.reviewVerification
);

export default router;
