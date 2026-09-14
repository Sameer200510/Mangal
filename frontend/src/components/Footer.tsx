import React from 'react';
import Link from 'next/link';
import { AipanBorderStrip, TehriNathEmblem, AipanChauki } from './AipanPatterns';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '5rem',
        borderTop: '2px solid rgba(250, 248, 242, 0.15)',
        backgroundColor: '#070A0E',
        position: 'relative',
      }}
    >
      {/* Decorative Aipan Strip along Top of Footer */}
      <AipanBorderStrip height={18} />

      <div className="container" style={{ padding: '4rem 1.5rem 2rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Column 1: Brand & Heritage */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <AipanChauki size={38} />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.65rem',
                    fontWeight: 800,
                    color: '#FAF8F2',
                    lineHeight: 1.1,
                  }}
                >
                  Mangal <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>मङ्गल</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Devbhoomi Uttarakhand Matrimony
                </span>
              </div>
            </div>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                lineHeight: 1.65,
                marginBottom: '1.5rem',
              }}
            >
              Rooted in the sacred traditions of Kumaoni Aipan (ऐपण) and Garhwali royal culture. Dedicated to solemnizing lifelong bonds in Devbhoomi Uttarakhand and worldwide.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-pahadi">🎨 Kumaoni Aipan Heritage</span>
              <span className="badge badge-gold">👑 Garhwali Tehri Parampara</span>
            </div>
          </div>

          {/* Column 2: Matrimonial Search */}
          <div>
            <h4 style={{ color: '#FAF8F2', marginBottom: '1.25rem', fontSize: '1.05rem', borderBottom: '1px solid rgba(229,184,66,0.3)', paddingBottom: '6px' }}>
              Pahadi Matrimony
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Kumaoni Brides & Grooms', href: '/matches' },
                { label: 'Garhwali Brides & Grooms', href: '/matches' },
                { label: 'Jaunsari Community', href: '/matches' },
                { label: '36 Guna Kundli Milan', href: '/kundli' },
                { label: 'Discover Card Deck', href: '/discover' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Wedding Ecosystem */}
          <div>
            <h4 style={{ color: '#FAF8F2', marginBottom: '1.25rem', fontSize: '1.05rem', borderBottom: '1px solid rgba(229,184,66,0.3)', paddingBottom: '6px' }}>
              Devbhoomi Vivah
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Vedic Jyotish & Pandits', href: '/pandits' },
                { label: 'Himalayan Destination Venues', href: '/vendors' },
                { label: 'Jim Corbett & Mussoorie Resorts', href: '/vendors' },
                { label: 'Pahadi Mangal Geet & Music', href: '/vendors' },
                { label: 'Royal Subscription Plans', href: '/pricing' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Safety & Privacy */}
          <div>
            <h4 style={{ color: '#FAF8F2', marginBottom: '1.25rem', fontSize: '1.05rem', borderBottom: '1px solid rgba(229,184,66,0.3)', paddingBottom: '6px' }}>
              Trust & Security
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Aadhaar & KYC Shield', href: '/verify' },
                { label: 'Encrypted Chat & Calls', href: '/chat' },
                { label: 'Active Sessions Monitor', href: '/sessions' },
                { label: 'Admin & Moderator Suite', href: '/admin' },
                { label: 'Data Privacy & GDPR', href: '/profile' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Cultural Blessing */}
        <div
          style={{
            borderTop: '1px solid rgba(250, 248, 242, 0.1)',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Mangal Matrimony. Blessed by Maa Nanda Devi & Devbhoomi Traditions. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span>🏔️ Kumaon • Garhwal • Devbhoomi</span>
            <span>🪔 ऐपण मंगलम</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
