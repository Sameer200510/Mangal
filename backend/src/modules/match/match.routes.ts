import { Router } from 'express';
import { MatchController } from './match.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.get('/recommendations', authenticateToken, MatchController.getRecommendations);
router.post('/search', authenticateToken, MatchController.searchProfiles);
router.get('/mutual', authenticateToken, MatchController.getMutualMatches);

export default router;
