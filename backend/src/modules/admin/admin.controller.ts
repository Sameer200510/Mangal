import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const { status, role, search } = req.query;

      const result = await AdminService.getUsers(
        page,
        limit,
        status as any,
        role as any,
        search as string
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = req.user!.userId;
      const { id } = req.params;
      const { status, reason } = req.body;

      if (!status) throw ApiError.badRequest('status is required (ACTIVE, SUSPENDED, DELETED)');

      const result = await AdminService.updateUserStatus(id as string, status, actorId, reason);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await AdminService.getAuditLogs(limit);

      res.json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
}
