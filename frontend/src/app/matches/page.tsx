'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { AipanCorner, TehriNathEmblem, AipanBorder } from '../../components/AipanPatterns';

export default function MatchesPage() {
  const { user, token } = useAuth();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('ALL');

  const fetchRecommendations = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/matches/recommendations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to load recommendations');
      }
      setMatches(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  // Send Direct Interest / Superlike
  const handleSendInterest = async (candidateId: string, action: 'LIKE' | 'SUPERLIKE') => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/interest/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ swipedId: candidateId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.data.message || 'Interest sent successfully!');
        // Filter out candidate from feed
        setMatches((prev) => prev.filter((m) => m.profile.userId !== candidateId));
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top Header with Pahadi Heritage */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-pahadi">
                🎨 Kumaon & Garhwal Heritage Match
              </span>
              <span className="badge badge-gold">
                🪔 Ashta-Koota Synced
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '4px 0 8px 0' }}>
              Your Daily Auspicious Recommendations
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              Handpicked profiles algorithmically evaluated by family values, Aipan traditions, and 36 Guna compatibility.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/discover" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🃏</span> Swipe Deck Mode
            </Link>
            <Link href="/interests" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>💌</span> Interests Inbox
            </Link>
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { label: 'All Profiles (समस्त प्रस्ताव)', value: 'ALL' },
            { label: '🏔️ Kumaoni Profiles (कुमाऊँनी)', value: 'KUMAON' },
            { label: '👑 Garhwali Profiles (गढ़वाली)', value: 'GARHWAL' },
            { label: '✓ Verified Royal Shield', value: 'VERIFIED' },
          ].map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilterRegion(f.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: filterRegion === f.value ? '1px solid var(--gold)' : '1px solid var(--border-color)',
                background: filterRegion === f.value ? 'rgba(122, 31, 29, 0.4)' : 'var(--bg-secondary)',
                color: filterRegion === f.value ? '#FAF8F2' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: filterRegion === f.value ? 'bold' : 'normal',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Action toast */}
        {actionSuccess && (
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#34d399', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✨</span> {actionSuccess}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>🪔</div>
            <p>Evaluating Devbhoomi planetary charts and horoscope alignments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card" style={{ padding: '40px', textAlign: 'center', borderColor: '#ef4444' }}>
            <p style={{ color: '#f87171', marginBottom: '16px' }}>{error}</p>
            <Link href="/onboarding" className="btn btn-gold">
              Complete Profile Onboarding
            </Link>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {matches.map(({ profile, compatibilityScore, matchReasons }) => {
              const age = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear();
              const primaryPhoto = profile.photos?.find((p: any) => p.isPrimary)?.fileUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';

              return (
                <div
                  key={profile.id}
                  className="card aipan-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <AipanBorder height={14} id={`mc-top-${profile.id}`} />
                  <AipanCorner position="top-left" />
                  <AipanCorner position="top-right" />

                  {/* Photo Header */}
                  <div style={{ position: 'relative', height: '280px', width: '100%', background: '#0e0e11' }}>
                    <img
                      src={primaryPhoto}
                      alt={profile.user?.firstName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(14,14,17,0.95) 0%, transparent 60%)',
                      }}
                    />

                    {/* Compatibility Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        background: 'rgba(14,14,17,0.88)',
                        backdropFilter: 'blur(8px)',
                        border: '1.5px solid var(--gold)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        color: 'var(--gold)',
                        zIndex: 3,
                      }}
                    >
                      ★ {compatibilityScore}% Match
                    </div>

                    {/* Verified Shield */}
                    {profile.user?.isVerified && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '14px',
                          background: 'rgba(16,185,129,0.92)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          color: '#fff',
                          fontWeight: 'bold',
                          zIndex: 3,
                        }}
                      >
                        ✓ Verified Shield
                      </div>
                    )}

                    {/* Name and Age at bottom of photo */}
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>
                        {profile.user?.firstName} {profile.user?.lastName?.charAt(0)}.
                      </h3>
                      <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                        {age} yrs • {profile.heightCm} cm • 📍 {profile.city || 'Uttarakhand'}
                      </p>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      <div>📚 {profile.highestEducation || 'Graduate'}</div>
                      <div>💼 {profile.occupation || 'Professional'}</div>
                      <div>🕉️ {profile.religion} ({profile.caste || 'Pahadi'})</div>
                      <div>🥗 {profile.diet}</div>
                    </div>

                    {/* Match Reasons Tags */}
                    {matchReasons && matchReasons.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                        {matchReasons.map((r: string, idx: number) => (
                          <span
                            key={idx}
                            style={{
                              background: 'rgba(229,184,66,0.1)',
                              border: '1px solid rgba(229,184,66,0.3)',
                              color: 'var(--gold)',
                              fontSize: '0.75rem',
                              padding: '3px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        onClick={() => handleSendInterest(profile.userId, 'LIKE')}
                        className="btn btn-primary"
                        style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                      >
                        💖 Send Interest
                      </button>
                      <button
                        onClick={() => handleSendInterest(profile.userId, 'SUPERLIKE')}
                        className="btn btn-gold"
                        style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                      >
                        ⭐ Superlike
                      </button>
                    </div>
                  </div>
                  <AipanBorder height={12} id={`mc-bot-${profile.id}`} />
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && matches.length === 0 && (
          <div className="card aipan-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px' }}>🏔️</span>
            <h3 style={{ color: '#FAF8F2', marginBottom: '8px' }}>You have reviewed all daily matches</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 24px auto' }}>
              Check back tomorrow for fresh daily recommendations, or head to the Swipe Deck to discover more Devbhoomi profiles.
            </p>
            <Link href="/discover" className="btn btn-primary">
              Launch Swipe Deck
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
