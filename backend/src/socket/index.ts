import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../config/env.js';
import { logger } from '../middleware/requestLogger.js';

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

  io.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Socket connected to Mangal gateway');

    socket.on('join_user_room', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
        logger.debug({ userId, socketId: socket.id }, 'Joined personal user room');
      }
    });

    socket.on('join_conversation', (conversationId: string) => {
      if (conversationId) {
        socket.join(`conv:${conversationId}`);
        logger.debug({ conversationId, socketId: socket.id }, 'Joined conversation room');
      }
    });

    socket.on('typing_start', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      socket.to(`conv:${conversationId}`).emit('user_typing', { conversationId, userId });
    });

    socket.on('typing_stop', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      socket.to(`conv:${conversationId}`).emit('user_stopped_typing', { conversationId, userId });
    });

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, reason }, 'Socket disconnected');
    });
  });

  return io;
}
