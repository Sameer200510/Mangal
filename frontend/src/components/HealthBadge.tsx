'use client';

import React, { useEffect, useState } from 'react';
import { getSystemHealth } from '../lib/api';
import { HealthStatus } from '../common';

export default function HealthBadge() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      const res = await getSystemHealth();
      if (res.success && res.data) {
        setHealth(res.data);
      }
      setLoading(false);
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#D4AF37', display: 'inline-block' }} />
        Checking Systems...
      </span>
    );
  }

  const isOnline = health?.status === 'healthy' || health?.status === 'degraded';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.85rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
        border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: isOnline ? '#34D399' : '#F87171',
      }}
      title={
        health
          ? `DB: ${health.services.database.status} (${health.services.database.latencyMs}ms) | Cache: ${health.services.cache.adapter} | Storage: ${health.services.storage.adapter}`
          : 'Backend Server Offline'
      }
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isOnline ? '#10B981' : '#EF4444',
          boxShadow: isOnline ? '0 0 8px #10B981' : '0 0 8px #EF4444',
        }}
      />
      <span>
        {isOnline
          ? `Engine Active • DB: ${health?.services.database.status?.toUpperCase()} (${health?.services.cache.adapter})`
          : 'Engine Offline (Start Backend)'}
      </span>
    </div>
  );
}
