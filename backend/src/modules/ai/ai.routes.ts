import { Router } from 'express';
import { AiController } from './ai.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.post('/generate-bio', authenticateToken, AiController.generateBio);
router.post('/explain-compatibility', authenticateToken, AiController.explainCompatibility);
router.post('/horoscope-insight', authenticateToken, AiController.generateHoroscopeInsight);

export default router;
