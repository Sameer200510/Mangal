'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const [resStats, resUsers, resLogs] = await Promise.all([
        fetch('/api/v1/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/admin/users?limit=25', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/admin/audit-logs?limit=15', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const dataStats = await resStats.json();
      const dataUsers = await resUsers.json();
      const dataLogs = await resLogs.json();

      if (!resStats.ok || !dataStats.success) {
        throw new Error(dataStats.error?.message || 'Unauthorized: Admin privileges required');
      }

      setStats(dataStats.data);
      setUsers(dataUsers.users || []);
      setAuditLogs(dataLogs.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const handleUpdateStatus = async (targetUserId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${targetUserId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, reason: 'Admin dashboard moderation' }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(`User status updated to ${newStatus}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, status: newStatus } : u))
        );
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Loading administrative dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '60px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>🔒</span>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {error}. You must be logged in as an Administrator (e.g. <code>admin@mangal.com</code>) to view this console.
          </p>
          <Link href="/login" className="btn btn-primary">
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-crimson" style={{ marginBottom: '8px' }}>
              🛡️ Mangal Control Center
            </span>
            <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
              Administration & Moderation Suite
            </h1>
          </div>
          <button onClick={fetchAdminData} className="btn btn-secondary">
            ↻ Refresh Metrics
          </button>
        </div>

        {actionSuccess && (
          <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#34d399', marginBottom: '24px' }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* KPI Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '36px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Users</span>
              <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: 'var(--text-primary)' }}>{stats.totalUsers}</h2>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Profiles</span>
              <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: '#10b981' }}>{stats.activeUsers}</h2>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending KYC</span>
              <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: 'var(--gold)' }}>{stats.pendingVerifications}</h2>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Paid Subscriptions</span>
              <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: 'var(--gold)' }}>{stats.activeSubscriptions}</h2>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Gross Revenue</span>
              <h2 style={{ margin: '8px 0 0 0', fontSize: '1.8rem', color: 'var(--gold)' }}>{stats.totalRevenue}</h2>
            </div>
          </div>
        )}

        {/* User Moderation Table */}
        <div className="card" style={{ padding: '28px', marginBottom: '36px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
            User Accounts Moderation Directory
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Name & Email</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>KYC Verified</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{u.firstName} {u.lastName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className="badge badge-secondary">{u.role}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {u.isVerified ? (
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Verified</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Unverified</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-gold' : 'badge-crimson'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {u.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleUpdateStatus(u.id, 'SUSPENDED')}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(u.id, 'ACTIVE')}
                          style={{
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid #10b981',
                            color: '#34d399',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
            System Audit Trail & Security Events
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{log.action}</span> on{' '}
                  <span style={{ color: 'var(--text-primary)' }}>{log.targetEntity}</span> ({log.targetId?.slice(0, 8)}...)
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
