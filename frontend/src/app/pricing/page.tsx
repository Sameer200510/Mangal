'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function PricingPage() {
  const { user, token } = useAuth();

  const [plans, setPlans] = useState<any[]>([]);
  const [activeSub, setActiveSub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasingTier, setPurchasingTier] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPlansAndSub = async () => {
    try {
      const resPlans = await fetch('/api/v1/payments/plans');
      const dataPlans = await resPlans.json();
      if (dataPlans.success) setPlans(dataPlans.data);

      if (token) {
        const resSub = await fetch('/api/v1/payments/my-subscription', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataSub = await resSub.json();
        if (dataSub.success) {
          setActiveSub(dataSub.data.activeMembership);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlansAndSub();
  }, [token]);

  // Handle Checkout
  const handleUpgrade = async (tier: string) => {
    if (!token) {
      setError('Please sign in or register to upgrade your membership');
      return;
    }

    setPurchasingTier(tier);
    setError(null);

    try {
      // 1. Create order
      const resOrder = await fetch('/api/v1/payments/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      });
      const dataOrder = await resOrder.json();
      if (!resOrder.ok || !dataOrder.success) {
        throw new Error(dataOrder.error?.message || 'Failed to create payment order');
      }

      const { orderId } = dataOrder.data;

      // 2. Simulate Payment gateway execution & verify signature
      const resVerify = await fetch('/api/v1/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          paymentId: `pay_${Date.now()}`,
          signature: 'mock_valid_signature',
          tier,
        }),
      });

      const dataVerify = await resVerify.json();
      if (!resVerify.ok || !dataVerify.success) {
        throw new Error(dataVerify.error?.message || 'Payment verification failed');
      }

      setSuccessMsg(dataVerify.data.message || 'Membership upgraded successfully!');
      fetchPlansAndSub();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPurchasingTier(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            👑 Mangal Royal Privilege
          </span>
          <h1 style={{ fontSize: '2.6rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '4px 0 12px 0' }}>
            Choose Your Matrimonial Journey
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
            Unlock unlimited direct messaging, verified mobile numbers, full 36 Guna Milan charts, and a dedicated relationship matchmaker.
          </p>
        </div>

        {/* Active Subscription Banner */}
        {activeSub && activeSub.tier !== 'FREE' && (
          <div
            className="card"
            style={{
              padding: '24px 32px',
              marginBottom: '40px',
              border: '2px solid var(--gold)',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(139,0,0,0.08) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <span className="badge badge-gold">Active Subscription</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                {activeSub.tier} Tier Membership
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Valid until: {new Date(activeSub.endDate).toLocaleDateString()}
              </p>
            </div>
            <Link href="/matches" className="btn btn-primary">
              Explore Matches with Privileges
            </Link>
          </div>
        )}

        {/* Success/Error Alerts */}
        {error && (
          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', marginBottom: '24px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#34d399', marginBottom: '24px', textAlign: 'center' }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {plans.map((p) => {
            const isPopular = p.tier === 'GOLD';
            const isCurrent = activeSub?.tier === p.tier;

            return (
              <div
                key={p.tier}
                className="card"
                style={{
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isPopular ? '2px solid var(--gold)' : '1px solid var(--border-color)',
                  background: isPopular ? 'rgba(212,175,55,0.05)' : 'var(--bg-card)',
                  transform: isPopular ? 'scale(1.03)' : 'none',
                  boxShadow: isPopular ? '0 15px 35px rgba(212,175,55,0.15)' : 'none',
                }}
              >
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--gold)',
                      color: '#000',
                      padding: '4px 14px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: isPopular ? 'var(--gold)' : 'var(--text-primary)' }}>
                  {p.name}
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {p.durationDays} Days Duration
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {p.price === 0 ? 'Free' : `₹${p.price.toLocaleString('en-IN')}`}
                  </span>
                  {p.price > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / plan</span>}
                </div>

                <div style={{ flex: 1, marginBottom: '28px' }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {p.features.map((f: string, idx: number) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => p.price > 0 && handleUpgrade(p.tier)}
                  disabled={isCurrent || p.price === 0 || purchasingTier === p.tier}
                  className={isPopular ? 'btn btn-gold' : 'btn btn-primary'}
                  style={{ width: '100%', padding: '12px' }}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : purchasingTier === p.tier
                    ? 'Processing...'
                    : p.price === 0
                    ? 'Included'
                    : `Upgrade to ${p.tier}`}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
