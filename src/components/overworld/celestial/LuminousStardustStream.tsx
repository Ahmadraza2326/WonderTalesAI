import React from 'react'

export interface LuminousStardustStreamProps {
  className?: string
  style?: React.CSSProperties
}

export const LuminousStardustStream: React.FC<LuminousStardustStreamProps> = ({
  className = '',
  style,
}) => {
  return (
    <div
      className={`orbis-luminous-stream-canvas ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'visible',
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 1000"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ overflow: 'visible', width: '100%', height: '100%' }}
      >
        <defs>
          {/* North Star Stardust Comet Tail Gradient (Gold) */}
          <linearGradient id="northStarStreamGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#fde047" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </linearGradient>

          {/* Citadel to Academy Stream Gradient (Cyan) */}
          <linearGradient id="streamToAcademyGrad" x1="50%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
          </linearGradient>

          {/* Citadel to Stories Stream Gradient (Amber/Gold) */}
          <linearGradient id="streamToStoriesGrad" x1="50%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.4" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="streamGlowFilterWide" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. NORTH STAR SWEEPING STREAM (From top-right down to Citadel) */}
        <path
          d="M 780 130 C 720 190, 640 230, 560 270"
          stroke="url(#northStarStreamGrad)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
          filter="url(#streamGlowFilterWide)"
        />
        <path
          d="M 780 130 C 720 190, 640 230, 560 270"
          stroke="url(#northStarStreamGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 780 130 C 720 190, 640 230, 560 270"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="8 14"
          fill="none"
          opacity="0.9"
          style={{ animation: 'orbis-stardust-dash 6s linear infinite' }}
        />

        {/* 2. CITADEL TO ACADEMY STREAM (Left) */}
        <path
          d="M 480 380 C 400 440, 320 480, 240 540"
          stroke="url(#streamToAcademyGrad)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
          filter="url(#streamGlowFilterWide)"
        />
        <path
          d="M 480 380 C 400 440, 320 480, 240 540"
          stroke="url(#streamToAcademyGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 480 380 C 400 440, 320 480, 240 540"
          stroke="#e0f2fe"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="8 12"
          fill="none"
          opacity="0.95"
          style={{ animation: 'orbis-stardust-dash 5s linear infinite' }}
        />

        {/* 3. CITADEL TO STORIES STREAM (Right) */}
        <path
          d="M 520 380 C 600 440, 680 480, 760 540"
          stroke="url(#streamToStoriesGrad)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
          filter="url(#streamGlowFilterWide)"
        />
        <path
          d="M 520 380 C 600 440, 680 480, 760 540"
          stroke="url(#streamToStoriesGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 520 380 C 600 440, 680 480, 760 540"
          stroke="#fef3c7"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="8 12"
          fill="none"
          opacity="0.95"
          style={{ animation: 'orbis-stardust-dash 5s linear infinite' }}
        />

        {/* 4. CITADEL TO PLAYROOM VERTICAL DASHED STREAM (Center-Down) */}
        <path
          d="M 500 390 L 500 660"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 14"
          fill="none"
          opacity="0.8"
          style={{ animation: 'orbis-stardust-dash 4s linear infinite' }}
        />

        {/* Shimmering Stardust Particle Orbs along paths */}
        <circle cx="700" cy="180" r="4.5" fill="#ffffff" opacity="0.9" />
        <circle cx="620" cy="230" r="3.5" fill="#fde047" opacity="0.85" />
        <circle cx="360" cy="460" r="4" fill="#38bdf8" opacity="0.9" />
        <circle cx="290" cy="500" r="3" fill="#2dd4bf" opacity="0.85" />
        <circle cx="640" cy="460" r="4" fill="#fbbf24" opacity="0.9" />
        <circle cx="710" cy="500" r="3" fill="#f59e0b" opacity="0.85" />
        <circle cx="500" cy="480" r="3.5" fill="#ffffff" opacity="0.9" />
        <circle cx="500" cy="580" r="3.5" fill="#f472b6" opacity="0.9" />
      </svg>
    </div>
  )
}
