import { ApiResponse, HealthStatus } from '../common';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await res.json();
    return data as ApiResponse<T>;
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Failed to reach API server',
      },
      meta: { timestamp: new Date().toISOString() },
    };
  }
}

export async function getSystemHealth(): Promise<ApiResponse<HealthStatus>> {
  return fetchApi<HealthStatus>('/health/ready');
}
