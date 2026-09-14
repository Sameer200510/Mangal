'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface TrustBreakdown {
  score: number;
  maxScore: number;
  level: string;
  breakdown: {
    email: boolean;
    phone: boolean;
    identityDoc: boolean;
    selfieLiveness: boolean;
  };
}

export default function VerifyPage() {
  const { user, token } = useAuth();

  const [documentType, setDocumentType] = useState<'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE'>('AADHAAR');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [isSelfieCaptured, setIsSelfieCaptured] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [trustData, setTrustData] = useState<{
    isVerified: boolean;
    trustScore: TrustBreakdown;
    verifications: any[];
  } | null>(null);

  // Fetch status on load
  const fetchStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/verification/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrustData(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [token]);

  // Handle document verification
  const handleVerifyDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/verification/upload-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentType,
          documentNumber,
          documentUrl: documentUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Verification failed');
      }

      setSuccess(`Success! ${data.data.documentType} (${data.data.maskedNumber}) verified.`);
      setDocumentNumber('');
      fetchStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle selfie submission
  const handleSelfieVerify = async () => {
    setError(null);
    setSuccess(null);
    setIsScanning(true);

    // Simulate AI scan delay
    setTimeout(async () => {
      try {
        const dummySelfie = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
        const res = await fetch('/api/v1/verification/selfie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selfieUrl: dummySelfie }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'Selfie verification failed');
        }

        setSelfieUrl(dummySelfie);
        setIsSelfieCaptured(true);
        setSuccess(`Biometric liveness confirmed (${data.data.confidence} match)! Royal Shield activated.`);
        fetchStatus();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsScanning(false);
      }
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            🔒 Mangal Trust & Shield
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            Identity Verification & Royal Badge
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '10px auto 0' }}>
            Verified profiles get up to <strong>7.2x more responses</strong> and exclusive access to high-intent matrimonial matches. Your sensitive data is encrypted using RBI-standard masking.
          </p>
        </div>

        {/* Trust Score Banner */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px', border: '1px solid var(--border-color)', background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(139,0,0,0.05) 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>Trust Score</h3>
                <span className="badge badge-crimson">{trustData?.trustScore?.level || 'BASIC'}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                Complete KYC and selfie liveness to achieve the 100% Royal Shield badge.
              </p>
              
              {/* Progress Bar */}
              <div style={{ height: '12px', background: 'var(--bg-secondary)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${trustData?.trustScore?.score || 25}%`,
                    background: 'linear-gradient(90deg, #D4AF37 0%, #E5C158 100%)',
                    borderRadius: '6px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.85rem', color: 'var(--gold)' }}>
                <span>Current: {trustData?.trustScore?.score || 25} / 100</span>
                <span>Goal: 100 (Royal Shield)</span>
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: trustData?.trustScore?.breakdown?.email ? '#10B981' : 'var(--text-muted)' }}>
                <span>{trustData?.trustScore?.breakdown?.email ? '✓' : '○'}</span> Email Verified (+25)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: trustData?.trustScore?.breakdown?.phone ? '#10B981' : 'var(--text-muted)' }}>
                <span>{trustData?.trustScore?.breakdown?.phone ? '✓' : '○'}</span> Mobile OTP (+25)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: trustData?.trustScore?.breakdown?.identityDoc ? '#10B981' : 'var(--text-muted)' }}>
                <span>{trustData?.trustScore?.breakdown?.identityDoc ? '✓' : '○'}</span> Govt ID (KYC) (+35)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: trustData?.trustScore?.breakdown?.selfieLiveness ? '#10B981' : 'var(--text-muted)' }}>
                <span>{trustData?.trustScore?.breakdown?.selfieLiveness ? '✓' : '○'}</span> Biometric Face (+15)
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', marginBottom: '24px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '8px', color: '#34d399', marginBottom: '24px' }}>
            {success}
          </div>
        )}

        {/* Main Grid: Step 1 ID Upload & Step 2 Biometric */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' }}>
          
          {/* Document Verification Card */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.4rem' }}>🪪</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Step 1: Government ID</h3>
            </div>

            <form onSubmit={handleVerifyDoc}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Select Document Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {(['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setDocumentType(type)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: documentType === type ? '1px solid var(--gold)' : '1px solid var(--border-color)',
                        background: documentType === type ? 'rgba(212,175,55,0.15)' : 'var(--bg-secondary)',
                        color: documentType === type ? 'var(--gold)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontWeight: documentType === type ? 'bold' : 'normal',
                      }}
                    >
                      {type === 'AADHAAR' ? 'Aadhaar (12 Digits)' : type === 'PAN' ? 'PAN Card (10 Chars)' : type === 'PASSPORT' ? 'Indian Passport' : 'Driving License'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {documentType} Number
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder={documentType === 'AADHAAR' ? '123456789012' : documentType === 'PAN' ? 'ABCDE1234F' : 'A1234567'}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                  🔒 Number is masked instantly in compliance with UIDAI & Indian IT guidelines.
                </span>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Front Photo / Document Scan
                </label>
                <div style={{ border: '2px dashed var(--border-color)', padding: '24px', textAlign: 'center', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Drop document image or use simulated file
                  </p>
                  <button
                    type="button"
                    onClick={() => setDocumentUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800')}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      color: 'var(--gold)',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    {documentUrl ? '✓ Document Loaded' : 'Attach Scan Sample'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !documentNumber}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {loading ? 'Validating Encryption...' : 'Verify Government Document'}
              </button>
            </form>
          </div>

          {/* Selfie Liveness Card */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.4rem' }}>🤳</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Step 2: Biometric Liveness</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Ensure your face is clearly visible without sunglasses or hats. Our neural net checks for real 3D depth and matches against your profile pictures.
            </p>

            <div
              style={{
                height: '240px',
                borderRadius: '12px',
                border: '2px solid var(--border-color)',
                background: '#0a0a0c',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '20px',
              }}
            >
              {selfieUrl ? (
                <img src={selfieUrl} alt="Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <div
                    style={{
                      width: '120px',
                      height: '140px',
                      borderRadius: '50%',
                      border: isScanning ? '3px dashed var(--gold)' : '2px dashed var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: isScanning ? 'spin 3s linear infinite' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>👤</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                    {isScanning ? 'Analyzing neural depth & liveness...' : 'Face Boundary Guide'}
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleSelfieVerify}
              disabled={isScanning}
              className="btn btn-gold"
              style={{ width: '100%', padding: '12px' }}
            >
              {isScanning ? 'Processing Biometrics...' : isSelfieCaptured ? '✓ Retake Selfie Verification' : 'Capture Live Biometric Selfie'}
            </button>
          </div>

        </div>

        {/* Existing Verifications Table */}
        {trustData && trustData.verifications && trustData.verifications.length > 0 && (
          <div className="card" style={{ marginTop: '32px', padding: '24px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
              Verified Credentials on Record
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px' }}>Credential</th>
                    <th style={{ padding: '10px' }}>Masked Reference</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Audit Note</th>
                  </tr>
                </thead>
                <tbody>
                  {trustData.verifications.map((v) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', color: 'var(--text-primary)' }}>{v.documentType}</td>
                      <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: 'var(--gold)' }}>{v.documentNumberMasked}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className={`badge ${v.status === 'VERIFIED' ? 'badge-gold' : 'badge-crimson'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{v.reviewerNotes || 'System Verified'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
