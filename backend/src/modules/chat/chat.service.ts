import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { getIO } from '../../socket/index.js';
import { CallType, CallStatus } from '@prisma/client';

export class ChatService {
  /**
   * Get all conversations for active user
   */
  static async getConversations(userId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isChatUnlocked: true,
      },
      include: {
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = [];

    for (const match of matches) {
      if (!match.conversation) continue;

      const partner = match.user1Id === userId ? match.user2 : match.user1;
      const lastMessage = match.conversation.messages[0] || null;

      // Count unread messages
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: match.conversation.id,
          senderId: { not: userId },
          isRead: false,
        },
      });

      result.push({
        conversationId: match.conversation.id,
        matchId: match.id,
        partner,
        lastMessage,
        unreadCount,
        isCallUnlocked: match.isCallUnlocked,
        lastMessageAt: match.conversation.lastMessageAt || match.createdAt,
      });
    }

    // Sort by most recent activity
    result.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    return result;
  }

  /**
   * Get Messages for a Conversation
   */
  static async getMessages(conversationId: string, userId: string, limit = 50) {
    // Verify membership in conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { match: true },
    });

    if (!conversation) throw ApiError.notFound('Conversation not found');
    if (conversation.match.user1Id !== userId && conversation.match.user2Id !== userId) {
      throw ApiError.unauthorized('You are not a participant in this conversation');
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return messages;
  }

  /**
   * Send a message
   */
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType = 'TEXT',
    mediaUrl?: string
  ) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { match: true },
    });

    if (!conversation) throw ApiError.notFound('Conversation not found');
    if (conversation.match.user1Id !== senderId && conversation.match.user2Id !== senderId) {
      throw ApiError.unauthorized('Unauthorized');
    }

    const recipientId = conversation.match.user1Id === senderId ? conversation.match.user2Id : conversation.match.user1Id;

    // 1. Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        messageType,
        mediaUrl,
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    // 2. Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // 3. Broadcast real-time message via Socket.IO
    const io = getIO();
    if (io) {
      io.to(`conv:${conversationId}`).emit('chat:message', message);
      io.to(`user:${recipientId}`).emit('chat:notification', {
        conversationId,
        message,
      });
    }

    return message;
  }

  /**
   * Mark messages in a conversation as read
   */
  static async markAsRead(conversationId: string, userId: string) {
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    const io = getIO();
    if (io) {
      io.to(`conv:${conversationId}`).emit('chat:read', { conversationId, userId });
    }

    return { success: true };
  }

  /**
   * WebRTC Call Management: Initiate a call session
   */
  static async initiateCall(callerId: string, receiverId: string, callType: CallType = CallType.AUDIO) {
    // Check match status
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: callerId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: callerId },
        ],
        isCallUnlocked: true,
      },
    });

    if (!match) {
      throw ApiError.badRequest('Direct calling is only enabled after mutual interest or verified match');
    }

    const session = await prisma.callSession.create({
      data: {
        callerId,
        receiverId,
        callType,
        status: CallStatus.INITIATED,
        startedAt: new Date(),
      },
      include: {
        caller: { select: { firstName: true, lastName: true } },
      },
    });

    return session;
  }

  /**
   * Update call session status (e.g. CONNECTED, COMPLETED, DECLINED)
   */
  static async updateCallStatus(
    callSessionId: string,
    userId: string,
    status: CallStatus,
    durationSeconds?: number
  ) {
    const session = await prisma.callSession.findUnique({
      where: { id: callSessionId },
    });

    if (!session) throw ApiError.notFound('Call session not found');
    if (session.callerId !== userId && session.receiverId !== userId) {
      throw ApiError.unauthorized('Unauthorized call action');
    }

    const updated = await prisma.callSession.update({
      where: { id: callSessionId },
      data: {
        status,
        durationSeconds: durationSeconds || 0,
        endedAt: status === CallStatus.COMPLETED || status === CallStatus.DECLINED ? new Date() : undefined,
      },
    });

    return updated;
  }
}
