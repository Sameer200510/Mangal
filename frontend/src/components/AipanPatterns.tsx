'use client';

import React from 'react';

/**
 * Authentic Kumaoni Aipan (ऐपण) Art & Garhwali Himalayan Components
 * Traditional Geru (गेरू) terracotta base with Biswar (बिसवार) rice-flour sacred motifs.
 */

// 1. Seamless Repeating Aipan Bel (Creeper Vine) Horizontal Border Strip
export function AipanBorder({
  height = 24,
  className = '',
  id = 'aipan-bel',
}: {
  height?: number;
  className?: string;
  id?: string;
}) {
  const patternId = `pat-${id}-${height}`;
  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        overflow: 'hidden',
        display: 'block',
        lineHeight: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <svg
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'block' }}
      >
        <defs>
          <pattern id={patternId} width="64" height={height} patternUnits="userSpaceOnUse">
            {/* Geru Terracotta Clay Base */}
            <rect width="64" height={height} fill="#7A1F1D" />

            {/* Outer and Inner Parallel Frame Lines in Biswar White */}
            <line x1="0" y1="2" x2="64" y2="2" stroke="#FAF8F2" strokeWidth="1.5" />
            <line x1="0" y1="4.5" x2="64" y2="4.5" stroke="#FAF8F2" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="0" y1={height - 4.5} x2="64" y2={height - 4.5} stroke="#FAF8F2" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="0" y1={height - 2} x2="64" y2={height - 2} stroke="#FAF8F2" strokeWidth="1.5" />

            {/* Primary Aipan Wavy Vine (लहरदार बेल) */}
            <path
              d={`M 0,${height / 2} C 16,${height * 0.2} 16,${height * 0.8} 32,${height / 2} C 48,${height * 0.2} 48,${height * 0.8} 64,${height / 2}`}
              fill="none"
              stroke="#FAF8F2"
              strokeWidth="2"
            />

            {/* Secondary Golden Rhythm Line */}
            <path
              d={`M 0,${height / 2} C 16,${height * 0.8} 16,${height * 0.2} 32,${height / 2} C 48,${height * 0.8} 48,${height * 0.2} 64,${height / 2}`}
              fill="none"
              stroke="#E5B842"
              strokeWidth="1.2"
            />

            {/* Sacred 3-Dot Clusters (त्रिकोण बिंदु) on Upper Crests */}
            <circle cx="16" cy={height * 0.24} r="1.8" fill="#FAF8F2" />
            <circle cx="12" cy={height * 0.35} r="1.3" fill="#FAF8F2" />
            <circle cx="20" cy={height * 0.35} r="1.3" fill="#FAF8F2" />

            {/* Sacred 3-Dot Clusters on Lower Valleys */}
            <circle cx="48" cy={height * 0.76} r="1.8" fill="#FAF8F2" />
            <circle cx="44" cy={height * 0.65} r="1.3" fill="#FAF8F2" />
            <circle cx="52" cy={height * 0.65} r="1.3" fill="#FAF8F2" />

            {/* Center Node Bindis */}
            <circle cx="32" cy={height / 2} r="2.2" fill="#FAF8F2" />
            <circle cx="0" cy={height / 2} r="2.2" fill="#FAF8F2" />
            <circle cx="64" cy={height / 2} r="2.2" fill="#FAF8F2" />
          </pattern>
        </defs>
        <rect width="100%" height={height} fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

// Alias for backward compatibility
export const AipanBorderStrip = AipanBorder;

// 2. Decorative Section Divider with Center Aipan Lotus Chauki
export function AipanDivider({ className = '', id = 'div' }: { className?: string; id?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: '2.5rem 0',
        position: 'relative',
      }}
    >
      <div style={{ flex: 1, height: '20px' }}>
        <AipanBorder height={20} id={`${id}-left`} />
      </div>
      <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AipanChauki size={48} />
      </div>
      <div style={{ flex: 1, height: '20px' }}>
        <AipanBorder height={20} id={`${id}-right`} />
      </div>
    </div>
  );
}

// 3. Aipan Framed Card Container (Wraps any card in authentic Geru + Biswar Aipan borders)
export function AipanBox({
  children,
  className = '',
  style = {},
  borderHeight = 22,
  showCorners = true,
  id = 'box',
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  borderHeight?: number;
  showCorners?: boolean;
  id?: string;
}) {
  return (
    <div
      className={`aipan-box ${className}`}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(122, 31, 29, 0.32) 0%, rgba(14, 18, 26, 0.96) 50%, rgba(74, 16, 14, 0.4) 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1.5px solid rgba(250, 248, 242, 0.25)',
        boxShadow: '0 16px 45px rgba(0, 0, 0, 0.75), 0 0 30px rgba(122, 31, 29, 0.35)',
        ...style,
      }}
    >
      {/* Top Authentic Aipan Border Strip */}
      <AipanBorder height={borderHeight} id={`${id}-top`} />

      {/* Box Contents with optional Aipan Corners */}
      <div style={{ padding: '24px 28px', position: 'relative' }}>
        {showCorners && (
          <>
            <AipanCorner position="top-left" />
            <AipanCorner position="top-right" />
            <AipanCorner position="bottom-left" />
            <AipanCorner position="bottom-right" />
          </>
        )}
        {children}
      </div>

      {/* Bottom Authentic Aipan Border Strip */}
      <AipanBorder height={borderHeight} id={`${id}-bottom`} />
    </div>
  );
}

// Alias for AipanBox
export const AipanFrame = AipanBox;

// 4. Traditional Kumaoni Marriage Aipan Chauki (Lagna / Dhuli Arghya Chauki)
export function AipanChauki({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {/* Geru Terracotta Base Circle */}
      <circle cx="100" cy="100" r="96" fill="#7A1F1D" stroke="#FAF8F2" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="88" stroke="#FAF8F2" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="80" stroke="#FAF8F2" strokeWidth="2" />

      {/* Traditional Aipan Petals / Kamaldal (12-petaled lotus) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          {/* Lotus petal outline in Biswar white */}
          <path
            d="M100 24 C92 45 88 60 100 76 C112 60 108 45 100 24 Z"
            fill="#FAF8F2"
            fillOpacity="0.25"
            stroke="#FAF8F2"
            strokeWidth="1.8"
          />
          {/* Inner petal vein and sacred bindi */}
          <line x1="100" y1="36" x2="100" y2="64" stroke="#FAF8F2" strokeWidth="1.2" />
          <circle cx="100" cy="32" r="2.2" fill="#FAF8F2" />
        </g>
      ))}

      {/* Concentric Aipan Star / Ashta-Dala Chakra */}
      <circle cx="100" cy="100" r="46" fill="#581412" stroke="#FAF8F2" strokeWidth="2" />
      <polygon
        points="100,58 112,88 142,100 112,112 100,142 88,112 58,100 88,88"
        stroke="#FAF8F2"
        strokeWidth="1.8"
        fill="#FAF8F2"
        fillOpacity="0.2"
      />
      <polygon
        points="100,64 125,75 136,100 125,125 100,136 75,125 64,100 75,75"
        stroke="#E5B842"
        strokeWidth="1.2"
        fill="none"
      />

      {/* Central Symbol: Auspicious Goddess Lakshmi Charan Paduka (Footprints) */}
      <g transform="translate(86, 86)">
        {/* Left Foot */}
        <ellipse cx="9" cy="16" rx="4" ry="7" fill="#FAF8F2" />
        <circle cx="5" cy="6" r="1.5" fill="#FAF8F2" />
        <circle cx="8" cy="4" r="1.5" fill="#FAF8F2" />
        <circle cx="11" cy="5" r="1.5" fill="#FAF8F2" />
        <circle cx="14" cy="7" r="1.2" fill="#FAF8F2" />
        {/* Right Foot */}
        <ellipse cx="21" cy="16" rx="4" ry="7" fill="#FAF8F2" />
        <circle cx="17" cy="7" r="1.2" fill="#FAF8F2" />
        <circle cx="20" cy="5" r="1.5" fill="#FAF8F2" />
        <circle cx="23" cy="4" r="1.5" fill="#FAF8F2" />
        <circle cx="26" cy="6" r="1.5" fill="#FAF8F2" />
      </g>

      {/* Auspicious Cardinal Dots (Bindi) */}
      <circle cx="100" cy="12" r="3.2" fill="#FAF8F2" />
      <circle cx="100" cy="188" r="3.2" fill="#FAF8F2" />
      <circle cx="12" cy="100" r="3.2" fill="#FAF8F2" />
      <circle cx="188" cy="100" r="3.2" fill="#FAF8F2" />
    </svg>
  );
}

// 5. Garhwali Tehri Nath Royal Matrimonial Emblem
export function TehriNathEmblem({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="42" stroke="#E5B842" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" />

      {/* Intricate Filigree & Peacock Arc */}
      <path
        d="M 50,8 C 65,8 82,20 88,36 C 94,52 86,72 74,84 C 62,94 40,94 26,84 C 14,72 6,52 12,36"
        stroke="#D4AF37"
        strokeWidth="1.8"
        strokeDasharray="4 2"
        fill="none"
      />

      {/* Traditional Pearl & Ruby Fringe Droplets */}
      {[20, 35, 50, 65, 80].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 50 + 44 * Math.cos(rad);
        const y = 50 + 44 * Math.sin(rad);
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + 5 * Math.cos(rad)} y2={y + 5 * Math.sin(rad)} stroke="#E5B842" strokeWidth="1.5" />
            <circle cx={x + 6 * Math.cos(rad)} cy={y + 6 * Math.sin(rad)} r="2.5" fill="#FFFFFF" stroke="#E5B842" strokeWidth="0.8" />
            <circle cx={x + 6 * Math.cos(rad)} cy={y + 6 * Math.sin(rad)} r="1" fill="#C01E35" />
          </g>
        );
      })}

      {/* Central Diya Flame */}
      <path
        d="M 50,30 C 53,38 56,43 56,48 C 56,52 53,55 50,55 C 47,55 44,52 44,48 C 44,43 47,38 50,30 Z"
        fill="#C01E35"
      />
      <circle cx="50" cy="46" r="2" fill="#FDE047" />
      <line x1="50" y1="8" x2="86" y2="4" stroke="#E5B842" strokeWidth="1.5" />
      <circle cx="88" cy="4" r="2.5" fill="#E5B842" />
    </svg>
  );
}

// 6. Himalayan Ridge Silhouettes
export function HimalayanSilhouettes({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '180px',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.18,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="0,220 80,140 160,180 280,90 380,160 520,60 620,130 760,40 890,120 1020,70 1160,150 1280,80 1380,130 1440,220"
          fill="url(#himalayaGlow)"
        />
        <polygon
          points="0,220 120,160 220,190 340,130 460,180 600,110 720,160 840,100 980,170 1100,120 1240,180 1360,140 1440,220"
          fill="#5C1410"
          fillOpacity="0.45"
        />
        <defs>
          <linearGradient id="himalayaGlow" x1="720" y1="40" x2="720" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FAF8F2" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#E5B842" stopOpacity="0.4" />
            <stop offset="1" stopColor="#7A1F1D" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// 7. Traditional Aipan Corner Bracket for Cards & Panels
export function AipanCorner({ position = 'top-left' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const transform =
    position === 'top-right'
      ? 'rotate(90deg)'
      : position === 'bottom-right'
      ? 'rotate(180deg)'
      : position === 'bottom-left'
      ? 'rotate(270deg)'
      : 'none';

  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: position.includes('top') ? '6px' : undefined,
        bottom: position.includes('bottom') ? '6px' : undefined,
        left: position.includes('left') ? '6px' : undefined,
        right: position.includes('right') ? '6px' : undefined,
        transform,
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.9,
      }}
    >
      <path d="M 2,42 L 2,8 Q 2,2 8,2 L 42,2" stroke="#FAF8F2" strokeWidth="2.2" fill="none" />
      <path d="M 7,37 L 7,12 Q 7,7 12,7 L 37,7" stroke="#E5B842" strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
      <circle cx="12" cy="12" r="3" fill="#FAF8F2" />
      <circle cx="22" cy="12" r="1.8" fill="#FAF8F2" />
      <circle cx="12" cy="22" r="1.8" fill="#FAF8F2" />
    </svg>
  );
}
