import { UserRole } from './enums';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  services: {
    database: {
      status: 'up' | 'down';
      latencyMs?: number;
      error?: string;
    };
    cache: {
      status: 'up' | 'down';
      adapter: 'redis' | 'memory';
      error?: string;
    };
    storage: {
      status: 'up' | 'down';
      adapter: 's3' | 'local';
    };
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtTokenPayload {
  userId: string;
  email: string;
  phone?: string;
  role: UserRole;
  sessionId: string;
  isVerified: boolean;
}
