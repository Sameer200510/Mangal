import { Request, Response, NextFunction } from 'express';
import { profileService } from './profile.service.js';
import {
  basicInfoSchema,
  religiousAstrologySchema,
  educationCareerSchema,
  locationFamilySchema,
  lifestyleSchema,
  partnerPreferencesSchema,
  ApiResponse,
} from '../../common/index.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class ProfileController {
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const profile = await profileService.getOrCreateProfile(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: { profile },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async saveBasicInfo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const validated = basicInfoSchema.parse(req.body);
      const profile = await profileService.saveBasicInfo(req.user.userId, validated);

      const response: ApiResponse = {
        success: true,
        message: 'Basic information updated',
        data: { profile },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async saveReligiousInfo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const validated = religiousAstrologySchema.parse(req.body);
      const profile = await profileService.saveReligiousInfo(req.user.userId, validated);

      const response: ApiResponse = {
        success: true,
        message: 'Religious & astrological details updated',
        data: { profile },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async saveEducationCareer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const validated = educationCareerSchema.parse(req.body);
      const profile = await profileService.saveEducationCareer(req.user.userId, validated);

      const response: ApiResponse = {
        success: true,
        message: 'Education & career details updated',
        data: { profile },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async saveLocationFamily(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const validated = locationFamilySchema.parse(req.body);
      const profile = await profileService.saveLocationFamily(req.user.userId, validated);

      const response: ApiResponse = {
        success: true,
        message: 'Location & family background updated',
        data: { profile },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async saveLifestyle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const validated = lifestyleSchema.parse(req.body);
      const profile = await profileService.saveLifestyle(req.user.userId, validated);

      const response: ApiResponse = {
        success: true,
        message: 'Lifestyle preferences updated',
        data: { profile },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async savePartnerPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const validated = partnerPreferencesSchema.parse(req.body);
      const preferences = await profileService.savePartnerPreferences(req.user.userId, validated);

      const response: ApiResponse = {
        success: true,
        message: 'Partner preferences updated',
        data: { preferences },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async uploadPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const { fileName, base64Data, isPrimary } = req.body;

      if (!fileName || !base64Data) {
        throw ApiError.badRequest('fileName and base64Data are required');
      }

      const buffer = Buffer.from(base64Data, 'base64');
      const photo = await profileService.uploadPhoto(req.user.userId, buffer, fileName, isPrimary);

      const response: ApiResponse = {
        success: true,
        message: 'Photo uploaded successfully',
        data: { photo },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  async deletePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const { photoId } = req.params;

      await profileService.deletePhoto(req.user.userId, photoId as string);

      const response: ApiResponse = {
        success: true,
        message: 'Photo removed successfully',
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async updatePrivacy(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const { isProfilePublic, isPhotoVisible } = req.body;

      const profile = await profileService.updatePrivacy(
        req.user.userId,
        Boolean(isProfilePublic),
        Boolean(isPhotoVisible)
      );

      const response: ApiResponse = {
        success: true,
        message: 'Privacy settings updated',
        data: { profile },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async exportData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const data = await profileService.exportData(req.user.userId);

      const response: ApiResponse = {
        success: true,
        message: 'Exported complete personal data archive',
        data,
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      await profileService.deleteAccount(req.user.userId);

      const response: ApiResponse = {
        success: true,
        message: 'Your account and all associated matrimonial data have been permanently deleted.',
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export const profileController = new ProfileController();
