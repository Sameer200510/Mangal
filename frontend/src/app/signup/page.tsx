'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../common';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>(UserRole.BRIDE);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Registration failed');
      }

      login(data.data.tokens, data.data.user);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem 2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💍</div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Begin Auspiciously</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Create your verified Mangal profile in less than 2 minutes
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* Role Picker */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.5rem' }}>
              I Am Registering As
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { label: 'Bride', val: UserRole.BRIDE, icon: '👰' },
                { label: 'Groom', val: UserRole.GROOM, icon: '🤵' },
                { label: 'Parent / Family', val: UserRole.FAMILY, icon: '👨‍👩‍👧' },
                { label: 'Pandit', val: UserRole.PANDIT, icon: '🕉️' },
                { label: 'Organizer', val: UserRole.ORGANIZER, icon: '🎪' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setRole(item.val)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${role === item.val ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.2)'}`,
                    backgroundColor: role === item.val ? 'rgba(158, 27, 50, 0.35)' : 'rgba(8, 12, 21, 0.6)',
                    color: '#FFF',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{item.icon}</div>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Priya"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(8, 12, 21, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Sharma"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(8, 12, 21, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(8, 12, 21, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: '#FFF',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
              Mobile Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919876543210"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(8, 12, 21, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: '#FFF',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
              Create Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(8, 12, 21, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: '#FFF',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            {loading ? 'Creating Sacred Profile...' : 'Complete Free Registration →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--gold-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
