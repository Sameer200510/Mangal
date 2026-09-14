import { Router } from 'express';
import { profileController } from './profile.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router: Router = Router();

// All profile endpoints require active authentication
router.use(authenticateToken);

router.get('/me', profileController.getMyProfile);
router.put('/basic', profileController.saveBasicInfo);
router.put('/religious', profileController.saveReligiousInfo);
router.put('/education', profileController.saveEducationCareer);
router.put('/location', profileController.saveLocationFamily);
router.put('/lifestyle', profileController.saveLifestyle);
router.put('/partner-preferences', profileController.savePartnerPreferences);

router.post('/photos', profileController.uploadPhoto);
router.delete('/photos/:photoId', profileController.deletePhoto);

router.put('/privacy', profileController.updatePrivacy);
router.get('/export', profileController.exportData);
router.delete('/account', profileController.deleteAccount);

export default router;
