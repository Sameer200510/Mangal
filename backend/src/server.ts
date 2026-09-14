import http from 'http';
import { createApp } from './app.js';
import { setupSocketIO } from './socket/index.js';
import { env } from './config/env.js';
import { logger } from './middleware/requestLogger.js';
import { prisma } from './database.js';

const app = createApp();
const server = http.createServer(app);
const io = setupSocketIO(server);

const PORT = env.PORT || 4000;

server.listen(PORT, () => {
  logger.info(`✨ Mangal API Gateway running on port ${PORT} [${env.NODE_ENV}]`);
  logger.info(`🔗 Health Liveness: http://localhost:${PORT}/health/live`);
  logger.info(`🔗 Health Readiness: http://localhost:${PORT}/health/ready`);
  logger.info(`🔌 Socket.IO Gateway active`);
});

// Graceful Shutdown Logic
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      io.close(() => {
        logger.info('Socket.IO gateway closed.');
      });

      await prisma.$disconnect();
      logger.info('Database connection closed.');

      logger.info('Graceful shutdown completed. Exiting process.');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  });

  // Force close after 10 seconds if hanging
  setTimeout(() => {
    logger.error('Shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception detected');
  process.exit(1);
});
