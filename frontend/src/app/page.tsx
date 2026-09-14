import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 5rem 0',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            {/* Trust Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                marginBottom: '2rem',
              }}
            >
              <span style={{ fontSize: '1rem' }}>✨</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                India&apos;s #1 AI-Powered Matrimonial & Wedding Ecosystem
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                marginBottom: '1.5rem',
              }}
            >
              Where Sacred Traditions Meet{' '}
              <span className="text-gold-gradient">Intelligent Matchmaking</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '3rem',
                maxWidth: '680px',
                margin: '0 auto 3rem auto',
              }}
            >
              Find your ideal life partner with 100% government ID verification, Vedic Kundli matching, certified astrologers, and complete wedding planning services.
            </p>
          </div>

          {/* 2. INTERACTIVE MATRIMONIAL SEARCH WIDGET */}
          <div
            className="glass-panel"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              padding: '2rem 2.5rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem',
                alignItems: 'flex-end',
              }}
            >
              {/* Field: Looking for */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-gold)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Looking For
                </label>
                <select
                  defaultValue="BRIDE"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(8, 12, 21, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                >
                  <option value="BRIDE">Bride (Female)</option>
                  <option value="GROOM">Groom (Male)</option>
                </select>
              </div>

              {/* Field: Age Range */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-gold)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Age Range
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    defaultValue="22"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(8, 12, 21, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="20">20 Yrs</option>
                    <option value="22">22 Yrs</option>
                    <option value="25">25 Yrs</option>
                    <option value="28">28 Yrs</option>
                  </select>
                  <span style={{ color: 'var(--text-muted)' }}>to</span>
                  <select
                    defaultValue="30"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(8, 12, 21, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="28">28 Yrs</option>
                    <option value="30">30 Yrs</option>
                    <option value="35">35 Yrs</option>
                    <option value="40">40 Yrs</option>
                  </select>
                </div>
              </div>

              {/* Field: Religion */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-gold)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Religion
                </label>
                <select
                  defaultValue="HINDU"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(8, 12, 21, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                >
                  <option value="ALL">Any Religion</option>
                  <option value="HINDU">Hindu</option>
                  <option value="SIKH">Sikh</option>
                  <option value="JAIN">Jain</option>
                  <option value="BUDDHIST">Buddhist</option>
                  <option value="CHRISTIAN">Christian</option>
                  <option value="MUSLIM">Muslim</option>
                </select>
              </div>

              {/* Field: Mother Tongue */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-gold)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Mother Tongue
                </label>
                <select
                  defaultValue="Hindi"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(8, 12, 21, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                >
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div>
                <Link
                  href="/signup"
                  className="btn btn-gold"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                  }}
                >
                  Let&apos;s Begin →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE ECOSYSTEM PILLARS */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
              A Unified Ecosystem for Auspicious Beginnings
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Unlike single-purpose apps, Mangal seamlessly bridges life partnership, astrological alignment, and full wedding execution.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Pillar 1 */}
            <div className="glass-panel" style={{ padding: '2.25rem 1.75rem' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1.25rem' }}>💍</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-gold)' }}>
                Verified Matrimony
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Multi-factor profile validation with Aadhaar/Govt ID verification, selfie liveliness, family background checks, and strict privacy guards.
              </p>
              <Link href="/search" style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                Explore Profiles →
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel" style={{ padding: '2.25rem 1.75rem' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1.25rem' }}>🪐</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-gold)' }}>
                Vedic Kundli & Pandits
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Instant 36-point Ashtakoota Gun Milan, Mangal Dosha detection, and direct video consultations with authenticated Vedic Shastri Pandits.
              </p>
              <Link href="/pandit" style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                Consult a Pandit →
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel" style={{ padding: '2.25rem 1.75rem' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1.25rem' }}>💬</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-gold)' }}>
                Consent-Based Realtime Chat
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Zero spam. Messaging and audio/video calling unlock only when mutual interest is explicitly confirmed or family consent is given.
              </p>
              <Link href="/signup" style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                View Match Deck →
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="glass-panel" style={{ padding: '2.25rem 1.75rem' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1.25rem' }}>🎪</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-gold)' }}>
                Wedding Marketplace
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                From grand banquet venues and award-winning photographers to bespoke caterers and decor stylists. Instant bookings with escrow security.
              </p>
              <Link href="/marketplace" style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                Browse Vendors →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'radial-gradient(ellipse at center, rgba(158, 27, 50, 0.35) 0%, rgba(8, 12, 21, 0.95) 75%)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
            }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              Begin Your Journey to a Blessed Union
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                maxWidth: '620px',
                margin: '0 auto 2.5rem auto',
              }}
            >
              Join thousands of brides, grooms, and families finding authentic life partners on India&apos;s highest-rated matrimony platform.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
                Create Free Profile
              </Link>
              <Link href="/search" className="btn btn-outline" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                Explore Sample Matches
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
