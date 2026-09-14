import { Router } from 'express';
import { PaymentController } from './payment.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

// Public plan catalog
router.get('/plans', PaymentController.getPlans);

// Authenticated user billing endpoints
router.post('/orders', authenticateToken, PaymentController.createOrder);
router.post('/verify', authenticateToken, PaymentController.verifyPayment);
router.get('/my-subscription', authenticateToken, PaymentController.getUserMembership);

export default router;
