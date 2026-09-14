'use client';

import React from 'react';
import Link from 'next/link';
import HealthBadge from './HealthBadge';
import { useAuth } from '../context/AuthContext';
import { TehriNathEmblem, AipanChauki, AipanBorder } from './AipanPatterns';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(9, 13, 18, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1.5px solid rgba(250, 248, 242, 0.18)',
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(229, 184, 66, 0.25)',
      }}
    >
      {/* Top Aipan Sacred Border Strip Accent */}
      <AipanBorder height={14} id="nav-top-border" />

      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          padding: '0.75rem 1.5rem',
        }}
      >
        {/* Brand Logo with Aipan & Tehri Nath Heritage */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          {/* Authentic Kumaon Aipan Chauki Emblem */}
          <div
            style={{
              position: 'relative',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'radial-gradient(circle, #8B2500 0%, #4A100E 100%)',
              border: '1.5px solid #FAF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(122, 31, 29, 0.6), inset 0 0 8px rgba(229, 184, 66, 0.4)',
              overflow: 'hidden',
            }}
          >
            <AipanChauki size={44} className="aipan-spin" />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
              }}
            >
              🪔
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1,
                color: '#FAF8F2',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Mangal</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--gold)', fontFamily: 'serif' }}>मङ्गल</span>
            </div>
            <div
              style={{
                fontSize: '0.66rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                fontWeight: 600,
                marginTop: '2px',
              }}
            >
              Devbhoomi • Kumaon & Garhwal
            </div>
          </div>
        </Link>

        {/* Navigation Links with Himalayan Motifs */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.15rem',
            fontSize: '0.88rem',
          }}
        >
          <Link href="/matches" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Matches
          </Link>
          <Link href="/discover" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Discover Deck
          </Link>
          <Link href="/chat" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Chat & Calls
          </Link>
          <Link href="/kundli" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            36 Guna Milan
          </Link>
          <Link href="/pandits" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Pahadi Pandits
          </Link>
          <Link href="/vendors" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Wedding Venues
          </Link>
          <Link href="/pricing" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Royal Plans
          </Link>
          <Link
            href="/verify"
            style={{
              color: 'var(--gold)',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(229, 184, 66, 0.1)',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid rgba(229, 184, 66, 0.3)',
            }}
          >
            <span>🛡️</span> Shield
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
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', borderColor: 'var(--gold)' }}
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
              <Link
                href="/signup"
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.35rem',
                  fontSize: '0.85rem',
                  background: 'var(--geru-gradient)',
                  borderColor: '#FAF8F2',
                }}
              >
                Join Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
