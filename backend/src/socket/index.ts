import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../config/env.js';
import { logger } from '../middleware/requestLogger.js';

let ioInstance: SocketIOServer | null = null;

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export function setupSocketIO(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGINS.split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Socket connected to Mangal gateway');

    // Join personal user notification room
    socket.on('join_user_room', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
        logger.debug({ userId, socketId: socket.id }, 'Joined personal user room');
      }
    });

    // Join conversation room for active real-time messaging
    socket.on('join_conversation', (conversationId: string) => {
      if (conversationId) {
        socket.join(`conv:${conversationId}`);
        logger.debug({ conversationId, socketId: socket.id }, 'Joined conversation room');
      }
    });

    // Typing indicators
    socket.on('typing_start', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      socket.to(`conv:${conversationId}`).emit('user_typing', { conversationId, userId });
    });

    socket.on('typing_stop', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      socket.to(`conv:${conversationId}`).emit('user_stopped_typing', { conversationId, userId });
    });

    // WebRTC 1-to-1 Audio/Video Call Signaling
    socket.on('call:offer', ({ toUserId, offer, callType, callSessionId, callerName }: any) => {
      logger.info({ toUserId, callType, callSessionId }, 'Relaying WebRTC call offer');
      io.to(`user:${toUserId}`).emit('call:incoming', {
        fromUserId: socket.data.userId,
        callerName,
        offer,
        callType,
        callSessionId,
      });
    });

    socket.on('call:answer', ({ toUserId, answer, callSessionId }: any) => {
      logger.info({ toUserId, callSessionId }, 'Relaying WebRTC call answer');
      io.to(`user:${toUserId}`).emit('call:accepted', {
        answer,
        callSessionId,
      });
    });

    socket.on('call:ice-candidate', ({ toUserId, candidate, callSessionId }: any) => {
      io.to(`user:${toUserId}`).emit('call:ice-candidate', {
        candidate,
        callSessionId,
      });
    });

    socket.on('call:end', ({ toUserId, callSessionId }: any) => {
      io.to(`user:${toUserId}`).emit('call:terminated', {
        callSessionId,
      });
    });

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, reason }, 'Socket disconnected');
    });
  });

  return io;
}
