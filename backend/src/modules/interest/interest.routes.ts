import { Router } from 'express';
import { InterestController } from './interest.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.post('/swipe', authenticateToken, InterestController.handleSwipe);
router.post('/undo', authenticateToken, InterestController.undoSwipe);
router.get('/deck', authenticateToken, InterestController.getSwipeDeck);
router.get('/received', authenticateToken, InterestController.getReceivedInterests);
router.get('/sent', authenticateToken, InterestController.getSentInterests);
router.patch('/:id/respond', authenticateToken, InterestController.respondToInterest);

export default router;
