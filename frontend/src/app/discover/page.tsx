'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function DiscoverPage() {
  const { user, token } = useAuth();

  const [deck, setDeck] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mutual Match Modal state
  const [mutualMatchData, setMutualMatchData] = useState<{
    partnerName: string;
    partnerPhoto: string;
    conversationId: string;
  } | null>(null);

  // Fetch Deck
  const fetchDeck = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/interest/deck?limit=25', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDeck(data.data || []);
        setCurrentIndex(0);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeck();
  }, [token]);

  // Swipe Action
  const handleSwipe = async (action: 'LIKE' | 'DISLIKE' | 'SUPERLIKE') => {
    if (currentIndex >= deck.length || !token) return;

    const currentProfile = deck[currentIndex];
    const targetUserId = currentProfile.userId;

    // Advance to next card optimistically
    setCurrentIndex((prev) => prev + 1);

    try {
      const res = await fetch('/api/v1/interest/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ swipedId: targetUserId, action }),
      });

      const data = await res.json();
      if (data.success && data.data.isMutualMatch) {
        // Trigger celebratory mutual match modal
        setMutualMatchData({
          partnerName: `${currentProfile.user?.firstName} ${currentProfile.user?.lastName}`,
          partnerPhoto:
            currentProfile.photos?.find((p: any) => p.isPrimary)?.fileUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
          conversationId: data.data.conversationId,
        });
      }
    } catch (e) {
      console.error('Error recording swipe:', e);
    }
  };

  // Undo Last Swipe
  const handleUndo = async () => {
    if (currentIndex <= 0 || !token) return;
    try {
      const res = await fetch('/api/v1/interest/undo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mutualMatchData) return;
      if (e.key === 'ArrowLeft') handleSwipe('DISLIKE');
      else if (e.key === 'ArrowRight') handleSwipe('LIKE');
      else if (e.key === 'ArrowUp') handleSwipe('SUPERLIKE');
      else if (e.key === 'z' || e.key === 'Z') handleUndo();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck, token, mutualMatchData]);

  const activeCandidate = deck[currentIndex];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header bar */}
      <div style={{ width: '100%', maxWidth: '520px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/matches" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Recommendations
        </Link>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {deck.length > 0 ? `${currentIndex + 1} of ${deck.length}` : 'Empty'}
        </div>
        <Link href="/interests" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
          💌 Requests
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '14px', animation: 'spin 2s linear infinite' }}>👑</div>
          <p>Shuffling royal prospective profiles...</p>
        </div>
      )}

      {/* Active Card Stack */}
      {!loading && activeCandidate && (
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: 0,
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            position: 'relative',
          }}
        >
          {/* Main Photo with Gradient */}
          <div style={{ position: 'relative', height: '440px', width: '100%', background: '#0e0e11' }}>
            <img
              src={
                activeCandidate.photos?.find((p: any) => p.isPrimary)?.fileUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'
              }
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(14,14,17,0.95) 0%, rgba(14,14,17,0.2) 60%, transparent 100%)',
              }}
            />

            {/* Shield & Completeness */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
              {activeCandidate.user?.isVerified && (
                <span style={{ background: 'rgba(16,185,129,0.9)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  ✓ Royal Verified
                </span>
              )}
            </div>

            {/* Profile Core Overlay */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>
                {activeCandidate.user?.firstName} {activeCandidate.user?.lastName}, {new Date().getFullYear() - new Date(activeCandidate.dateOfBirth).getFullYear()}
              </h2>
              <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                📍 {activeCandidate.city || 'Delhi'}, {activeCandidate.country} • 📏 {activeCandidate.heightCm} cm
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ padding: '24px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <div>🎓 {activeCandidate.highestEducation || 'Graduate'}</div>
              <div>💼 {activeCandidate.occupation || 'Professional'}</div>
              <div>🕉️ {activeCandidate.religion} ({activeCandidate.caste || 'Any'})</div>
              <div>🥗 {activeCandidate.diet}</div>
              <div>🔮 Manglik: {activeCandidate.manglikStatus}</div>
              <div>👨‍👩‍👧 Family: {activeCandidate.familyType}</div>
            </div>

            {activeCandidate.bio && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                "{activeCandidate.bio}"
              </p>
            )}

            {/* Swipe Action Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
              {/* Undo */}
              <button
                onClick={handleUndo}
                title="Undo Last Action (Z)"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                }}
              >
                ↩
              </button>

              {/* Pass / Dislike */}
              <button
                onClick={() => handleSwipe('DISLIKE')}
                title="Pass (Left Arrow)"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '2px solid #ef4444',
                  background: 'rgba(239,68,68,0.1)',
                  color: '#f87171',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease',
                }}
              >
                ✕
              </button>

              {/* Superlike */}
              <button
                onClick={() => handleSwipe('SUPERLIKE')}
                title="Superlike (Up Arrow)"
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  border: '2px solid var(--gold)',
                  background: 'rgba(212,175,55,0.15)',
                  color: 'var(--gold)',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                }}
              >
                ★
              </button>

              {/* Like */}
              <button
                onClick={() => handleSwipe('LIKE')}
                title="Like (Right Arrow)"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '2px solid #10b981',
                  background: 'rgba(16,185,129,0.1)',
                  color: '#34d399',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                }}
              >
                ♥
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End of Deck State */}
      {!loading && (!activeCandidate || currentIndex >= deck.length) && (
        <div className="card" style={{ maxWidth: '480px', textAlign: 'center', padding: '60px 30px' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px' }}>✨</span>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>You've Reached the End!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            You have reviewed all current matching profiles in your area. Come back shortly as new brides and grooms join Mangal every hour.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={fetchDeck} className="btn btn-secondary">
              Refresh Deck
            </button>
            <Link href="/matches" className="btn btn-primary">
              View Recommendations
            </Link>
          </div>
        </div>
      )}

      {/* Mutual Match Celebratory Modal */}
      {mutualMatchData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              padding: '40px 30px',
              border: '2px solid var(--gold)',
              boxShadow: '0 0 50px rgba(212,175,55,0.3)',
              animation: 'fadeIn 0.4s ease',
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🎉💍</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '2rem', margin: '0 0 8px 0' }}>
              It's a Matrimonial Match!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              You and <strong>{mutualMatchData.partnerName}</strong> liked each other. Chat and horoscope consultation are now unlocked!
            </p>

            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px auto', border: '3px solid var(--gold)' }}>
              <img src={mutualMatchData.partnerPhoto} alt="Match" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/chat" className="btn btn-primary" style={{ padding: '12px' }}>
                💬 Start Conversation
              </Link>
              <button
                onClick={() => setMutualMatchData(null)}
                className="btn btn-secondary"
                style={{ padding: '10px' }}
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
