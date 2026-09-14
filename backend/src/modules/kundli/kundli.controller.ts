import { Request, Response, NextFunction } from 'express';
import { KundliService } from './kundli.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class KundliController {
  static async matchKundlis(req: Request, res: Response, next: NextFunction) {
    try {
      const { groom, bride } = req.body;

      if (!groom || !bride) {
        throw ApiError.badRequest('Groom and Bride astrological details are required');
      }

      const report = KundliService.matchKundlis(groom, bride);

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPanditProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const pandits = await KundliService.getPanditProfiles();

      res.json({
        success: true,
        data: pandits,
      });
    } catch (error) {
      next(error);
    }
  }

  static async bookConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { panditProfileId, serviceType, scheduledDate, notes } = req.body;

      if (!panditProfileId || !serviceType || !scheduledDate) {
        throw ApiError.badRequest('panditProfileId, serviceType, and scheduledDate are required');
      }

      const booking = await KundliService.bookConsultation(
        userId,
        panditProfileId,
        serviceType,
        scheduledDate,
        notes
      );

      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}
