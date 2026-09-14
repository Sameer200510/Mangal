import React from 'react';
import Link from 'next/link';
import HealthBadge from './HealthBadge';

export default function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(8, 12, 21, 0.82)',
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
            gap: '1.75rem',
          }}
        >
          <Link
            href="/search"
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
          >
            Find Matches
          </Link>
          <Link
            href="/pandit"
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
          >
            Kundli & Pandits
          </Link>
          <Link
            href="/marketplace"
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
          >
            Wedding Vendors
          </Link>
          <Link
            href="/memberships"
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
          >
            Plans
          </Link>
        </nav>

        {/* Live Status & CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <HealthBadge />

          <Link href="/login" className="btn btn-outline" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}>
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}>
            Join Free
          </Link>
        </div>
      </div>
    </header>
  );
}
