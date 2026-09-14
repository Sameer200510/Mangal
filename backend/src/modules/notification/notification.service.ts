import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { getIO } from '../../socket/index.js';

export class NotificationService {
  /**
   * Get paginated notifications for user with unread counter
   */
  static async getNotifications(userId: string, page = 1, limit = 20) {
    const total = await prisma.notification.count({ where: { userId } });
    const unreadCount = await prisma.notification.count({ where: { userId, isRead: false } });

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      notifications,
      unreadCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark a single notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    const item = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!item || item.userId !== userId) {
      throw ApiError.notFound('Notification not found');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  }

  /**
   * Dispatch a notification (saves to DB and emits via socket)
   */
  static async dispatch(userId: string, title: string, body: string, link?: string, metadata?: any) {
    const record = await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        link,
        metadata,
      },
    });

    const io = getIO();
    if (io) {
      io.to(`user:${userId}`).emit('notification:new', record);
    }

    return record;
  }
}
