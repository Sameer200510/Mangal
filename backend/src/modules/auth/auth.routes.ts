import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router: Router = Router();

// Public Authentication Endpoints
router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authController.refresh);

// OTP Authentication Endpoints
router.post('/otp/send', authRateLimiter, authController.sendPhoneOtp);
router.post('/otp/verify', authRateLimiter, authController.verifyPhoneOtp);

// Authenticated Session Endpoints
router.get('/me', authenticateToken, authController.getMe);
router.post('/logout', authenticateToken, authController.logout);
router.post('/logout-all', authenticateToken, authController.logoutAll);
router.get('/sessions', authenticateToken, authController.getSessions);
router.delete('/sessions/:sessionId', authenticateToken, authController.revokeSession);

export default router;
