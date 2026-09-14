'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function InterestsPage() {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedInterests, setReceivedInterests] = useState<any[]>([]);
  const [sentInterests, setSentInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchInterests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [resRec, resSent] = await Promise.all([
        fetch('/api/v1/interest/received', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/interest/sent', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const dataRec = await resRec.json();
      const dataSent = await resSent.json();

      if (dataRec.success) setReceivedInterests(dataRec.data || []);
      if (dataSent.success) setSentInterests(dataSent.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [token]);

  const handleRespond = async (interestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/interest/${interestId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(status === 'ACCEPTED' ? 'Interest Accepted! Match connected.' : 'Interest declined.');
        // Update local state
        setReceivedInterests((prev) =>
          prev.map((item) => (item.id === interestId ? { ...item, status } : item))
        );
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const list = activeTab === 'received' ? receivedInterests : sentInterests;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0 }}>
              Interest Requests
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.95rem' }}>
              Manage matrimonial interests and connect with prospective life partners.
            </p>
          </div>
          <Link href="/matches" className="btn btn-secondary">
            ← Explore Matches
          </Link>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '28px', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('received')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: activeTab === 'received' ? '1px solid var(--gold)' : '1px solid transparent',
              background: activeTab === 'received' ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: activeTab === 'received' ? 'var(--gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeTab === 'received' ? 'bold' : 'normal',
              fontSize: '0.95rem',
            }}
          >
            Received ({receivedInterests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: activeTab === 'sent' ? '1px solid var(--gold)' : '1px solid transparent',
              background: activeTab === 'sent' ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: activeTab === 'sent' ? 'var(--gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeTab === 'sent' ? 'bold' : 'normal',
              fontSize: '0.95rem',
            }}
          >
            Sent ({sentInterests.length})
          </button>
        </div>

        {/* Toast */}
        {actionSuccess && (
          <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#34d399', marginBottom: '20px' }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <p>Loading interest requests...</p>
          </div>
        )}

        {/* Empty list */}
        {!loading && list.length === 0 && (
          <div className="card" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>💌</span>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              No {activeTab} interests yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
              {activeTab === 'received'
                ? 'Enhance your profile details and photos to receive high-intent interests.'
                : 'Browse through daily recommendations and express interest to get started.'}
            </p>
            <Link href="/matches" className="btn btn-primary">
              Discover Matches
            </Link>
          </div>
        )}

        {/* List of interests */}
        {!loading && list.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {list.map((item) => {
              const targetUser = activeTab === 'received' ? item.sender : item.receiver;
              const photo =
                targetUser?.profile?.photos?.[0]?.fileUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-color)' }}>
                      <img src={photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                          {targetUser?.firstName} {targetUser?.lastName}
                        </h4>
                        {targetUser?.isVerified && (
                          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓ Verified</span>
                        )}
                      </div>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {item.message || 'Expressed matrimonial interest'} • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {activeTab === 'received' && item.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleRespond(item.id, 'ACCEPTED')}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          ✓ Accept Interest
                        </button>
                        <button
                          onClick={() => handleRespond(item.id, 'REJECTED')}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Decline
                        </button>
                      </>
                    ) : item.status === 'ACCEPTED' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-gold">Accepted</span>
                        <Link href="/chat" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                          💬 Chat
                        </Link>
                      </div>
                    ) : (
                      <span className="badge badge-crimson">{item.status}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
