import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service.js';
import { ApiError } from '../../middleware/errorHandler.js';

export class ChatController {
  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const conversations = await ChatService.getConversations(userId);

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const messages = await ChatService.getMessages(id as string, userId, limit);

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.userId;
      const { id } = req.params;
      const { content, messageType, mediaUrl } = req.body;

      if (!content && !mediaUrl) {
        throw ApiError.badRequest('Message content or mediaUrl is required');
      }

      const message = await ChatService.sendMessage(id as string, senderId, content, messageType, mediaUrl);

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const result = await ChatService.markAsRead(id as string, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async initiateCall(req: Request, res: Response, next: NextFunction) {
    try {
      const callerId = req.user!.userId;
      const { receiverId, callType } = req.body;

      if (!receiverId) throw ApiError.badRequest('receiverId is required');

      const session = await ChatService.initiateCall(callerId, receiverId, callType);

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCallStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const { status, durationSeconds } = req.body;

      if (!status) throw ApiError.badRequest('status is required');

      const session = await ChatService.updateCallStatus(id as string, userId, status, durationSeconds);

      res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }
}
