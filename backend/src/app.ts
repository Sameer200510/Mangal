import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, ApiError } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import authRouter from './modules/auth/auth.routes.js';
import profileRouter from './modules/profile/profile.routes.js';
import verificationRouter from './modules/verification/verification.routes.js';
import matchRouter from './modules/match/match.routes.js';
import interestRouter from './modules/interest/interest.routes.js';
import chatRouter from './modules/chat/chat.routes.js';
import kundliRouter from './modules/kundli/kundli.routes.js';
import vendorRouter from './modules/vendor/vendor.routes.js';
import paymentRouter from './modules/payment/payment.routes.js';
import notificationRouter from './modules/notification/notification.routes.js';
import adminRouter from './modules/admin/admin.routes.js';
import aiRouter from './modules/ai/ai.routes.js';

export function createApp(): Express {
  const app = express();

  // 1. Core Security Middleware
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 2. CORS Handling
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS policy`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Idempotency-Key'],
    })
  );

  // 3. Request Logging
  app.use(requestLogger);

  // 4. Rate Limiting
  app.use(globalRateLimiter);

  // 5. Body Parsing with strict limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 6. Static Uploads Serving
  app.use('/uploads', express.static(path.resolve(env.STORAGE_LOCAL_PATH)));

  // 7. Health & Diagnostic Endpoints
  app.use('/health', healthRouter);
  app.use(`${env.API_PREFIX}/health`, healthRouter);

  // 8. Modular Domain Routes
  app.use(`${env.API_PREFIX}/auth`, authRouter);
  app.use(`${env.API_PREFIX}/profile`, profileRouter);
  app.use(`${env.API_PREFIX}/verification`, verificationRouter);
  app.use(`${env.API_PREFIX}/matches`, matchRouter);
  app.use(`${env.API_PREFIX}/interest`, interestRouter);
  app.use(`${env.API_PREFIX}/chat`, chatRouter);
  app.use(`${env.API_PREFIX}/kundli`, kundliRouter);
  app.use(`${env.API_PREFIX}/vendors`, vendorRouter);
  app.use(`${env.API_PREFIX}/payments`, paymentRouter);
  app.use(`${env.API_PREFIX}/notifications`, notificationRouter);
  app.use(`${env.API_PREFIX}/admin`, adminRouter);
  app.use(`${env.API_PREFIX}/ai`, aiRouter);

  // Root Welcome Endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Welcome to Mangal AI-Powered Matrimony & Wedding Ecosystem API',
      version: '1.0.0',
      docs: '/docs',
      health: '/health/ready',
    });
  });

  // 404 Catch-All Handler
  app.use((req: Request) => {
    throw ApiError.notFound(`Cannot find route: ${req.method} ${req.originalUrl}`);
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
