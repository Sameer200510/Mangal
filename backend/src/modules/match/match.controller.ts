import { Request, Response, NextFunction } from 'express';
import { MatchService } from './match.service.js';

export class MatchController {
  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;

      const result = await MatchService.getRecommendations(userId, page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const criteria = req.body;

      const result = await MatchService.searchProfiles(userId, criteria);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMutualMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await MatchService.getMutualMatches(userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
