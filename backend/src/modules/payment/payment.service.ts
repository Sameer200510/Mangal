import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { PaymentAdapter } from '../../adapters/payment/index.js';
import { MembershipTier, PaymentStatus } from '@prisma/client';

export const MEMBERSHIP_PLANS = {
  FREE: {
    tier: MembershipTier.FREE,
    name: 'Free Starter',
    price: 0,
    durationDays: 365,
    features: ['Standard Profile Listing', '5 Recommendations / Day', 'Receive Unlimited Interests'],
  },
  SILVER: {
    tier: MembershipTier.SILVER,
    name: 'Silver Matrimonial',
    price: 1499,
    durationDays: 90,
    features: [
      'Unlimited Direct Messaging',
      'View Verified Contact Numbers (30)',
      'Basic Ashta Koota Kundli Reports',
      'Priority Customer Care',
    ],
  },
  GOLD: {
    tier: MembershipTier.GOLD,
    name: 'Gold Royal Crown',
    price: 2999,
    durationDays: 180,
    features: [
      'Unlimited Direct Messaging & HD Video Calls',
      'View Verified Contact Numbers (75)',
      'Full 36 Guna Milan & Dosha Reports',
      'Profile Highlighted with Gold Border',
      'Incognito Privacy Mode',
    ],
  },
  DIAMOND: {
    tier: MembershipTier.DIAMOND,
    name: 'Diamond VIP Sanctuary',
    price: 4999,
    durationDays: 365,
    features: [
      'Dedicated Relationship Matchmaker',
      'Unlimited Verified Contacts & Kundli Reports',
      'Complimentary Pandit Consultation',
      'Wedding Vendor Discounts (up to ₹25,000)',
      'Top Spotlight in Discovery Deck',
    ],
  },
};

export class PaymentService {
  /**
   * Get available membership plans
   */
  static getPlans() {
    return Object.values(MEMBERSHIP_PLANS);
  }

  /**
   * Create an order for a membership subscription
   */
  static async createMembershipOrder(userId: string, tier: MembershipTier) {
    const plan = MEMBERSHIP_PLANS[tier];
    if (!plan || plan.price <= 0) {
      throw ApiError.badRequest('Invalid membership plan or free plan selected');
    }

    const order = PaymentAdapter.createOrder({
      amount: plan.price,
      currency: 'INR',
      receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
    });

    // Create a pending Payment record in database
    const payment = await prisma.payment.create({
      data: {
        userId,
        orderId: order.orderId,
        amount: plan.price,
        currency: 'INR',
        gateway: order.gateway,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      orderId: order.orderId,
      amount: plan.price,
      currency: 'INR',
      planName: plan.name,
      paymentId: payment.id,
    };
  }

  /**
   * Verify payment signature and activate membership
   */
  static async verifyPaymentAndActivate(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string,
    tier: MembershipTier
  ) {
    const isValid = PaymentAdapter.verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      throw ApiError.badRequest('Invalid payment signature verification failed');
    }

    const plan = MEMBERSHIP_PLANS[tier];
    if (!plan) throw ApiError.badRequest('Invalid plan tier');

    // 1. Update Payment record to SUCCESS
    const paymentRecord = await prisma.payment.findFirst({
      where: { orderId, userId },
    });

    if (paymentRecord) {
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          paymentId,
          signature,
          status: PaymentStatus.SUCCESS,
          receiptUrl: `https://mangal.com/receipts/${orderId}.pdf`,
        },
      });
    }

    // 2. Compute Membership dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    // 3. Upsert Membership record
    const membership = await prisma.membership.create({
      data: {
        userId,
        tier: plan.tier,
        startDate,
        endDate,
        isActive: true,
        features: plan.features,
      },
    });

    // 4. Create user confirmation notification
    await prisma.notification.create({
      data: {
        userId,
        title: `👑 Welcome to ${plan.name}!`,
        body: `Your subscription is active until ${endDate.toLocaleDateString()}. Enjoy premium matrimonial privileges!`,
        link: '/pricing',
      },
    });

    return {
      success: true,
      membership,
      message: `Successfully upgraded to ${plan.name}!`,
    };
  }

  /**
   * Get active membership and payment history for user
   */
  static async getUserMembership(userId: string) {
    const activeMembership = await prisma.membership.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      activeMembership: activeMembership || {
        tier: MembershipTier.FREE,
        name: 'Free Starter',
        isActive: true,
        features: MEMBERSHIP_PLANS.FREE.features,
      },
      payments,
    };
  }
}
