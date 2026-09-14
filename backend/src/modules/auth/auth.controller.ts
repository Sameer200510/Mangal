import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import {
  registerSchema,
  loginSchema,
  phoneOtpRequestSchema,
  phoneOtpVerifySchema,
  ApiResponse,
} from '../../common/index.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const meta = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const result = await authService.register(validated, meta);

      const response: ApiResponse = {
        success: true,
        message: 'Registration successful',
        data: result,
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const meta = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const result = await authService.login(validated, meta);

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: result,
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw ApiError.badRequest('Refresh token is required');
      }

      const meta = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const tokens = await authService.refreshTokens(refreshToken, meta);

      const response: ApiResponse = {
        success: true,
        message: 'Tokens refreshed successfully',
        data: { tokens },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.sessionId) {
        await authService.logout(req.user.sessionId);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully',
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.userId) {
        await authService.logoutAll(req.user.userId);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Logged out of all sessions successfully',
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async sendPhoneOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = phoneOtpRequestSchema.parse(req.body);
      const result = await authService.sendPhoneOtp(validated.phone);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: { expiresInSeconds: result.expiresInSeconds },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async verifyPhoneOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = phoneOtpVerifySchema.parse(req.body);
      const meta = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const result = await authService.verifyPhoneOtp(validated.phone, validated.otp, meta);

      const response: ApiResponse = {
        success: true,
        message: 'Phone verified and authenticated',
        data: result,
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const response: ApiResponse = {
        success: true,
        data: { user: req.user },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();

      const sessions = await authService.getSessions(req.user.userId, req.user.sessionId);

      const response: ApiResponse = {
        success: true,
        data: { sessions },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const { sessionId } = req.params;

      await authService.revokeSession(req.user.userId, sessionId as string);

      const response: ApiResponse = {
        success: true,
        message: 'Session revoked successfully',
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
