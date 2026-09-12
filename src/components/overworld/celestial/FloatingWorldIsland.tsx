import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

export type CelestialWorldType = 'academy' | 'stories' | 'playroom'

export interface FloatingWorldIslandProps {
  world: CelestialWorldType
  badgeText?: string
  className?: string
  style?: React.CSSProperties
}

interface WorldThemeConfig {
  title: string
  subtitle: string
  route: string
  assetPath: string
  primaryColor: string
  secondaryColor: string
  glowGradient: string
  badgeBorder: string
  shadowColor: string
  altText: string
}

const WORLD_CONFIGS: Record<CelestialWorldType, WorldThemeConfig> = {
  academy: {
    title: 'ACADEMY',
    subtitle: '8 Realms • 348 Skills',
    route: '/academy',
    assetPath: '/assets/overworld/academy_island.png',
    primaryColor: '#38bdf8',
    secondaryColor: '#2dd4bf',
    glowGradient: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(45, 212, 191, 0.2) 50%, transparent 75%)',
    badgeBorder: 'rgba(56, 189, 248, 0.6)',
    shadowColor: 'rgba(56, 189, 248, 0.7)',
    altText: 'Academy Floating Island: Grand Library, Arcane Glowing Portal, and Cyan Crystal Spires',
  },
  stories: {
    title: 'STORIES',
    subtitle: 'Story Studio & Illustrated Reader',
    route: '/stories',
    assetPath: '/assets/overworld/stories_island.png',
    primaryColor: '#ffb84d',
    secondaryColor: '#f43f5e',
    glowGradient: 'radial-gradient(circle, rgba(255, 184, 77, 0.45) 0%, rgba(244, 63, 94, 0.2) 50%, transparent 75%)',
    badgeBorder: 'rgba(255, 184, 77, 0.6)',
    shadowColor: 'rgba(255, 184, 77, 0.7)',
    altText: 'Stories Floating Island: Cozy Twilight Campfire, Storybooks, Tree Canopy and Easel',
  },
  playroom: {
    title: 'PLAYROOM',
    subtitle: '10 Simulation & Physics Labs',
    route: '/playroom',
    assetPath: '/assets/overworld/playroom_island.png',
    primaryColor: '#f472b6',
    secondaryColor: '#c084fc',
    glowGradient: 'radial-gradient(circle, rgba(244, 114, 182, 0.45) 0%, rgba(192, 132, 252, 0.2) 50%, transparent 75%)',
    badgeBorder: 'rgba(244, 114, 182, 0.6)',
    shadowColor: 'rgba(244, 114, 182, 0.7)',
    altText: 'Playroom Floating Island: Pastel Cloud Playground, Wooden Swing, Slide and Balloons',
  },
}

export const FloatingWorldIsland: React.FC<FloatingWorldIslandProps> = ({
  world,
  className = '',
  style,
}) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const config = WORLD_CONFIGS[world]

  const handleClick = () => {
    HapticsService.medium()
    sfxService.play('card_flip')
    navigate(config.route)
  }

  return (
    <div
      className={`orbis-world-island-container orbis-world-${world} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Enter ${config.title}: ${config.subtitle}`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          outline: 'none',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isHovered ? 'scale(1.06) translateY(-6px)' : 'scale(1.0)',
        }}
      >
        {/* Island Artwork Container with Ambient Sector Glow */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(180px, 22vw, 260px)',
            height: 'clamp(150px, 18vw, 210px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Volumetric Radial Aura Glow */}
          <div
            style={{
              position: 'absolute',
              inset: '10%',
              background: config.glowGradient,
              borderRadius: '50%',
              filter: 'blur(24px)',
              opacity: isHovered ? 1 : 0.65,
              transform: isHovered ? 'scale(1.15)' : 'scale(1.0)',
              transition: 'all 0.35s ease',
              pointerEvents: 'none',
            }}
          />

          {/* Seamless High-Resolution Island Artwork Image */}
          <img
            src={config.assetPath}
            alt={config.altText}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 2,
              mixBlendMode: 'screen',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 88%)',
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 88%)',
              filter: isHovered
                ? `drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 16px ${config.shadowColor})`
                : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6))',
              transition: 'filter 0.3s ease',
            }}
          />
        </div>

        {/* Luminous Stadium Pill Badge */}
        <div
          style={{
            marginTop: '6px',
            background: 'rgba(10, 14, 40, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1.5px solid ${config.badgeBorder}`,
            borderRadius: '9999px',
            padding: '5px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.6), 0 0 16px ${config.shadowColor}40`,
            transition: 'all 0.25s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1.0)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: config.primaryColor,
              boxShadow: `0 0 8px ${config.primaryColor}`,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
              fontSize: '14px',
              fontWeight: 900,
              color: config.primaryColor,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textShadow: `0 0 10px ${config.primaryColor}80`,
            }}
          >
            {config.title}
          </span>
        </div>
      </button>
    </div>
  )
}
