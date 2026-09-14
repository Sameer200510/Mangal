import { Request, Response, NextFunction } from 'express';
import { VerificationService } from './verification.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class VerificationController {
  static async submitDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { documentType, documentNumber, documentUrl } = req.body;

      if (!documentType || !documentNumber || !documentUrl) {
        throw ApiError.badRequest('documentType, documentNumber, and documentUrl are required');
      }

      const result = await VerificationService.submitDocument(userId, {
        documentType,
        documentNumber,
        documentUrl,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitSelfie(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { selfieUrl } = req.body;

      if (!selfieUrl) {
        throw ApiError.badRequest('selfieUrl is required');
      }

      const result = await VerificationService.submitSelfie(userId, selfieUrl);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await VerificationService.getStatus(userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAdminQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await VerificationService.getAdminQueue();

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async reviewVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user!.userId;
      const { id } = req.params;
      const { status, reviewerNotes } = req.body;

      if (!status) {
        throw ApiError.badRequest('status is required (VERIFIED or REJECTED)');
      }

      const result = await VerificationService.reviewVerification(id as string, reviewerId, status, reviewerNotes);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
