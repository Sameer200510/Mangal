'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🔐</div>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Reset Password</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Enter your registered email and we&apos;ll send you a password recovery link
        </p>

        {submitted ? (
          <div>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              ✓ Reset instructions sent to <strong>{email}</strong> if an account exists.
            </div>
            <Link href="/login" className="btn btn-outline" style={{ width: '100%', padding: '0.75rem' }}>
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              {loading ? 'Sending link...' : 'Send Recovery Link'}
            </button>
            <div style={{ marginTop: '1.5rem', fontSize: '0.88rem' }}>
              <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
