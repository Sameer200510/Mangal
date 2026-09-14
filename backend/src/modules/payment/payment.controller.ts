import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class PaymentController {
  static getPlans(req: Request, res: Response) {
    const plans = PaymentService.getPlans();
    res.json({
      success: true,
      data: plans,
    });
  }

  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { tier } = req.body;

      if (!tier) throw ApiError.badRequest('tier is required (SILVER, GOLD, DIAMOND)');

      const order = await PaymentService.createMembershipOrder(userId, tier);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { orderId, paymentId, signature, tier } = req.body;

      if (!orderId || !paymentId || !signature || !tier) {
        throw ApiError.badRequest('orderId, paymentId, signature, and tier are required');
      }

      const result = await PaymentService.verifyPaymentAndActivate(userId, orderId, paymentId, signature, tier);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserMembership(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await PaymentService.getUserMembership(userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
