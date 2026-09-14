import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { cache } from '../adapters/cache/index.js';
import { storage } from '../adapters/storage/index.js';
import { ApiResponse, HealthStatus } from '../common/index.js';

const router: Router = Router();
const startTime = Date.now();

/**
 * Liveness Probe: Quick check if API process is running
 */
router.get('/live', (_req: Request, res: Response) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: { status: 'alive' },
    meta: { timestamp: new Date().toISOString() },
  };
  res.status(200).json(response);
});

/**
 * Readiness Probe: Thorough check of Database, Cache, and Storage
 */
router.get('/ready', async (_req: Request, res: Response) => {
  let dbStatus: 'up' | 'down' = 'down';
  let dbLatency = 0;
  let dbError: string | undefined;

  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbStart;
    dbStatus = 'up';
  } catch (err) {
    dbStatus = 'down';
    dbError = err instanceof Error ? err.message : 'Database ping failed';
  }

  const cacheHealthy = await cache.isHealthy();
  const storageHealthy = await storage.isHealthy();

  const isHealthy = dbStatus === 'up' && cacheHealthy && storageHealthy;
  const isDegraded = dbStatus === 'up' && (!cacheHealthy || !storageHealthy);

  const status: HealthStatus['status'] = isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy';

  const healthData: HealthStatus = {
    status,
    version: '1.0.0',
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: dbStatus,
        latencyMs: dbLatency,
        error: dbError,
      },
      cache: {
        status: cacheHealthy ? 'up' : 'down',
        adapter: cache.adapterName,
      },
      storage: {
        status: storageHealthy ? 'up' : 'down',
        adapter: storage.adapterName,
      },
    },
  };

  const response: ApiResponse<HealthStatus> = {
    success: status !== 'unhealthy',
    data: healthData,
    meta: { timestamp: new Date().toISOString() },
  };

  res.status(status === 'unhealthy' ? 503 : 200).json(response);
});

/**
 * General Info Probe
 */
router.get('/info', (_req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const response: ApiResponse = {
    success: true,
    data: {
      platform: 'Mangal Matrimony & Wedding Ecosystem API',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      memory: {
        heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
      },
    },
    meta: { timestamp: new Date().toISOString() },
  };
  res.status(200).json(response);
});

export default router;
