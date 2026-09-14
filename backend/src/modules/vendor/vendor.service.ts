import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { OrganizerServiceType } from '@prisma/client';

export interface VendorSearchFilter {
  serviceType?: OrganizerServiceType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export class VendorService {
  /**
   * Browse vendor listings
   */
  static async getListings(filter: VendorSearchFilter) {
    const page = filter.page || 1;
    const limit = filter.limit || 12;

    const whereClause: any = {};
    if (filter.serviceType) whereClause.serviceType = filter.serviceType;
    if (filter.minPrice || filter.maxPrice) {
      whereClause.startingPrice = {};
      if (filter.minPrice) whereClause.startingPrice.gte = filter.minPrice;
      if (filter.maxPrice) whereClause.startingPrice.lte = filter.maxPrice;
    }
    if (filter.city) {
      whereClause.organizer = {
        city: { contains: filter.city, mode: 'insensitive' },
      };
    }

    const total = await prisma.organizerListing.count({ where: whereClause });
    const listings = await prisma.organizerListing.findMany({
      where: whereClause,
      include: {
        organizer: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true, phone: true },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: listings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single vendor listing
   */
  static async getListingById(id: string) {
    const listing = await prisma.organizerListing.findUnique({
      where: { id },
      include: {
        organizer: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          },
        },
      },
    });

    if (!listing) throw ApiError.notFound('Vendor listing not found');
    return listing;
  }

  /**
   * Request a Quote from Wedding Vendor
   */
  static async requestQuote(
    userId: string,
    listingId: string,
    eventDate: string,
    guestCount: number,
    notes?: string
  ) {
    const listing = await prisma.organizerListing.findUnique({
      where: { id: listingId },
      include: { organizer: { include: { user: true } } },
    });

    if (!listing) throw ApiError.notFound('Vendor listing not found');

    const booking = await prisma.booking.create({
      data: {
        userId,
        providerType: 'ORGANIZER',
        providerId: listing.organizerId,
        serviceTitle: `Quote: ${listing.title} (${listing.serviceType})`,
        scheduledDate: new Date(eventDate),
        amount: listing.startingPrice,
        status: 'QUOTE_REQUESTED',
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId,
        title: '💍 Wedding Vendor Quote Requested',
        body: `Your quotation request for "${listing.title}" with ${listing.organizer.businessName} has been sent. Expected reply within 24h.`,
        link: '/vendors',
      },
    });

    return booking;
  }
}
