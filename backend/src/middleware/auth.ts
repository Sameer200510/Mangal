import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/security.js';
import { ApiError } from './errorHandler.js';
import { prisma } from '../database.js';
import { Role } from '@prisma/client';
import { JwtTokenPayload } from '../common/index.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}

export async function authenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication token missing or invalid'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);

    // Verify that session has not been revoked in database
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      return next(ApiError.unauthorized('Session has expired or been revoked'));
    }

    req.user = payload;
    next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired access token'));
  }
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role as unknown as Role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Allowed roles: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
}

export function requireVerified(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  if (!req.user.isVerified) {
    return next(ApiError.forbidden('Account verification required to perform this action'));
  }

  next();
}
