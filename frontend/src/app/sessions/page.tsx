'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface SessionItem {
  id: string;
  ipAddress: string;
  userAgent: string;
  isCurrent: boolean;
  createdAt: string;
  expiresAt: string;
}

export default function SessionsPage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, logout } = useAuth();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch('/api/v1/auth/sessions', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSessions(data.data.sessions);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch sessions');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }
    fetchSessions();
  }, [isAuthenticated, accessToken]);

  const handleRevoke = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      const res = await fetch(`/api/v1/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        throw new Error(data.error?.message || 'Failed to revoke session');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRevoking(null);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to log out of all active devices?')) return;
    try {
      await fetch('/api/v1/auth/logout-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await logout();
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Active Device Sessions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Review all web browsers and devices currently signed in to your Mangal account
          </p>
        </div>
        <button onClick={handleLogoutAll} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
          Revoke All Other Devices
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading active device sessions...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderLeft: session.isCurrent ? '4px solid var(--gold-primary)' : '1px solid var(--bg-card-border)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>💻</span>
                  <strong style={{ fontSize: '1.05rem', color: '#FFF' }}>
                    {session.userAgent.includes('Windows') ? 'Windows PC' : session.userAgent.includes('Mac') ? 'Macintosh' : 'Mobile Device'}
                  </strong>
                  {session.isCurrent && (
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      Current Session
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  IP Address: <code>{session.ipAddress}</code> • Signed In: {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => handleRevoke(session.id)}
                  disabled={revoking === session.id}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  {revoking === session.id ? 'Revoking...' : 'Revoke Access'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
