import React, { useState } from 'react'
import { NorthStarApex } from './NorthStarApex'
import { CentralOrbisCitadel } from './CentralOrbisCitadel'
import { FloatingWorldIsland } from './FloatingWorldIsland'
import { LuminousStardustStream } from './LuminousStardustStream'
import { DailyQuestModal } from './DailyQuestModal'
import { ParticleField } from '../../ui/design/ParticleField'
import { AnimatedIcon } from '../../ui/design/AnimatedIcon'
import type { ChildAdventureProgress } from '../../../services/progressionService'

export interface OverworldCelestialMapProps {
  adventureProgress?: ChildAdventureProgress
  className?: string
}

export const OverworldCelestialMap: React.FC<OverworldCelestialMapProps> = ({
  adventureProgress,
  className = '',
}) => {
  const [isDailyQuestOpen, setIsDailyQuestOpen] = useState(false)

  return (
    <div
      className={`orbis-celestial-overworld-universe ${className}`}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        margin: '0 auto',
        padding: '0 16px 90px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        backgroundColor: '#04071b',
        backgroundImage: 'radial-gradient(ellipse at 50% 35%, #0e1545 0%, #080c2e 50%, #030514 100%)',
      }}
      aria-label="ORBis Living Cosmic Universe Overworld"
    >
      {/* 1. Ambient Stardust Particle Field */}
      <ParticleField count={40} particleType="stardust" speed={0.2} color="#fde047" />

      {/* 2. Master Universe Stage Canvas (Max Width 1020px) */}
      <div
        className="orbis-celestial-stage"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          margin: '12px auto 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '800px',
        }}
      >
        {/* Layer A: Luminous Connecting Stardust Streams */}
        <LuminousStardustStream />

        {/* Layer B: Top Celestial Row (North Star Positioned at Upper-Right) */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 'clamp(10px, 6vw, 50px)',
            marginBottom: '-10px',
          }}
        >
          <NorthStarApex
            onTap={() => setIsDailyQuestOpen(true)}
            activeQuestTitle="Daily Cosmic Exploration"
          />
        </div>

        {/* Layer C: Central ORBis Beacon Citadel & Status Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 15,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'clamp(8px, 2vw, 20px)',
          }}
        >
          <CentralOrbisCitadel
            adventureProgress={adventureProgress}
            onSelectMilestones={() => setIsDailyQuestOpen(true)}
          />
        </div>

        {/* Layer D: Three Destination Worlds (Spatial Inverted-Pyramid Layout) */}
        <div
          className="orbis-destination-islands-spatial-layout"
          style={{
            position: 'relative',
            zIndex: 12,
            width: '100%',
            maxWidth: '920px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(12px, 2.5vw, 28px)',
          }}
        >
          {/* Upper Row: Academy (Left) and Stories (Right) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '0 clamp(8px, 4vw, 36px)',
              boxSizing: 'border-box',
              flexWrap: 'nowrap',
              gap: '16px',
            }}
          >
            {/* World 1: Academy (Left - Cyan Crystals & Grand Library) */}
            <FloatingWorldIsland
              world="academy"
              badgeText="8 Academic Realms • 348 Skills"
              className="animate-island-float"
              style={{ flex: '1 1 260px', maxWidth: '320px' }}
            />

            {/* World 2: Stories (Right - Twilight Cozy Campfire & Bookshelf) */}
            <FloatingWorldIsland
              world="stories"
              badgeText="Story Studio • Illustrated Reader"
              className="animate-island-float-delayed"
              style={{ flex: '1 1 260px', maxWidth: '320px' }}
            />
          </div>

          {/* Lower Row: Playroom (Bottom Center - Pastel Cloud Playground) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '-4px',
            }}
          >
            <FloatingWorldIsland
              world="playroom"
              badgeText="10 Simulation & Physics Labs"
              className="animate-island-float"
              style={{ maxWidth: '340px' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Floating Celestial Quick Navigation Dock */}
      <nav
        aria-label="Celestial Worlds Navigation Dock"
        style={{
          position: 'fixed',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(10, 14, 40, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '9999px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(99, 102, 241, 0.3)',
          maxWidth: '92vw',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Overworld Active"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.3) 0%, rgba(245, 158, 11, 0.35) 100%)',
            border: '1px solid rgba(253, 224, 71, 0.6)',
            color: '#fef08a',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            outline: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <AnimatedIcon kind="north_star" size={16} color="#fde047" />
          <span>Overworld</span>
        </button>

        <a
          href="/academy"
          aria-label="Navigate to Academy"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#7dd3fc',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <AnimatedIcon kind="citadel" size={16} color="#38bdf8" />
          <span>Academy</span>
        </a>

        <a
          href="/stories"
          aria-label="Navigate to Stories"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(251, 146, 60, 0.35)',
            color: '#fdba74',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <AnimatedIcon kind="book" size={16} color="#ffb84d" />
          <span>Stories</span>
        </a>

        <a
          href="/playroom"
          aria-label="Navigate to Playroom"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(244, 114, 182, 0.35)',
            color: '#f472b6',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <AnimatedIcon kind="planet" size={16} color="#f472b6" />
          <span>Playroom</span>
        </a>
      </nav>

      {/* 4. Daily Guidance & Quests Modal */}
      <DailyQuestModal
        isOpen={isDailyQuestOpen}
        onClose={() => setIsDailyQuestOpen(false)}
        adventureProgress={adventureProgress}
      />
    </div>
  )
}
