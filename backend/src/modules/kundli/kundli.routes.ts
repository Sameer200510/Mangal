import { Router } from 'express';
import { KundliController } from './kundli.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

// 36 Gun Milan computation (public or authenticated)
router.post('/match', KundliController.matchKundlis);

// Verified Pandits directory
router.get('/pandits', KundliController.getPanditProfiles);

// Book consultation (requires authentication)
router.post('/book', authenticateToken, KundliController.bookConsultation);

export default router;
