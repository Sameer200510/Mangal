import { prisma } from '../../database.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../middleware/errorHandler.js';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  hashToken,
  generateSecureOtp,
  verifyRefreshToken,
} from '../../utils/security.js';
import {
  RegisterInput,
  LoginInput,
  AuthTokens,
} from '../../common/index.js';
import { Role, UserStatus } from '@prisma/client';
import { logger } from '../../middleware/requestLogger.js';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  /**
   * 1. Register a new user
   */
  async register(input: RegisterInput, meta: RequestMeta) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (existing) {
      throw ApiError.conflict('An account with this email or phone already exists');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role as unknown as Role,
        status: UserStatus.ACTIVE,
        isVerified: false,
      },
    });

    // Create a new session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: 'initial_pending',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt,
      },
    });

    const tokens = generateTokens(user, session.id);
    const refreshTokenHash = hashToken(tokens.refreshToken);

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'USER_REGISTERED',
        targetEntity: 'User',
        targetId: user.id,
        ipAddress: meta.ipAddress,
        metadata: { email: user.email, role: user.role },
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    };
  }

  /**
   * 2. Login with email and password
   */
  async login(input: LoginInput, meta: RequestMeta) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Account lockout check
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const waitMinutes = Math.ceil(
        (user.lockoutUntil.getTime() - Date.now()) / 60000
      );
      throw ApiError.tooManyRequests(
        `Account temporarily locked due to repeated failed attempts. Please retry in ${waitMinutes} minute(s).`
      );
    }

    const isValid = await verifyPassword(user.passwordHash, input.password);

    if (!isValid) {
      const attempts = user.failedLoginAttempts + 1;
      const willLockout = attempts >= 5;
      const lockoutUntil = willLockout
        ? new Date(Date.now() + 15 * 60 * 1000) // 15 mins lock
        : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: willLockout ? 0 : attempts,
          lockoutUntil,
        },
      });

      if (willLockout) {
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            action: 'ACCOUNT_LOCKED',
            targetEntity: 'User',
            targetId: user.id,
            ipAddress: meta.ipAddress,
            metadata: { reason: '5 failed login attempts' },
          },
        });
        throw ApiError.tooManyRequests(
          'Too many failed attempts. Your account has been locked for 15 minutes.'
        );
      }

      throw ApiError.unauthorized('Invalid email or password');
    }

    // Reset failed login attempts on success
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Create new session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (input.rememberMe ? 30 : 7));

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: 'pending_login',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt,
      },
    });

    const tokens = generateTokens(user, session.id);
    const refreshTokenHash = hashToken(tokens.refreshToken);

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'USER_LOGIN',
        targetEntity: 'User',
        targetId: user.id,
        ipAddress: meta.ipAddress,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    };
  }

  /**
   * 3. Refresh Token Rotation (with reuse detection)
   */
  async refreshTokens(refreshToken: string, meta: RequestMeta): Promise<AuthTokens> {
    let payload: { userId: string; sessionId: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const hashedToken = hashToken(refreshToken);

    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session) {
      throw ApiError.unauthorized('Session not found');
    }

    // REUSE DETECTION: If token doesn't match current hash, revoke whole family!
    if (session.refreshTokenHash !== hashedToken || session.isRevoked) {
      logger.warn(
        { userId: session.userId, familyId: session.familyId },
        '🚨 Refresh token reuse detected! Revoking token family.'
      );

      await prisma.session.updateMany({
        where: { familyId: session.familyId },
        data: { isRevoked: true },
      });

      await prisma.auditLog.create({
        data: {
          actorId: session.userId,
          action: 'SECURITY_TOKEN_REUSE_DETECTED',
          targetEntity: 'Session',
          targetId: session.id,
          ipAddress: meta.ipAddress,
        },
      });

      throw ApiError.unauthorized('Security alert: Token reuse detected. Please login again.');
    }

    if (session.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token has expired');
    }

    // Rotate: Issue new tokens and update DB with new hash
    const newTokens = generateTokens(session.user, session.id);
    const newHash = hashToken(newTokens.refreshToken);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: newHash,
        ipAddress: meta.ipAddress ?? session.ipAddress,
        userAgent: meta.userAgent ?? session.userAgent,
      },
    });

    return newTokens;
  }

  /**
   * 4. Logout session
   */
  async logout(sessionId: string) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }

  /**
   * 5. Logout all sessions
   */
  async logoutAll(userId: string) {
    await prisma.session.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  /**
   * 6. Send Phone OTP
   */
  async sendPhoneOtp(phone: string) {
    const otp = generateSecureOtp();
    const otpHash = hashToken(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.otpVerification.create({
      data: {
        identifier: phone,
        otpHash,
        purpose: 'PHONE_LOGIN',
        expiresAt,
      },
    });

    // In dev mode or mock mode, log OTP clearly
    logger.info({ phone, otp }, '📱 [SMS_GATEWAY] OTP sent successfully');

    return {
      message: 'OTP sent successfully to your mobile number',
      expiresInSeconds: 300,
    };
  }

  /**
   * 7. Verify Phone OTP & Login/Create User
   */
  async verifyPhoneOtp(phone: string, otp: string, meta: RequestMeta) {
    const otpHash = hashToken(otp);
    const isMockBypass = env.PROVIDER_MODE === 'mock' && otp === '123456';

    const record = isMockBypass
      ? await prisma.otpVerification.findFirst({
          where: { identifier: phone, isVerified: false },
          orderBy: { createdAt: 'desc' },
        })
      : await prisma.otpVerification.findFirst({
          where: {
            identifier: phone,
            otpHash,
            isVerified: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        });

    if (!record) {
      throw ApiError.badRequest('Invalid or expired OTP code');
    }

    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isVerified: true },
    });

    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Auto-create basic profile for new phone user
      const randomPassword = await hashPassword(generateSecureOtp() + 'Mangal@Pass');
      user = await prisma.user.create({
        data: {
          phone,
          email: `${phone.replace(/\D/g, '')}@phone.mangal.local`,
          passwordHash: randomPassword,
          firstName: 'User',
          lastName: phone.slice(-4),
          role: Role.BRIDE,
          status: UserStatus.ACTIVE,
          isVerified: true,
        },
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: 'pending_phone_otp',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt,
      },
    });

    const tokens = generateTokens(user, session.id);
    const refreshTokenHash = hashToken(tokens.refreshToken);

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    };
  }

  /**
   * 8. Get Active Sessions for User
   */
  async getSessions(userId: string, currentSessionId: string) {
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress || 'Unknown',
      userAgent: s.userAgent || 'Unknown Device',
      isCurrent: s.id === currentSessionId,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
    }));
  }

  /**
   * 9. Revoke a specific session
   */
  async revokeSession(userId: string, sessionId: string) {
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }
}

export const authService = new AuthService();
