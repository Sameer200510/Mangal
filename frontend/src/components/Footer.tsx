import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '6rem',
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        backgroundColor: 'rgba(5, 8, 15, 0.95)',
        padding: '4.5rem 0 2rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Column 1: Brand & Trust */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.8rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
              className="text-gold-gradient"
            >
              Mangal
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              India’s most trusted AI-powered matrimonial and wedding ecosystem platform. Connecting souls, families, and auspicious beginnings.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">🔒 256-bit SSL Encrypted</span>
              <span className="badge badge-success">✓ 100% ID Verified</span>
            </div>
          </div>

          {/* Column 2: Matrimony Services */}
          <div>
            <h4 style={{ color: 'var(--text-gold)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
              Matrimonial Search
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Search Brides', 'Search Grooms', 'Kundli Matchmaking', 'Elite Matchmaking', 'Success Stories'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/search"
                      style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Wedding Ecosystem */}
          <div>
            <h4 style={{ color: 'var(--text-gold)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
              Wedding Ecosystem
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Vedic Pandits & Astrologers', 'Wedding Venues & Banquets', 'Photography & Cinema', 'Catering Services', 'Bridal Wear & Decor'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/marketplace"
                      style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 4: Portals & Help */}
          <div>
            <h4 style={{ color: 'var(--text-gold)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
              Enterprise & Safety
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Pandit Registration', 'Vendor Partner Portal', 'Safety & Privacy Guidelines', 'Admin Dashboard', 'Grievance Officer'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/admin"
                      style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © 2026 Mangal Matrimonial Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Terms of Use
            </Link>
            <Link href="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
