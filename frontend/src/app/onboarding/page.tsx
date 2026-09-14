'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  Gender,
  MaritalStatus,
  Religion,
  ManglikStatus,
  FamilyType,
  DietPreference,
} from '../../common';

export default function OnboardingPage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [completenessScore, setCompletenessScore] = useState(20);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [basic, setBasic] = useState({
    gender: Gender.FEMALE,
    dateOfBirth: '1998-05-15',
    heightCm: 165,
    weightKg: 58,
    maritalStatus: MaritalStatus.NEVER_MARRIED,
    motherTongue: 'Hindi',
    bio: '',
  });

  const [religious, setReligious] = useState({
    religion: Religion.HINDU,
    caste: 'Brahmin',
    subCaste: '',
    gotra: 'Kashyap',
    manglikStatus: ManglikStatus.NON_MANGLIK,
    birthPlace: 'New Delhi',
    birthTime: '10:30 AM',
  });

  const [career, setCareer] = useState({
    highestEducation: 'B.Tech / M.Tech',
    collegeName: 'Delhi University',
    occupation: 'Software Engineer',
    companyName: 'Tech Corp',
    annualIncomeRange: '₹15 - 25 Lakhs',
  });

  const [locationFamily, setLocationFamily] = useState({
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    familyType: FamilyType.NUCLEAR,
    fatherOccupation: 'Government Service',
    motherOccupation: 'Homemaker',
    brothersCount: 1,
    sistersCount: 0,
    familyIncome: '₹20 - 30 Lakhs',
  });

  const [lifestyle, setLifestyle] = useState({
    diet: DietPreference.VEGETARIAN,
    smoking: false,
    drinking: false,
    hasDisability: false,
    disabilityDetails: '',
    languagesKnown: ['Hindi', 'English'],
    hobbies: ['Music', 'Travel', 'Cooking'],
  });

  const [partnerPref, setPartnerPref] = useState({
    minAge: 24,
    maxAge: 32,
    minHeightCm: 165,
    maxHeightCm: 188,
    minIncome: '₹15 Lakhs',
    manglikPreference: ManglikStatus.DONT_KNOW,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated]);

  const handleNext = async () => {
    setError(null);
    setSaving(true);

    try {
      if (currentStep === 1) {
        const res = await fetch('/api/v1/profile/basic', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(basic),
        });
        const d = await res.json();
        if (d.data?.profile?.completenessScore) {
          setCompletenessScore(d.data.profile.completenessScore);
        }
      } else if (currentStep === 2) {
        await fetch('/api/v1/profile/religious', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(religious),
        });
      } else if (currentStep === 3) {
        await fetch('/api/v1/profile/education', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(career),
        });
      } else if (currentStep === 4) {
        await fetch('/api/v1/profile/location', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(locationFamily),
        });
      } else if (currentStep === 5) {
        await fetch('/api/v1/profile/lifestyle', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(lifestyle),
        });
      } else if (currentStep === 6) {
        await fetch('/api/v1/profile/partner-preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...partnerPref,
            maritalStatus: [],
            religions: [religious.religion],
            castes: [],
            preferredCities: [locationFamily.city],
          }),
        });
        router.push('/profile');
        return;
      }

      setCurrentStep((s) => Math.min(s + 1, 6));
    } catch (err: any) {
      setError(err.message || 'Error saving profile step');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    'Basic & Physical',
    'Religion & Astrological',
    'Education & Career',
    'Location & Family',
    'Lifestyle & Habits',
    'Partner Preferences',
  ];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '760px' }}>
      {/* Progress & Completeness */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ color: 'var(--text-gold)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Step {currentStep} of {steps.length}
            </span>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>{steps[currentStep - 1]}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
              ⚡ Profile Completeness: {Math.max(completenessScore, currentStep * 16)}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
              height: '100%',
              background: 'var(--gold-gradient)',
              transition: 'width 0.4s ease-in-out',
            }}
          />
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Step Form Container */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        {/* STEP 1: Basic & Physical */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Gender
                </label>
                <select
                  value={basic.gender}
                  onChange={(e) => setBasic({ ...basic, gender: e.target.value as Gender })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                >
                  <option value={Gender.FEMALE}>Female (Bride)</option>
                  <option value={Gender.MALE}>Male (Groom)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={basic.dateOfBirth}
                  onChange={(e) => setBasic({ ...basic, dateOfBirth: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={basic.heightCm}
                  onChange={(e) => setBasic({ ...basic, heightCm: parseInt(e.target.value) || 165 })}
                  placeholder="165"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Marital Status
                </label>
                <select
                  value={basic.maritalStatus}
                  onChange={(e) => setBasic({ ...basic, maritalStatus: e.target.value as MaritalStatus })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                >
                  <option value={MaritalStatus.NEVER_MARRIED}>Never Married</option>
                  <option value={MaritalStatus.DIVORCED}>Divorced</option>
                  <option value={MaritalStatus.WIDOWED}>Widowed</option>
                  <option value={MaritalStatus.AWAITING_DIVORCE}>Awaiting Divorce</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                About Yourself (Bio)
              </label>
              <textarea
                rows={3}
                value={basic.bio}
                onChange={(e) => setBasic({ ...basic, bio: e.target.value })}
                placeholder="Share a brief overview of your background, values, passions, and family traditions..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF', resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Religion & Astrological */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Religion
                </label>
                <select
                  value={religious.religion}
                  onChange={(e) => setReligious({ ...religious, religion: e.target.value as Religion })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                >
                  <option value={Religion.HINDU}>Hindu</option>
                  <option value={Religion.SIKH}>Sikh</option>
                  <option value={Religion.JAIN}>Jain</option>
                  <option value={Religion.BUDDHIST}>Buddhist</option>
                  <option value={Religion.CHRISTIAN}>Christian</option>
                  <option value={Religion.MUSLIM}>Muslim</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Caste
                </label>
                <input
                  type="text"
                  value={religious.caste}
                  onChange={(e) => setReligious({ ...religious, caste: e.target.value })}
                  placeholder="e.g. Brahmin, Rajput, Kayastha"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Gotra
                </label>
                <input
                  type="text"
                  value={religious.gotra}
                  onChange={(e) => setReligious({ ...religious, gotra: e.target.value })}
                  placeholder="e.g. Kashyap, Bharadwaj"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Manglik Status
                </label>
                <select
                  value={religious.manglikStatus}
                  onChange={(e) => setReligious({ ...religious, manglikStatus: e.target.value as ManglikStatus })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                >
                  <option value={ManglikStatus.NON_MANGLIK}>Non-Manglik</option>
                  <option value={ManglikStatus.MANGLIK}>Manglik</option>
                  <option value={ManglikStatus.ANSHIK_MANGLIK}>Anshik / Partial Manglik</option>
                  <option value={ManglikStatus.DONT_KNOW}>Don&apos;t Know</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Education & Career */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                Highest Degree
              </label>
              <input
                type="text"
                value={career.highestEducation}
                onChange={(e) => setCareer({ ...career, highestEducation: e.target.value })}
                placeholder="e.g. B.Tech, M.S., MBA, MBBS, CA"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Occupation
                </label>
                <input
                  type="text"
                  value={career.occupation}
                  onChange={(e) => setCareer({ ...career, occupation: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Annual Income Range
                </label>
                <input
                  type="text"
                  value={career.annualIncomeRange}
                  onChange={(e) => setCareer({ ...career, annualIncomeRange: e.target.value })}
                  placeholder="e.g. ₹25 - 35 Lakhs"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Location & Family */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  City
                </label>
                <input
                  type="text"
                  value={locationFamily.city}
                  onChange={(e) => setLocationFamily({ ...locationFamily, city: e.target.value })}
                  placeholder="e.g. Bangalore"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  State
                </label>
                <input
                  type="text"
                  value={locationFamily.state}
                  onChange={(e) => setLocationFamily({ ...locationFamily, state: e.target.value })}
                  placeholder="e.g. Karnataka"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                Family Type
              </label>
              <select
                value={locationFamily.familyType}
                onChange={(e) => setLocationFamily({ ...locationFamily, familyType: e.target.value as FamilyType })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
              >
                <option value={FamilyType.NUCLEAR}>Nuclear Family</option>
                <option value={FamilyType.JOINT}>Joint Family</option>
                <option value={FamilyType.EXTENDED}>Extended Family</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: Lifestyle & Habits */}
        {currentStep === 5 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                Diet Preference
              </label>
              <select
                value={lifestyle.diet}
                onChange={(e) => setLifestyle({ ...lifestyle, diet: e.target.value as DietPreference })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
              >
                <option value={DietPreference.VEGETARIAN}>Vegetarian</option>
                <option value={DietPreference.NON_VEGETARIAN}>Non-Vegetarian</option>
                <option value={DietPreference.EGGETARIAN}>Eggetarian</option>
                <option value={DietPreference.JAIN}>Jain</option>
                <option value={DietPreference.VEGAN}>Vegan</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={lifestyle.smoking}
                  onChange={(e) => setLifestyle({ ...lifestyle, smoking: e.target.checked })}
                  style={{ accentColor: 'var(--primary-crimson)' }}
                />
                Smoking
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={lifestyle.drinking}
                  onChange={(e) => setLifestyle({ ...lifestyle, drinking: e.target.checked })}
                  style={{ accentColor: 'var(--primary-crimson)' }}
                />
                Drinking
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Partner Preferences */}
        {currentStep === 6 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Min Desired Age
                </label>
                <input
                  type="number"
                  value={partnerPref.minAge}
                  onChange={(e) => setPartnerPref({ ...partnerPref, minAge: parseInt(e.target.value) || 24 })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                  Max Desired Age
                </label>
                <input
                  type="number"
                  value={partnerPref.maxAge}
                  onChange={(e) => setPartnerPref({ ...partnerPref, maxAge: parseInt(e.target.value) || 32 })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(8, 12, 21, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#FFF' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.5rem' }}
            >
              ← Previous Step
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="btn btn-gold"
            style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
          >
            {saving ? 'Saving...' : currentStep === 6 ? 'Complete & View Profile 🎉' : 'Save & Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
