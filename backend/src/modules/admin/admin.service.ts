import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { UserStatus, Role, VerificationStatus } from '@prisma/client';

export class AdminService {
  /**
   * Get Platform KPI Dashboard Stats
   */
  static async getDashboardStats() {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { status: UserStatus.ACTIVE } });
    const suspendedUsers = await prisma.user.count({ where: { status: UserStatus.SUSPENDED } });
    const pendingVerifications = await prisma.identityVerification.count({
      where: { status: VerificationStatus.PENDING },
    });
    const activeSubscriptions = await prisma.membership.count({
      where: { isActive: true, endDate: { gte: new Date() } },
    });

    const successfulPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    });

    const totalRevenue = successfulPayments.reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingVerifications,
      activeSubscriptions,
      totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
    };
  }

  /**
   * Paginated Users Directory for Moderation
   */
  static async getUsers(page = 1, limit = 20, status?: UserStatus, role?: Role, search?: string) {
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (role) whereClause.role = role;
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.user.count({ where: whereClause });
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: {
          select: {
            gender: true,
            city: true,
            completenessScore: true,
            religion: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update User Status (ACTIVE, SUSPENDED, DELETED)
   */
  static async updateUserStatus(userId: string, status: UserStatus, actorId: string, reason?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        actorId,
        action: `USER_STATUS_CHANGE_TO_${status}`,
        targetEntity: 'USER',
        targetId: userId,
        metadata: { reason: reason || 'Administrative action' },
      },
    });

    return updated;
  }

  /**
   * Get Platform Audit Logs
   */
  static async getAuditLogs(limit = 50) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { firstName: true, lastName: true, email: true, role: true },
        },
      },
    });
  }
}
