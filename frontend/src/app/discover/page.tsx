'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { AipanCorner, AipanChauki, TehriNathEmblem, HimalayanSilhouettes, AipanBorder } from '../../components/AipanPatterns';

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

  // Drag Gesture & Animation States
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState<'LIKE' | 'DISLIKE' | 'SUPERLIKE' | null>(null);

  // Trigger smooth fly-away animation then commit swipe
  const triggerFlySwipe = (action: 'LIKE' | 'DISLIKE' | 'SUPERLIKE') => {
    if (flyDirection || currentIndex >= deck.length) return;
    setFlyDirection(action);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }
    setTimeout(() => {
      handleSwipe(action);
      setFlyDirection(null);
      setDragOffset({ x: 0, y: 0 });
      setDragStart(null);
      setIsDragging(false);
    }, 280);
  };

  // Swipe Action API caller
  const handleSwipe = async (action: 'LIKE' | 'DISLIKE' | 'SUPERLIKE') => {
    if (currentIndex >= deck.length || !token) return;

    const currentProfile = deck[currentIndex];
    const targetUserId = currentProfile.userId;

    // Advance to next card
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

  // Pointer event drag handlers for mobile touch & desktop mouse
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (flyDirection) return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart || flyDirection) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || flyDirection) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const threshold = 100;
    if (dragOffset.x > threshold) {
      triggerFlySwipe('LIKE');
    } else if (dragOffset.x < -threshold) {
      triggerFlySwipe('DISLIKE');
    } else if (dragOffset.y < -threshold && Math.abs(dragOffset.x) < 70) {
      triggerFlySwipe('SUPERLIKE');
    } else {
      setDragOffset({ x: 0, y: 0 });
      setDragStart(null);
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
      if (e.key === 'ArrowLeft') triggerFlySwipe('DISLIKE');
      else if (e.key === 'ArrowRight') triggerFlySwipe('LIKE');
      else if (e.key === 'ArrowUp') triggerFlySwipe('SUPERLIKE');
      else if (e.key === 'z' || e.key === 'Z') handleUndo();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck, token, mutualMatchData]);

  const activeCandidate = deck[currentIndex];
  const nextCandidate = deck[currentIndex + 1];

  // Calculate dynamic transform for active card
  const rotation = isDragging
    ? dragOffset.x * 0.075
    : flyDirection === 'LIKE'
    ? 22
    : flyDirection === 'DISLIKE'
    ? -22
    : 0;

  const translateX =
    flyDirection === 'LIKE' ? 620 : flyDirection === 'DISLIKE' ? -620 : dragOffset.x;
  const translateY = flyDirection === 'SUPERLIKE' ? -620 : dragOffset.y;

  const cardTransform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
  const cardTransition = isDragging
    ? 'none'
    : 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.28s ease';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Mountain Silhouettes */}
      <HimalayanSilhouettes />

      {/* Header bar */}
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
        <Link href="/matches" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Recommendations
        </Link>
        <div style={{ fontSize: '0.85rem', color: '#FAF8F2', background: 'rgba(122,31,29,0.5)', padding: '4px 14px', borderRadius: '14px', border: '1px solid rgba(250,248,242,0.25)', fontWeight: 600 }}>
          {deck.length > 0 ? `${currentIndex + 1} of ${deck.length}` : 'Empty'}
        </div>
        <Link href="/interests" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
          💌 Requests
        </Link>
      </div>

      {/* Touch & Swipe Guidance Hint */}
      <div style={{ marginBottom: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>👈 Swipe Left (Pass)</span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span style={{ color: 'var(--gold)' }}>👆 Up (Superlike)</span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span style={{ color: '#34d399' }}>Swipe Right (Connect) 👉</span>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)', position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '16px' }}>
            <AipanChauki size={90} className="aipan-spin" />
          </div>
          <p style={{ color: '#FAF8F2' }}>Shuffling prospective Devbhoomi profiles...</p>
        </div>
      )}

      {/* Active Card Stack Container */}
      {!loading && activeCandidate && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            minHeight: '620px',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          {/* Stacked Preview of Next Candidate (Peeking underneath) */}
          {nextCandidate && (
            <div
              className="card aipan-card"
              style={{
                position: 'absolute',
                width: '100%',
                maxWidth: '460px',
                padding: 0,
                overflow: 'hidden',
                borderRadius: '18px',
                border: '1.5px solid rgba(250, 248, 242, 0.18)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                zIndex: 1,
                pointerEvents: 'none',
                transform: `scale(${0.95 + Math.min(0.05, Math.abs(dragOffset.x) / 1000)}) translateY(12px)`,
                opacity: 0.75 + Math.min(0.25, Math.abs(dragOffset.x) / 300),
                transition: isDragging ? 'none' : 'transform 0.25s ease, opacity 0.25s ease',
              }}
            >
              <AipanBorder height={16} id="discover-card-next-top" />
              <div style={{ position: 'relative', height: '380px', width: '100%', background: '#0e0e11' }}>
                <img
                  src={
                    nextCandidate.photos?.find((p: any) => p.isPrimary)?.fileUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'
                  }
                  alt="Next Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,14,17,0.95) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
                  <h3 style={{ margin: 0, color: '#FAF8F2' }}>
                    {nextCandidate.user?.firstName} {nextCandidate.user?.lastName}, {new Date().getFullYear() - new Date(nextCandidate.dateOfBirth).getFullYear()}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Foreground Swipable Active Card */}
          <div
            className="card aipan-card"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: 0,
              overflow: 'hidden',
              borderRadius: '18px',
              border: '1.5px solid rgba(250, 248, 242, 0.28)',
              boxShadow: '0 25px 55px rgba(0,0,0,0.85), 0 0 35px rgba(122,31,29,0.45)',
              position: 'relative',
              zIndex: 3,
              touchAction: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              transform: cardTransform,
              transition: cardTransition,
            }}
          >
            {/* DYNAMIC LIKE STAMP OVERLAY */}
            <div
              style={{
                position: 'absolute',
                top: '32px',
                left: '24px',
                border: '3.5px solid #10b981',
                color: '#34d399',
                backgroundColor: 'rgba(6, 78, 59, 0.88)',
                backdropFilter: 'blur(6px)',
                padding: '6px 16px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '1.15rem',
                letterSpacing: '0.08em',
                transform: 'rotate(-14deg)',
                zIndex: 10,
                opacity: dragOffset.x > 20 ? Math.min(1, (dragOffset.x - 20) / 75) : flyDirection === 'LIKE' ? 1 : 0,
                transition: isDragging ? 'none' : 'opacity 0.2s ease',
                pointerEvents: 'none',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5)',
              }}
            >
              💖 SHUBH VIVAH
            </div>

            {/* DYNAMIC PASS STAMP OVERLAY */}
            <div
              style={{
                position: 'absolute',
                top: '32px',
                right: '24px',
                border: '3.5px solid #ef4444',
                color: '#f87171',
                backgroundColor: 'rgba(127, 29, 29, 0.88)',
                backdropFilter: 'blur(6px)',
                padding: '6px 16px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '1.15rem',
                letterSpacing: '0.08em',
                transform: 'rotate(14deg)',
                zIndex: 10,
                opacity: dragOffset.x < -20 ? Math.min(1, (-dragOffset.x - 20) / 75) : flyDirection === 'DISLIKE' ? 1 : 0,
                transition: isDragging ? 'none' : 'opacity 0.2s ease',
                pointerEvents: 'none',
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.5)',
              }}
            >
              ✕ PASS
            </div>

            {/* DYNAMIC SUPERLIKE STAMP OVERLAY */}
            <div
              style={{
                position: 'absolute',
                top: '35px',
                left: '50%',
                transform: 'translateX(-50%)',
                border: '3.5px solid var(--gold)',
                color: 'var(--gold)',
                backgroundColor: 'rgba(122, 31, 29, 0.92)',
                backdropFilter: 'blur(6px)',
                padding: '6px 20px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '1.15rem',
                letterSpacing: '0.08em',
                zIndex: 10,
                opacity: dragOffset.y < -20 && Math.abs(dragOffset.x) < 65 ? Math.min(1, (-dragOffset.y - 20) / 75) : flyDirection === 'SUPERLIKE' ? 1 : 0,
                transition: isDragging ? 'none' : 'opacity 0.2s ease',
                pointerEvents: 'none',
                boxShadow: '0 8px 25px rgba(229, 184, 66, 0.55)',
              }}
            >
              ⭐ SUPERLIKE
            </div>

            <AipanBorder height={16} id="discover-card-top" />
            <AipanCorner position="top-left" />
            <AipanCorner position="top-right" />

            {/* Main Photo with Gradient */}
            <div style={{ position: 'relative', height: '420px', width: '100%', background: '#0e0e11' }}>
              <img
                src={
                  activeCandidate.photos?.find((p: any) => p.isPrimary)?.fileUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'
                }
                alt="Profile"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(14,14,17,0.95) 0%, rgba(14,14,17,0.2) 60%, transparent 100%)',
                }}
              />

              {/* Shield & Completeness */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 3 }}>
                {activeCandidate.user?.isVerified && (
                  <span style={{ background: 'rgba(16,185,129,0.92)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ✓ Royal Verified
                  </span>
                )}
                <span className="badge badge-pahadi">Pahadi Matrimony</span>
              </div>

              {/* Profile Core Overlay */}
              <div style={{ position: 'absolute', bottom: '18px', left: '20px', right: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#FAF8F2' }}>
                  {activeCandidate.user?.firstName} {activeCandidate.user?.lastName}, {new Date().getFullYear() - new Date(activeCandidate.dateOfBirth).getFullYear()}
                </h2>
                <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                  📍 {activeCandidate.city || 'Uttarakhand'}, {activeCandidate.country} • 📏 {activeCandidate.heightCm} cm
                </p>
              </div>
            </div>

            {/* Authentic Aipan Divider Strip */}
            <AipanBorder height={12} id="discover-card-mid" />

            {/* Details Section */}
            <div style={{ padding: '22px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                <div>🎓 {activeCandidate.highestEducation || 'Graduate'}</div>
                <div>💼 {activeCandidate.occupation || 'Professional'}</div>
                <div>🕉️ {activeCandidate.religion} ({activeCandidate.caste || 'Kumaon/Garhwal'})</div>
                <div>🥗 {activeCandidate.diet}</div>
                <div>🔮 Manglik: {activeCandidate.manglikStatus}</div>
                <div>👨‍👩‍👧 Family: {activeCandidate.familyType}</div>
              </div>

              {activeCandidate.bio && (
                <p style={{ fontSize: '0.88rem', color: '#FAF8F2', background: 'rgba(122,31,29,0.2)', border: '1px solid rgba(250,248,242,0.1)', padding: '10px 12px', borderRadius: '8px', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                  "{activeCandidate.bio}"
                </p>
              )}

              {/* Swipe Action Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px', marginTop: '6px' }}>
                {/* Undo */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUndo();
                  }}
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
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  ↩
                </button>

                {/* Pass / Dislike */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFlySwipe('DISLIKE');
                  }}
                  title="Pass (Swipe Left / Left Arrow)"
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    border: '2px solid #ef4444',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#f87171',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  ✕
                </button>

                {/* Superlike with Tehri Gold */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFlySwipe('SUPERLIKE');
                  }}
                  title="Superlike (Swipe Up / Up Arrow)"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: '2px solid var(--gold)',
                    background: 'rgba(229,184,66,0.22)',
                    color: 'var(--gold)',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  ★
                </button>

                {/* Like with Geru Green flame */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFlySwipe('LIKE');
                  }}
                  title="Connect / Like (Swipe Right / Right Arrow)"
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    border: '2px solid #10b981',
                    background: 'rgba(16,185,129,0.18)',
                    color: '#34d399',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  ♥
                </button>
              </div>
            </div>
            <AipanBorder height={14} id="discover-card-bot" />
          </div>
        </div>
      )}

      {/* End of Deck State */}
      {!loading && (!activeCandidate || currentIndex >= deck.length) && (
        <div className="card aipan-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '50px 30px', position: 'relative', zIndex: 2 }}>
          <AipanChauki size={80} className="aipan-spin" />
          <h2 style={{ color: '#FAF8F2', margin: '16px 0 8px 0' }}>Devbhoomi Deck Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            You have reviewed all matching profiles in your area. Come back shortly as fresh brides and grooms from Kumaon, Garhwal, and abroad join Mangal daily.
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
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="card aipan-card"
            style={{
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              padding: '40px 30px',
              border: '2px solid var(--gold)',
              boxShadow: '0 0 60px rgba(122,31,29,0.6)',
              animation: 'fadeIn 0.4s ease',
            }}
          >
            <AipanCorner position="top-left" />
            <AipanCorner position="top-right" />
            <AipanCorner position="bottom-left" />
            <AipanCorner position="bottom-right" />

            <div style={{ marginBottom: '10px' }}>
              <TehriNathEmblem size={64} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '2rem', margin: '0 0 6px 0' }}>
              शुभ विवाह संयोग!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
              You and <strong>{mutualMatchData.partnerName}</strong> liked each other! Devbhoomi chat and horoscope consultation are unlocked.
            </p>

            <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px auto', border: '3px solid var(--gold)' }}>
              <img src={mutualMatchData.partnerPhoto} alt="Match" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/chat" className="btn btn-primary" style={{ padding: '12px' }}>
                💬 Start Devbhoomi Conversation
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
