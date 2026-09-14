'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function KundliPage() {
  // Groom details
  const [groomName, setGroomName] = useState('Rahul Verma');
  const [groomDob, setGroomDob] = useState('1994-06-15');
  const [groomTime, setGroomTime] = useState('14:30');
  const [groomPlace, setGroomPlace] = useState('Delhi, India');
  const [groomRasi, setGroomRasi] = useState('Aries');

  // Bride details
  const [brideName, setBrideName] = useState('Pooja Sharma');
  const [brideDob, setBrideDob] = useState('1996-08-22');
  const [brideTime, setBrideTime] = useState('09:15');
  const [bridePlace, setBridePlace] = useState('Jaipur, India');
  const [brideRasi, setBrideRasi] = useState('Leo');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/kundli/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groom: {
            name: groomName,
            birthDate: groomDob,
            birthTime: groomTime,
            birthPlace: groomPlace,
            rasi: groomRasi,
          },
          bride: {
            name: brideName,
            birthDate: brideDob,
            birthTime: brideTime,
            birthPlace: bridePlace,
            rasi: brideRasi,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Kundli calculation failed');
      }

      setReport(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            🕉️ Vedic Jyotish Engine
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '4px 0 8px 0' }}>
            Ashta-Koota 36 Guna Milan & Kundli Matching
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            Calculate authentic Vedic compatibility across all 8 Kootas (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) and detect Manglik Dosha alignments.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
          <form onSubmit={handleCalculate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              
              {/* Groom's Column */}
              <div style={{ background: 'rgba(212,175,55,0.03)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🤴</span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--gold)' }}>Groom's Kundli Details</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name</label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Birth Date</label>
                      <input
                        type="date"
                        value={groomDob}
                        onChange={(e) => setGroomDob(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Birth Time</label>
                      <input
                        type="time"
                        value={groomTime}
                        onChange={(e) => setGroomTime(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Birth City</label>
                    <input
                      type="text"
                      value={groomPlace}
                      onChange={(e) => setGroomPlace(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Moon Sign (Rasi)</label>
                    <select
                      value={groomRasi}
                      onChange={(e) => setGroomRasi(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                    >
                      {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bride's Column */}
              <div style={{ background: 'rgba(139,0,0,0.04)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.4rem' }}>👰</span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--crimson)' }}>Bride's Kundli Details</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name</label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Birth Date</label>
                      <input
                        type="date"
                        value={brideDob}
                        onChange={(e) => setBrideDob(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Birth Time</label>
                      <input
                        type="time"
                        value={brideTime}
                        onChange={(e) => setBrideTime(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Birth City</label>
                    <input
                      type="text"
                      value={bridePlace}
                      onChange={(e) => setBridePlace(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Moon Sign (Rasi)</label>
                    <select
                      value={brideRasi}
                      onChange={(e) => setBrideRasi(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                    >
                      {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-gold"
                style={{ padding: '14px 36px', fontSize: '1.05rem', fontWeight: 'bold' }}
              >
                {loading ? 'Consulting Ephemeris...' : '✨ Calculate 36 Guna Milan'}
              </button>
            </div>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {/* Results Section */}
        {report && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease' }}>
            
            {/* Score Showcase Hero */}
            <div
              className="card"
              style={{
                padding: '40px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(139,0,0,0.08) 100%)',
                border: '2px solid var(--gold)',
              }}
            >
              <span className={`badge ${report.recommendation === 'UTTAM' ? 'badge-gold' : report.recommendation === 'MADHYAM' ? 'badge-crimson' : 'badge-crimson'}`} style={{ fontSize: '0.9rem', marginBottom: '14px' }}>
                {report.recommendationTitle}
              </span>

              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '4.5rem', fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontWeight: 'bold' }}>
                  {report.totalScore}
                </span>
                <span style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}> / 36</span>
              </div>

              <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', maxWidth: '700px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                {report.summary}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <Link href="/pandits" className="btn btn-primary">
                  Consult a Verified Vedic Pandit
                </Link>
              </div>
            </div>

            {/* Ashta-Koota Breakdown Table */}
            <div className="card" style={{ padding: '30px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1.3rem' }}>
                Ashta-Koota Detailed Scoring
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Koota Pillar</th>
                      <th style={{ padding: '12px' }}>Max Points</th>
                      <th style={{ padding: '12px' }}>Points Obtained</th>
                      <th style={{ padding: '12px' }}>Astrological Meaning</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(report.kootas).map((k: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{k.name}</td>
                        <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{k.maxPoints}</td>
                        <td style={{ padding: '14px 12px', color: 'var(--gold)', fontWeight: 'bold', fontSize: '1rem' }}>{k.pointsObtained}</td>
                        <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{k.description}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span
                            className={`badge ${
                              k.status === 'EXCELLENT' ? 'badge-gold' : k.status === 'GOOD' ? 'badge-secondary' : 'badge-crimson'
                            }`}
                          >
                            {k.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manglik Dosha & Remedies Card */}
            <div className="card" style={{ padding: '30px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.6rem' }}>🪐</span>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                  Manglik Dosha & Planetary Remedies
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Groom Status</span>
                  <h4 style={{ margin: '6px 0 0 0', color: report.manglikAnalysis.groomManglikStatus === 'MANGLIK' ? '#ef4444' : '#10b981' }}>
                    {report.manglikAnalysis.groomManglikStatus}
                  </h4>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bride Status</span>
                  <h4 style={{ margin: '6px 0 0 0', color: report.manglikAnalysis.brideManglikStatus === 'MANGLIK' ? '#ef4444' : '#10b981' }}>
                    {report.manglikAnalysis.brideManglikStatus}
                  </h4>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dosha Cancellation</span>
                  <h4 style={{ margin: '6px 0 0 0', color: report.manglikAnalysis.isManglikCancelled ? '#10b981' : 'var(--gold)' }}>
                    {report.manglikAnalysis.isManglikCancelled ? '✓ Cancelled (Both Manglik)' : 'Active (Remedies Suggested)'}
                  </h4>
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '1rem' }}>Vedic Remedial Actions:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {report.manglikAnalysis.remedies.map((rem: string, idx: number) => (
                    <li key={idx}>{rem}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
