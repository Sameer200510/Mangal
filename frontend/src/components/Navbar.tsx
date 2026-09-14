'use client';

import React from 'react';
import Link from 'next/link';
import HealthBadge from './HealthBadge';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(8, 12, 21, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        padding: '0.85rem 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--crimson-gradient)',
              border: '1.5px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(158, 27, 50, 0.4)',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🪔</span>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.65rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
              className="text-gold-gradient"
            >
              Mangal
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}
            >
              Matrimony & Weddings
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            fontSize: '0.88rem',
          }}
        >
          <Link href="/matches" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Matches
          </Link>
          <Link href="/discover" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Discover
          </Link>
          <Link href="/chat" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Chat
          </Link>
          <Link href="/kundli" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Kundli
          </Link>
          <Link href="/pandits" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Pandits
          </Link>
          <Link href="/vendors" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Vendors
          </Link>
          <Link href="/pricing" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Plans
          </Link>
          <Link href="/verify" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
            Shield
          </Link>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" style={{ color: '#f87171', textDecoration: 'none', fontWeight: 600 }}>
              Admin
            </Link>
          )}
        </nav>

        {/* Live Status & User Profile / CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <HealthBadge />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/profile"
                className="btn btn-outline"
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
              >
                👤 {user.firstName}
              </Link>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Join Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
