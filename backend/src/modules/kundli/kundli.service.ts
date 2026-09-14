import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { KundliEngine, AstrologicalProfile } from './kundli.engine.js';
import { PanditServiceType } from '@prisma/client';

export class KundliService {
  /**
   * Match two Kundlis and produce 36 Guna Milan report
   */
  static matchKundlis(groom: AstrologicalProfile, bride: AstrologicalProfile) {
    if (!groom.birthDate || !bride.birthDate) {
      throw ApiError.badRequest('Both Groom and Bride birth dates are required');
    }

    const report = KundliEngine.calculateMilan(groom, bride);
    return report;
  }

  /**
   * Get verified Vedic Pandits directory
   */
  static async getPanditProfiles() {
    return prisma.panditProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isVerified: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Book a Pandit consultation slot
   */
  static async bookConsultation(
    userId: string,
    panditProfileId: string,
    serviceType: PanditServiceType,
    scheduledDate: string,
    notes?: string
  ) {
    const pandit = await prisma.panditProfile.findUnique({
      where: { id: panditProfileId },
      include: { user: true },
    });

    if (!pandit) throw ApiError.notFound('Pandit not found');

    const booking = await prisma.booking.create({
      data: {
        userId,
        providerType: 'PANDIT',
        providerId: pandit.id,
        serviceTitle: `Vedic Consultation: ${serviceType.replace(/_/g, ' ')} with Acharya ${pandit.user.firstName}`,
        scheduledDate: new Date(scheduledDate),
        amount: pandit.perConsultationFee,
        status: 'CONFIRMED',
      },
    });

    // Create confirmation notification for user
    await prisma.notification.create({
      data: {
        userId,
        title: '🕉️ Pandit Consultation Confirmed!',
        body: `Your appointment with Acharya ${pandit.user.firstName} is confirmed for ${new Date(scheduledDate).toLocaleDateString()}. Dakshina: ₹${pandit.perConsultationFee}`,
        link: `/pandits`,
      },
    });

    return booking;
  }
}
