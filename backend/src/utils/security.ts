import argon2 from 'argon2';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Role, User } from '@prisma/client';
import { AuthTokens, JwtTokenPayload, UserRole } from '../common/index.js';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateTokens(
  user: Pick<User, 'id' | 'email' | 'phone' | 'role' | 'isVerified'>,
  sessionId: string
): AuthTokens {
  const payload: JwtTokenPayload = {
    userId: user.id,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role as unknown as UserRole,
    sessionId,
    isVerified: user.isVerified,
  };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as any,
  });

  const refreshToken = jwt.sign(
    { userId: user.id, sessionId, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRY as any,
    }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // 15 mins in seconds
  };
}

export function verifyAccessToken(token: string): JwtTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtTokenPayload;
}

export function verifyRefreshToken(token: string): { userId: string; sessionId: string; type: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; sessionId: string; type: string };
}
