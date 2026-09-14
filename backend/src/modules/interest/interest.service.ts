import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { SwipeAction, InterestStatus, Gender } from '@prisma/client';

export class InterestService {
  /**
   * Handle card swipe (LIKE, DISLIKE, SUPERLIKE)
   */
  static async handleSwipe(swiperId: string, swipedId: string, action: SwipeAction) {
    if (swiperId === swipedId) {
      throw ApiError.badRequest('You cannot swipe on yourself');
    }

    // 1. Record or update swipe record
    const swipe = await prisma.swipe.upsert({
      where: {
        swiperId_swipedId: { swiperId, swipedId },
      },
      update: { action, createdAt: new Date() },
      create: { swiperId, swipedId, action },
    });

    // If DISLIKE, no further action needed
    if (action === SwipeAction.DISLIKE) {
      return {
        action: 'DISLIKE',
        isMutualMatch: false,
        message: 'Profile passed',
      };
    }

    // 2. Check if the other person has also liked or superliked the swiper
    const reciprocalSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: { swiperId: swipedId, swipedId: swiperId },
      },
    });

    const isMutual = reciprocalSwipe && (reciprocalSwipe.action === SwipeAction.LIKE || reciprocalSwipe.action === SwipeAction.SUPERLIKE);

    if (isMutual) {
      // 3. Create bidirectional Match record if not already created
      // Order user IDs consistently to respect unique constraint
      const [u1, u2] = swiperId < swipedId ? [swiperId, swipedId] : [swipedId, swiperId];

      const match = await prisma.match.upsert({
        where: {
          user1Id_user2Id: { user1Id: u1, user2Id: u2 },
        },
        update: {
          isChatUnlocked: true,
          isCallUnlocked: true,
        },
        create: {
          user1Id: u1,
          user2Id: u2,
          compatibilityScore: action === SwipeAction.SUPERLIKE ? 95 : 88,
          matchReasons: ['Mutual Interest', action === SwipeAction.SUPERLIKE ? 'Superlike Connection' : 'Direct Like Match'],
          isChatUnlocked: true,
          isCallUnlocked: true,
        },
      });

      // 4. Ensure Conversation exists
      const conversation = await prisma.conversation.upsert({
        where: { matchId: match.id },
        update: {},
        create: { matchId: match.id },
      });

      // 5. Create notifications for both users
      const swiperUser = await prisma.user.findUnique({ where: { id: swiperId }, select: { firstName: true } });
      const swipedUser = await prisma.user.findUnique({ where: { id: swipedId }, select: { firstName: true } });

      await prisma.notification.createMany({
        data: [
          {
            userId: swipedId,
            title: "🎉 It's a Matrimonial Match!",
            body: `You and ${swiperUser?.firstName || 'someone'} liked each other! Start chatting now.`,
            link: `/chat`,
          },
          {
            userId: swiperId,
            title: "🎉 It's a Matrimonial Match!",
            body: `You and ${swipedUser?.firstName || 'someone'} liked each other! Start chatting now.`,
            link: `/chat`,
          },
        ],
      });

      return {
        action,
        isMutualMatch: true,
        matchId: match.id,
        conversationId: conversation.id,
        message: "It's a Match! Chat and video calling unlocked.",
      };
    }

    // 6. Not mutual yet: Record a PENDING Interest so the other user sees it in their "Received Interests"
    await prisma.interest.upsert({
      where: {
        senderId_receiverId: { senderId: swiperId, receiverId: swipedId },
      },
      update: {
        status: InterestStatus.PENDING,
        message: action === SwipeAction.SUPERLIKE ? 'Sent a Royal Superlike ⭐' : 'Sent Interest',
      },
      create: {
        senderId: swiperId,
        receiverId: swipedId,
        status: InterestStatus.PENDING,
        message: action === SwipeAction.SUPERLIKE ? 'Sent a Royal Superlike ⭐' : 'Sent Interest',
      },
    });

    return {
      action,
      isMutualMatch: false,
      message: action === SwipeAction.SUPERLIKE ? 'Royal Superlike sent! The recipient has been alerted.' : 'Interest registered.',
    };
  }

  /**
   * Undo the most recent swipe within 15 minutes (Premium Feature)
   */
  static async undoLastSwipe(userId: string) {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const lastSwipe = await prisma.swipe.findFirst({
      where: {
        swiperId: userId,
        createdAt: { gte: fifteenMinutesAgo },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastSwipe) {
      throw ApiError.badRequest('No recent swipe found to undo');
    }

    // Remove swipe
    await prisma.swipe.delete({ where: { id: lastSwipe.id } });

    // Clean up interest if pending
    await prisma.interest.deleteMany({
      where: {
        senderId: userId,
        receiverId: lastSwipe.swipedId,
        status: InterestStatus.PENDING,
      },
    });

    return {
      success: true,
      swipedId: lastSwipe.swipedId,
      message: 'Previous action undone',
    };
  }

  /**
   * Get Deck of Profiles for Swiping
   */
  static async getSwipeDeck(userId: string, limit = 20) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw ApiError.badRequest('Complete profile onboarding to start discovery');
    }

    const swipedIds = await prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { swipedId: true },
    });

    const excludedIds = [userId, ...swipedIds.map((s) => s.swipedId)];
    const targetGender = user.profile.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;

    const candidates = await prisma.profile.findMany({
      where: {
        userId: { notIn: excludedIds },
        gender: targetGender,
        user: { status: 'ACTIVE' },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
          },
        },
        photos: {
          where: { isApproved: true },
          orderBy: { isPrimary: 'desc' },
        },
      },
      take: limit,
      orderBy: { completenessScore: 'desc' },
    });

    return candidates;
  }

  /**
   * Get Received Interests
   */
  static async getReceivedInterests(userId: string) {
    return prisma.interest.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            profile: {
              include: {
                photos: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get Sent Interests
   */
  static async getSentInterests(userId: string) {
    return prisma.interest.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            profile: {
              include: {
                photos: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Respond to received interest (ACCEPT or REJECT)
   */
  static async respondToInterest(interestId: string, receiverId: string, status: 'ACCEPTED' | 'REJECTED') {
    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
    });

    if (!interest || interest.receiverId !== receiverId) {
      throw ApiError.notFound('Interest request not found or unauthorized');
    }

    const updated = await prisma.interest.update({
      where: { id: interestId },
      data: {
        status: status === 'ACCEPTED' ? InterestStatus.ACCEPTED : InterestStatus.REJECTED,
        respondedAt: new Date(),
      },
    });

    if (status === 'ACCEPTED') {
      const [u1, u2] = interest.senderId < receiverId ? [interest.senderId, receiverId] : [receiverId, interest.senderId];
      
      const match = await prisma.match.upsert({
        where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
        update: { isChatUnlocked: true },
        create: {
          user1Id: u1,
          user2Id: u2,
          compatibilityScore: 85,
          matchReasons: ['Interest Accepted'],
          isChatUnlocked: true,
        },
      });

      await prisma.conversation.upsert({
        where: { matchId: match.id },
        update: {},
        create: { matchId: match.id },
      });

      const receiverUser = await prisma.user.findUnique({ where: { id: receiverId }, select: { firstName: true } });
      await prisma.notification.create({
        data: {
          userId: interest.senderId,
          title: '💖 Interest Accepted!',
          body: `${receiverUser?.firstName || 'Your match'} accepted your interest! Start the conversation.`,
          link: '/chat',
        },
      });
    }

    return updated;
  }
}
