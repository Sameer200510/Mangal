import { Request, Response, NextFunction } from 'express';
import { AiService } from './ai.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class AiController {
  static generateBio(req: Request, res: Response, next: NextFunction) {
    try {
      const details = req.body;
      const result = AiService.generateBio(details);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static explainCompatibility(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, candidateName, userProfile, candidateProfile } = req.body;

      if (!userName || !candidateName) {
        throw ApiError.badRequest('userName and candidateName are required');
      }

      const result = AiService.explainCompatibility(
        userName,
        candidateName,
        userProfile,
        candidateProfile
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static generateHoroscopeInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const { score, recommendation } = req.body;

      if (score === undefined) {
        throw ApiError.badRequest('score is required');
      }

      const result = AiService.generateHoroscopeInsight(score, recommendation);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
