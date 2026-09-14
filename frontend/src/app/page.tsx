import React from 'react';
import Link from 'next/link';
import { AipanChauki, AipanBorder, AipanDivider, TehriNathEmblem, HimalayanSilhouettes, AipanCorner } from '../components/AipanPatterns';

export default function HomePage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. HERO SECTION WITH HIMALAYAN PEAKS & AIPAN ART */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 5.5rem 0',
          background: 'linear-gradient(180deg, #070A0E 0%, #150D0E 45%, #2B1110 100%)',
          overflow: 'hidden',
          borderBottom: '2px solid rgba(250, 248, 242, 0.15)',
        }}
      >
        {/* Himalayan Mountain Silhouettes in Backdrop */}
        <HimalayanSilhouettes />

        {/* Decorative Ambient Aipan Motifs */}
        <div style={{ position: 'absolute', top: '10%', left: '-50px', opacity: 0.18, pointerEvents: 'none' }}>
          <AipanChauki size={300} className="aipan-spin" />
        </div>
        <div style={{ position: 'absolute', top: '15%', right: '-60px', opacity: 0.18, pointerEvents: 'none' }}>
          <AipanChauki size={320} className="aipan-spin" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            {/* Cultural Trust Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(122, 31, 29, 0.5)',
                border: '1.5px solid var(--tehri-gold)',
                marginBottom: '1.8rem',
                boxShadow: '0 4px 18px rgba(122, 31, 29, 0.55)',
              }}
            >
              <TehriNathEmblem size={22} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FAF8F2', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                ✨ Devbhoomi Uttarakhand • Sacred Pahadi Matrimony
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
                lineHeight: 1.14,
                fontWeight: 900,
                marginBottom: '1.2rem',
                letterSpacing: '-0.01em',
              }}
            >
              Sacred Matrimony in the Abode of Gods,{' '}
              <span className="text-gold-gradient">Blessed by Tradition</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2.8rem',
                maxWidth: '720px',
                margin: '0 auto 2.8rem auto',
              }}
            >
              Discover cherished life partners from Kumaon, Garhwal, and across the globe. Honoring sacred <strong>Aipan Lagna Chauki</strong>, authentic 36 Guna Milan, verified identities, and royal Himalayan destination weddings.
            </p>
          </div>

          {/* 2. AIPAN GERU SEARCH WIDGET WITH AUTHENTIC AURA BORDERS */}
          <div
            className="aipan-card"
            style={{
              maxWidth: '1020px',
              margin: '0 auto',
              padding: 0,
              position: 'relative',
              boxShadow: '0 20px 55px rgba(0,0,0,0.85), 0 0 40px rgba(122, 31, 29, 0.45)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1.5px solid rgba(250, 248, 242, 0.3)',
            }}
          >
            {/* Top Authentic Aipan Bel Border */}
            <AipanBorder height={24} id="hero-search-top" />

            <div style={{ padding: '2rem 2.4rem', position: 'relative' }}>
              <AipanCorner position="top-left" />
              <AipanCorner position="top-right" />
              <AipanCorner position="bottom-left" />
              <AipanCorner position="bottom-right" />

              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.84rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                  🪔 शुभ विवाह अनुसंधान • Discover Your Matrimonial Match
                </span>
              </div>

            <form action="/matches" method="GET">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.2rem',
                  alignItems: 'flex-end',
                }}
              >
                {/* Looking for */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#FAF8F2',
                      marginBottom: '0.45rem',
                    }}
                  >
                    Looking For
                  </label>
                  <select
                    name="gender"
                    defaultValue="FEMALE"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(9, 13, 18, 0.9)',
                      border: '1px solid rgba(250, 248, 242, 0.25)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="FEMALE">Kumaoni / Garhwali Bride</option>
                    <option value="MALE">Kumaoni / Garhwali Groom</option>
                  </select>
                </div>

                {/* Community / Region */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#FAF8F2',
                      marginBottom: '0.45rem',
                    }}
                  >
                    Community Heritage
                  </label>
                  <select
                    name="community"
                    defaultValue="ALL"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(9, 13, 18, 0.9)',
                      border: '1px solid rgba(250, 248, 242, 0.25)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="ALL">All Uttarakhand Communities</option>
                    <option value="KUMAONI_RAJPUT">Kumaoni Rajput (खस/रौतेला/बिष्ट)</option>
                    <option value="KUMAONI_BRAHMIN">Kumaoni Brahmin (पंत/जोशी/पांडे)</option>
                    <option value="GARHWALI_RAJPUT">Garhwali Rajput (नेगी/रावत/पंवार)</option>
                    <option value="GARHWALI_BRAHMIN">Garhwali Brahmin (नौटियाल/भट्ट/डंगवाल)</option>
                    <option value="JAUNSARI">Jaunsari / Bhotia Heritage</option>
                    <option value="PAN_INDIA">All India Matrimonial</option>
                  </select>
                </div>

                {/* Native District */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#FAF8F2',
                      marginBottom: '0.45rem',
                    }}
                  >
                    Native District / City
                  </label>
                  <select
                    name="city"
                    defaultValue="ALL"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(9, 13, 18, 0.9)',
                      border: '1px solid rgba(250, 248, 242, 0.25)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="ALL">All Districts / Global NRI</option>
                    <option value="Almora">Almora (अल्मोड़ा)</option>
                    <option value="Nainital">Nainital (नैनीताल)</option>
                    <option value="Dehradun">Dehradun (देहरादून)</option>
                    <option value="Pauri">Pauri Garhwal (पौड़ी)</option>
                    <option value="Tehri">Tehri Garhwal (टिहरी)</option>
                    <option value="Pithoragarh">Pithoragarh (पिथौरागढ़)</option>
                    <option value="Haridwar">Haridwar / Rishikesh</option>
                    <option value="Chamoli">Chamoli (चमोली)</option>
                    <option value="Delhi_NCR">Delhi NCR (Uttarakhand Diaspora)</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div>
                  <button
                    type="submit"
                    className="btn btn-gold"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1.4rem',
                      fontSize: '0.95rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    🔍 Find Matches
                  </button>
                </div>
              </div>
            </form>
            </div>

            {/* Bottom Authentic Aipan Bel Border */}
            <AipanBorder height={24} id="hero-search-bottom" />
          </div>
        </div>
      </section>

      {/* Decorative Aipan Divider with Central Lotus Chauki */}
      <AipanDivider id="div-hero" />

      {/* 3. UTTARAKHAND CULTURAL VIBRANCE: KUMAON AIPAN & GARHWALI TRADITIONS */}
      <section style={{ padding: '3.5rem 0 5rem 0', background: 'var(--bg-primary)', position: 'relative' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-pahadi" style={{ marginBottom: '0.8rem' }}>
              🎨 Sacred Folk Heritage
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#FAF8F2', marginBottom: '0.8rem' }}>
              Where Kumaoni Aipan Meets Garhwali Valor
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.65 }}>
              In Uttarakhand, every marriage is a sacred union celebrated with Geru & Biswar Aipan art, ancient Vedic hymns, and the melodious rhythm of Pahadi Mangal Geet.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            
            {/* Pillar 1: Aipan Lagna Chauki */}
            <div className="aipan-card" style={{ padding: 0, overflow: 'hidden' }}>
              <AipanBorder height={16} id="pillar-1-top" />
              <div style={{ padding: '28px', position: 'relative' }}>
                <AipanCorner position="top-left" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <AipanChauki size={54} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#FAF8F2' }}>Aipan Lagna Chauki</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Kumaoni Sacred Art
                    </span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 16px 0' }}>
                  Drawn by the matrons of the family using natural <em>Geru</em> clay and <em>Biswar</em> rice paste. From <strong>Dhuli Arghya</strong> to <strong>Achaman Chauki</strong>, each motif invokes blessings of Mahalakshmi and Lord Ganesha.
                </p>
                <Link href="/kundli" style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                  Explore 36 Guna Milan Reports →
                </Link>
              </div>
            </div>

            {/* Pillar 2: Garhwali Royal Heritage */}
            <div className="aipan-card" style={{ padding: 0, overflow: 'hidden' }}>
              <AipanBorder height={16} id="pillar-2-top" />
              <div style={{ padding: '28px', position: 'relative' }}>
                <AipanCorner position="top-left" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <TehriNathEmblem size={54} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#FAF8F2' }}>Garhwali Tehri Heritage</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Royal Ornaments & Culture
                    </span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 16px 0' }}>
                  Adorned with the majestic <strong>Tehri Nath</strong>, Hansuli, and Guloband. Resonating with the auspicious notes of <em>Dhol-Damau</em>, <em>Ransingha</em>, and soulful Mangal geet echoing across misty Himalayan vales.
                </p>
                <Link href="/matches" style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                  Browse Garhwali Profiles →
                </Link>
              </div>
            </div>

            {/* Pillar 3: Himalayan Destination Weddings */}
            <div className="aipan-card" style={{ padding: 0, overflow: 'hidden' }}>
              <AipanBorder height={16} id="pillar-3-top" />
              <div style={{ padding: '28px', position: 'relative' }}>
                <AipanCorner position="top-left" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'rgba(122, 31, 29, 0.4)',
                      border: '1.5px solid var(--gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                    }}
                  >
                    🏔️
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#FAF8F2' }}>Himalayan Wedding Venues</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Jim Corbett to Mussoorie
                    </span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 16px 0' }}>
                  Exchange sacred vows with panoramic snow-capped Himalayan ridges as your Mandap backdrop. Connect with certified luxury wedding planners, royal hill resorts, and candid cinematographers.
                </p>
                <Link href="/vendors" style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                  Discover Wedding Venues →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Decorative Aipan Divider */}
      <AipanDivider id="div-cultural" />

      {/* 4. VERIFIED ECOSYSTEM STATS */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div className="card" style={{ padding: '28px 20px', borderTop: '3px solid var(--gold)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>100%</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FAF8F2', marginTop: '6px' }}>Aadhaar & KYC Verified</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>Zero fake profiles guaranteed with RBI-grade ID masking</p>
            </div>

            <div className="card" style={{ padding: '28px 20px', borderTop: '3px solid var(--buransh-scarlet)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FAF8F2', fontFamily: 'var(--font-heading)' }}>36 Guna</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FAF8F2', marginTop: '6px' }}>Vedic Milan Engine</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>Authentic Ashta-Koota & Manglik Dosha algorithms</p>
            </div>

            <div className="card" style={{ padding: '28px 20px', borderTop: '3px solid var(--gold)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>HD Video</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FAF8F2', marginTop: '6px' }}>WebRTC Encrypted Calls</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>Private 1-on-1 conversations with screenshot defense</p>
            </div>

            <div className="card" style={{ padding: '28px 20px', borderTop: '3px solid var(--buransh-scarlet)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FAF8F2', fontFamily: 'var(--font-heading)' }}>13 Districts</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FAF8F2', marginTop: '6px' }}>Devbhoomi & Global Diaspora</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>Connecting Pahadi families across India & worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION WITH SACRED MANGAL BLESSING */}
      <section
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, rgba(122, 31, 29, 0.35) 0%, rgba(9, 13, 18, 0.95) 100%)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: '12px' }}>🪔</span>
            <h2 style={{ fontSize: '2.4rem', color: '#FAF8F2', marginBottom: '14px' }}>
              Begin Your Auspicious Journey Today
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Create your verified profile in under 2 minutes. Receive algorithmically matched bride and groom profiles blessed with Uttarakhand's timeless cultural values.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn btn-gold" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
                Join Free (पंजीकरण करें)
              </Link>
              <Link href="/matches" className="btn btn-secondary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
                Explore Prospective Matches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Aipan Border Strip */}
      <AipanBorder height={24} id="page-bottom" />

    </div>
  );
}
