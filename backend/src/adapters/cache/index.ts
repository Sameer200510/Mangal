import { Redis } from 'ioredis';
import { env } from '../../config/env.js';
import { logger } from '../../middleware/requestLogger.js';

export interface ICacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  flush(): Promise<void>;
  isHealthy(): Promise<boolean>;
  adapterName: 'redis' | 'memory';
}

class MemoryCacheAdapter implements ICacheAdapter {
  public adapterName = 'memory' as const;
  private cache = new Map<string, { value: unknown; expiresAt: number | null }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  async flush(): Promise<void> {
    this.cache.clear();
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

class RedisCacheAdapter implements ICacheAdapter {
  public adapterName = 'redis' as const;
  private client: Redis;

  constructor(url: string) {
    this.client = new Redis(url, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times: number) => {
        if (times > 3) return null; // stop retrying
        return Math.min(times * 100, 1000);
      },
    });

    this.client.on('error', (err: Error) => {
      logger.warn({ err: err.message }, 'Redis connection warning, operations may degrade');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async flush(): Promise<void> {
    await this.client.flushdb();
  }

  async isHealthy(): Promise<boolean> {
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }
}

function createCacheAdapter(): ICacheAdapter {
  if (env.REDIS_ENABLED && env.REDIS_URL) {
    try {
      logger.info('Connecting to Redis Cache Adapter at: ' + env.REDIS_URL);
      return new RedisCacheAdapter(env.REDIS_URL);
    } catch (e) {
      logger.warn({ err: e }, 'Failed to initialize Redis. Falling back to MemoryCacheAdapter');
      return new MemoryCacheAdapter();
    }
  }

  logger.info('Engaging In-Memory Cache Adapter (Zero-dependency local mode)');
  return new MemoryCacheAdapter();
}

export const cache = createCacheAdapter();
