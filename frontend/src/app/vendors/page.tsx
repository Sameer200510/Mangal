'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function VendorsPage() {
  const { user, token } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [citySearch, setCitySearch] = useState('');

  // Quote Request Modal
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState(250);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = '/api/v1/vendors?limit=24';
      if (selectedCategory) url += `&serviceType=${selectedCategory}`;
      if (citySearch) url += `&city=${encodeURIComponent(citySearch)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setListings(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleRequestQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please sign in to request a wedding quotation');
      return;
    }

    setQuoteLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/vendors/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: selectedListing.id,
          eventDate,
          guestCount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to submit quote request');
      }

      setQuoteSuccess('Quote request sent! The wedding organizer will reply with an itemized proposal within 24 hours.');
      setTimeout(() => {
        setQuoteSuccess(null);
        setSelectedListing(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setQuoteLoading(false);
    }
  };

  const categories = [
    { label: 'All Categories', value: '' },
    { label: '🏰 Royal Venues', value: 'VENUE' },
    { label: '📸 Photography', value: 'PHOTOGRAPHY' },
    { label: '🍽️ Royal Catering', value: 'CATERING' },
    { label: '💐 Floral Decor', value: 'DECORATION' },
    { label: '🎵 Music & DJ', value: 'DJ_MUSIC' },
    { label: '📋 Wedding Planners', value: 'WEDDING_PLANNER' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top Hero Banner */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            💍 Luxury Wedding Marketplace
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '4px 0 10px 0' }}>
            Verified Wedding Vendors & Organizers
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
            Book the finest destination venues, cinematic photographers, bespoke decorators, and royal caterers with transparent pricing.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="card" style={{ padding: '20px', marginBottom: '36px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by city (e.g. Udaipur, Delhi, Jaipur, Mumbai)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              Search Vendors
            </button>
          </form>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedCategory(c.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: selectedCategory === c.value ? '1px solid var(--gold)' : '1px solid var(--border-color)',
                  background: selectedCategory === c.value ? 'rgba(212,175,55,0.15)' : 'var(--bg-secondary)',
                  color: selectedCategory === c.value ? 'var(--gold)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  fontWeight: selectedCategory === c.value ? 'bold' : 'normal',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <p>Curating top rated vendors...</p>
          </div>
        )}

        {/* Vendors Grid */}
        {!loading && listings.length === 0 && (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '14px' }}>🏛️</span>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No vendors found in this category</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Try selecting "All Categories" or searching for a different city.
            </p>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {listings.map((l) => (
              <div
                key={l.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                }}
              >
                <div style={{ position: 'relative', height: '220px', width: '100%', background: '#121217' }}>
                  <img
                    src={l.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600'}
                    alt={l.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(14,14,17,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--gold)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {l.serviceType}
                  </span>

                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(16,185,129,0.9)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    ★ {l.organizer?.rating || '5.0'}
                  </span>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    {l.title}
                  </h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    🏢 {l.organizer?.businessName} • 📍 {l.organizer?.city || 'India'}
                  </p>
                  <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
                    {l.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Starting From</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                        ₹{Number(l.startingPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedListing(l)}
                      className="btn btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quote Request Modal */}
        {selectedListing && (
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
                maxWidth: '460px',
                width: '100%',
                padding: '30px',
                border: '1px solid var(--gold)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>
                  Request Wedding Quote
                </h3>
                <button
                  onClick={() => setSelectedListing(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--gold)', margin: '0 0 16px 0' }}>
                Service: {selectedListing.title} ({selectedListing.organizer?.businessName})
              </p>

              {error && (
                <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#f87171', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              {quoteSuccess && (
                <div style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '6px', color: '#34d399', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {quoteSuccess}
                </div>
              )}

              <form onSubmit={handleRequestQuote}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Tentative Wedding / Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Expected Guest Count
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    min={20}
                    max={5000}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={quoteLoading}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    {quoteLoading ? 'Sending Inquiry...' : 'Submit Quote Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedListing(null)}
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
