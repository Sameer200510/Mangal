import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, ApiError } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';

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
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
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

  // 6. Static Uploads Serving (for local file adapter)
  app.use('/uploads', express.static(path.resolve(env.STORAGE_LOCAL_PATH)));

  // 7. Health & Diagnostic Endpoints (available at both root and api prefix)
  app.use('/health', healthRouter);
  app.use(`${env.API_PREFIX}/health`, healthRouter);

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

  // 8. 404 Catch-All Handler
  app.use((req: Request) => {
    throw ApiError.notFound(`Cannot find route: ${req.method} ${req.originalUrl}`);
  });

  // 9. Central Error Handler
  app.use(errorHandler);

  return app;
}
