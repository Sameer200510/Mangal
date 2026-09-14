'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, loading: authLoading, logout } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch('/api/v1/profile/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfile(data.data.profile);
      } else {
        throw new Error(data.error?.message || 'Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [authLoading, isAuthenticated, accessToken]);

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/v1/profile/export', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mangal_profile_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      setSuccess('Data archive downloaded successfully.');
    } catch (e: any) {
      setError(e.message || 'Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.')) {
      return;
    }

    try {
      await fetch('/api/v1/profile/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await logout();
      router.push('/');
    } catch (e: any) {
      setError(e.message || 'Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading your sacred matrimonial profile...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '960px' }}>
      {/* Alert Messages */}
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {/* Header Profile Card */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Avatar / Primary Photo */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--gold-primary)',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
            }}
          >
            {profile?.photos?.[0]?.fileUrl ? (
              <img
                src={profile.photos[0].fileUrl}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '👰'
            )}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '2rem' }}>
                {profile?.user?.firstName} {profile?.user?.lastName}
              </h1>
              <span className={`badge ${profile?.user?.isVerified ? 'badge-success' : 'badge-gold'}`}>
                {profile?.user?.isVerified ? '✓ Verified' : 'Pending Verification'}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              {profile?.occupation || 'Profession not set'} • {profile?.city || 'City'}, {profile?.country || 'India'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-gold)' }}>
              <span>Religion: {profile?.religion || 'Hindu'}</span>
              <span>•</span>
              <span>Caste: {profile?.caste || 'Brahmin'}</span>
              <span>•</span>
              <span>Height: {profile?.heightCm} cm</span>
            </div>
          </div>

          {/* Completeness Badge & Edit CTA */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-gold)' }}>
              {profile?.completenessScore || 40}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Profile Completeness
            </div>
            <Link href="/onboarding" className="btn btn-gold" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Edit Profile ✏️
            </Link>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Section 1: Bio */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ color: 'var(--text-gold)', fontSize: '1.15rem', marginBottom: '0.75rem' }}>About Me</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            {profile?.bio || 'No personal biography added yet. Click Edit Profile to share your story.'}
          </p>
        </div>

        {/* Section 2: Education & Career */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ color: 'var(--text-gold)', fontSize: '1.15rem', marginBottom: '0.75rem' }}>Education & Career</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>🎓 <strong>Education:</strong> {profile?.highestEducation || 'Degree not specified'}</li>
            <li>💼 <strong>Occupation:</strong> {profile?.occupation || 'Not specified'}</li>
            <li>🏢 <strong>Company:</strong> {profile?.companyName || 'Not specified'}</li>
            <li>💰 <strong>Annual Income:</strong> {profile?.annualIncomeRange || 'Confidential'}</li>
          </ul>
        </div>

        {/* Section 3: Religious & Astrology */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ color: 'var(--text-gold)', fontSize: '1.15rem', marginBottom: '0.75rem' }}>Horoscope & Gotra</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>🕉️ <strong>Religion:</strong> {profile?.religion}</li>
            <li>🧬 <strong>Caste:</strong> {profile?.caste || 'Open'}</li>
            <li>🌿 <strong>Gotra:</strong> {profile?.gotra || 'Not specified'}</li>
            <li>🪐 <strong>Manglik Status:</strong> {profile?.manglikStatus?.replace('_', ' ')}</li>
          </ul>
        </div>

        {/* Section 4: Lifestyle & Diet */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ color: 'var(--text-gold)', fontSize: '1.15rem', marginBottom: '0.75rem' }}>Lifestyle & Habits</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>🥗 <strong>Diet:</strong> {profile?.diet}</li>
            <li>🚭 <strong>Smoking:</strong> {profile?.smoking ? 'Yes' : 'No'}</li>
            <li>🍷 <strong>Drinking:</strong> {profile?.drinking ? 'Yes' : 'No'}</li>
            <li>🗣️ <strong>Mother Tongue:</strong> {profile?.motherTongue || 'Hindi'}</li>
          </ul>
        </div>
      </div>

      {/* Account & Privacy Settings */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ color: 'var(--text-gold)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          Privacy, Compliance & Data Controls
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Under Indian DPDP Act 2023 and global privacy standards, you maintain full control over your personal matrimonial data.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportData} className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}>
            📥 Export My Data Archive (JSON)
          </button>
          <button onClick={handleDeleteAccount} className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            🗑️ Delete Account & Wipe Data
          </button>
        </div>
      </div>
    </div>
  );
}
