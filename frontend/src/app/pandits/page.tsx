'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function PanditsPage() {
  const { user, token } = useAuth();

  const [pandits, setPandits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPandit, setSelectedPandit] = useState<any | null>(null);

  // Booking Modal State
  const [serviceType, setServiceType] = useState('KUNDLI_MATCHING');
  const [scheduledDate, setScheduledDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPandits = async () => {
    try {
      const res = await fetch('/api/v1/kundli/pandits');
      const data = await res.json();
      if (data.success) {
        setPandits(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPandits();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to book a consultation');
      return;
    }

    setBookingLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/kundli/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          panditProfileId: selectedPandit.id,
          serviceType,
          scheduledDate,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Booking failed');
      }

      setBookingSuccess(`Appointment successfully booked with Acharya ${selectedPandit.user.firstName}! Confirmation details sent.`);
      setTimeout(() => {
        setBookingSuccess(null);
        setSelectedPandit(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
              🕉️ Authentic Vedic Astrologers
            </span>
            <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
              Verified Pandit & Jyotish Acharyas
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.95rem' }}>
              Consult revered scholars for 36 Gun Milan, Manglik Dosha Shanti, and Shubh Vivah Muhurat.
            </p>
          </div>
          <Link href="/kundli" className="btn btn-secondary">
            ← 36 Guna Calculator
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <p>Gathering Vedic scholar profiles...</p>
          </div>
        )}

        {/* Pandits Grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {pandits.map((pandit) => (
              <div
                key={pandit.id}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(212,175,55,0.15)',
                      border: '2px solid var(--gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      flexShrink: 0,
                    }}
                  >
                    🕉️
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                      Acharya {pandit.user?.firstName} {pandit.user?.lastName}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--gold)', fontSize: '0.85rem' }}>
                      ★ {pandit.rating} • {pandit.experienceYears}+ Years Vedic Experience
                    </p>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
                  {pandit.bio || 'Revered Vedic astrologer specializing in marriage compatibility, planetary dosha remedies and vivah muhurat.'}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Specializations</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {pandit.specializations?.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(212,175,55,0.08)',
                          border: '1px solid rgba(212,175,55,0.2)',
                          color: 'var(--gold)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                        }}
                      >
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Dakshina</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                      ₹{pandit.perConsultationFee}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPandit(pandit)}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Consultation Modal */}
        {selectedPandit && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: '480px',
                width: '100%',
                padding: '32px',
                border: '1px solid var(--gold)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                  Book Consultation with Acharya {selectedPandit.user.firstName}
                </h3>
                <button
                  onClick={() => setSelectedPandit(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {error && (
                <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#f87171', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              {bookingSuccess && (
                <div style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '6px', color: '#34d399', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {bookingSuccess}
                </div>
              )}

              <form onSubmit={handleBook}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Consultation Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                  >
                    <option value="KUNDLI_MATCHING">Ashta Koota 36 Guna Milan</option>
                    <option value="DOSHA_ANALYSIS">Manglik & Nadi Dosha Analysis</option>
                    <option value="MUHURAT">Shubh Vivah Muhurat Extraction</option>
                    <option value="GENERAL_CONSULTATION">General Matrimonial Guidance</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Dakshina Amount:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold)' }}>₹{selectedPandit.perConsultationFee}</span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    {bookingLoading ? 'Confirming Appointment...' : 'Confirm Appointment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPandit(null)}
                    className="btn btn-secondary"
                    style={{ padding: '12px 16px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
