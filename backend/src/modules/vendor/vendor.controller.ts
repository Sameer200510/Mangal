import { Request, Response, NextFunction } from 'express';
import { VendorService } from './vendor.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class VendorController {
  static async getListings(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceType, city, minPrice, maxPrice, page, limit } = req.query;

      const result = await VendorService.getListings({
        serviceType: serviceType as any,
        city: city as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 12,
      });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getListingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const listing = await VendorService.getListingById(id as string);

      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  static async requestQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { listingId, eventDate, guestCount, notes } = req.body;

      if (!listingId || !eventDate) {
        throw ApiError.badRequest('listingId and eventDate are required');
      }

      const booking = await VendorService.requestQuote(userId, listingId, eventDate, guestCount || 100, notes);

      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}
