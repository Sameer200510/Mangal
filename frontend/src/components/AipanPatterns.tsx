import React from 'react';

/**
 * Authentic Kumaoni Aipan (ऐपण) Art & Garhwali Himalayan SVG Components
 * Crafted with traditional Geru (गेरू) terracotta and Biswar (बिसवार) rice-flour motifs.
 */

// 1. Traditional Kumaoni Marriage Aipan Chauki (Lagna / Dhuli Arghya Chauki)
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
            fillOpacity="0.2"
            stroke="#FAF8F2"
            strokeWidth="1.8"
          />
          {/* Inner petal vein and sacred bindi */}
          <line x1="100" y1="36" x2="100" y2="64" stroke="#FAF8F2" strokeWidth="1.2" />
          <circle cx="100" cy="32" r="2" fill="#FAF8F2" />
        </g>
      ))}

      {/* Concentric Aipan Star / Ashta-Dala Chakra */}
      <circle cx="100" cy="100" r="46" fill="#651816" stroke="#FAF8F2" strokeWidth="2" />
      <polygon
        points="100,58 112,88 142,100 112,112 100,142 88,112 58,100 88,88"
        stroke="#FAF8F2"
        strokeWidth="1.8"
        fill="#FAF8F2"
        fillOpacity="0.15"
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
      <circle cx="100" cy="12" r="3" fill="#FAF8F2" />
      <circle cx="100" cy="188" r="3" fill="#FAF8F2" />
      <circle cx="12" cy="100" r="3" fill="#FAF8F2" />
      <circle cx="188" cy="100" r="3" fill="#FAF8F2" />
    </svg>
  );
}

// 2. Traditional Kumaoni Aipan Bel (Creeper Vine Border Strip)
export function AipanBorderStrip({ height = 24, className = '' }: { height?: number; className?: string }) {
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 800 30"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="800" height="30" fill="#7A1F1D" />
      <line x1="0" y1="4" x2="800" y2="4" stroke="#FAF8F2" strokeWidth="1.5" />
      <line x1="0" y1="26" x2="800" y2="26" stroke="#FAF8F2" strokeWidth="1.5" />

      {/* Repeating Chevron & Creeper Wave with Sacred Dots */}
      <path
        d="M 0,15 Q 15,6 30,15 T 60,15 T 90,15 T 120,15 T 150,15 T 180,15 T 210,15 T 240,15 T 270,15 T 300,15 T 330,15 T 360,15 T 390,15 T 420,15 T 450,15 T 480,15 T 510,15 T 540,15 T 570,15 T 600,15 T 630,15 T 660,15 T 690,15 T 720,15 T 750,15 T 780,15 T 810,15"
        stroke="#FAF8F2"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 0,15 Q 15,24 30,15 T 60,15 T 90,15 T 120,15 T 150,15 T 180,15 T 210,15 T 240,15 T 270,15 T 300,15 T 330,15 T 360,15 T 390,15 T 420,15 T 450,15 T 480,15 T 510,15 T 540,15 T 570,15 T 600,15 T 630,15 T 660,15 T 690,15 T 720,15 T 750,15 T 780,15 T 810,15"
        stroke="#E5B842"
        strokeWidth="1"
        fill="none"
      />
      {/* Decorative Bindis */}
      {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345, 375, 405, 435, 465, 495, 525, 555, 585, 615, 645, 675, 705, 735, 765, 795].map(
        (x, i) => (
          <g key={i}>
            <circle cx={x} cy={10} r="1.5" fill="#FAF8F2" />
            <circle cx={x} cy={20} r="1.5" fill="#FAF8F2" />
          </g>
        )
      )}
    </svg>
  );
}

// 3. Garhwali Tehri Nath Royal Matrimonial Emblem (पारंपरिक टिहरी नथ)
export function TehriNathEmblem({ size = 52, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Golden Circular Ring */}
      <circle cx="50" cy="50" r="42" stroke="#E5B842" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" />

      {/* Intricate Filigree & Peacock Motif at outer edge */}
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

      {/* Central Auspicious Diya / Kalash Silhouette */}
      <path
        d="M 50,30 C 53,38 56,43 56,48 C 56,52 53,55 50,55 C 47,55 44,52 44,48 C 44,43 47,38 50,30 Z"
        fill="#C01E35"
      />
      <circle cx="50" cy="46" r="2" fill="#FDE047" />
      {/* Sacred Nose Bar & Chain Pin */}
      <line x1="50" y1="8" x2="86" y2="4" stroke="#E5B842" strokeWidth="1.5" />
      <circle cx="88" cy="4" r="2.5" fill="#E5B842" />
    </svg>
  );
}

// 4. Garhwal & Kumaon Himalayan Silhouette (Nanda Devi & Trishul Peaks)
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
        {/* Distant Nanda Devi & Trishul Ridge */}
        <polygon
          points="0,220 80,140 160,180 280,90 380,160 520,60 620,130 760,40 890,120 1020,70 1160,150 1280,80 1380,130 1440,220"
          fill="url(#himalayaGlow)"
        />
        {/* Foreground Alpine Deodar Ridge */}
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

// 5. Traditional Aipan Corner Bracket for Cards & Panels
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
      width="36"
      height="36"
      viewBox="0 0 40 40"
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
        opacity: 0.85,
      }}
    >
      <path d="M 2,38 L 2,6 Q 2,2 6,2 L 38,2" stroke="#FAF8F2" strokeWidth="1.8" fill="none" />
      <path d="M 6,34 L 6,10 Q 6,6 10,6 L 34,6" stroke="#E5B842" strokeWidth="1" fill="none" strokeDasharray="2 2" />
      <circle cx="10" cy="10" r="2.5" fill="#FAF8F2" />
      <circle cx="18" cy="10" r="1.5" fill="#FAF8F2" />
      <circle cx="10" cy="18" r="1.5" fill="#FAF8F2" />
    </svg>
  );
}
