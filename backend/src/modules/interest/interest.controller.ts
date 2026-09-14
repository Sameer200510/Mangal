import { Request, Response, NextFunction } from 'express';
import { InterestService } from './interest.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class InterestController {
  static async handleSwipe(req: Request, res: Response, next: NextFunction) {
    try {
      const swiperId = req.user!.userId;
      const { swipedId, action } = req.body;

      if (!swipedId || !action) {
        throw ApiError.badRequest('swipedId and action (LIKE, DISLIKE, SUPERLIKE) are required');
      }

      const result = await InterestService.handleSwipe(swiperId, swipedId, action);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async undoSwipe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await InterestService.undoLastSwipe(userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSwipeDeck(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 20;

      const candidates = await InterestService.getSwipeDeck(userId, limit);

      res.json({
        success: true,
        data: candidates,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReceivedInterests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const interests = await InterestService.getReceivedInterests(userId);

      res.json({
        success: true,
        data: interests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSentInterests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const interests = await InterestService.getSentInterests(userId);

      res.json({
        success: true,
        data: interests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async respondToInterest(req: Request, res: Response, next: NextFunction) {
    try {
      const receiverId = req.user!.userId;
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
        throw ApiError.badRequest('status must be ACCEPTED or REJECTED');
      }

      const result = await InterestService.respondToInterest(id as string, receiverId, status);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
