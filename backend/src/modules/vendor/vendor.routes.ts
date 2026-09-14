import { Router } from 'express';
import { VendorController } from './vendor.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.get('/', VendorController.getListings);
router.get('/:id', VendorController.getListingById);
router.post('/quote', authenticateToken, VendorController.requestQuote);

export default router;
