import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCanonicalFlagshipGames } from '../../../services/games/playgroundRegistry'
import type { ChildAdventureProgress } from '../../../services/progressionService'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import {
  getDailyCosmicChallenges,
  getDailyChallengeCompletionStatus,
} from '../../../services/proceduralChallengeService'
import { DailyCosmicChallengeCard } from './DailyCosmicChallengeCard'
import { GlassPanel, ParticleField, WorldPortal } from '../../ui/design'

interface GameUniverseHubProps {
  adventureProgress?: ChildAdventureProgress
  onQuickPlay?: (route: string) => void
}

type FilterCategory = 'all' | 'early_years' | 'elementary' | 'advanced' | 'physics' | 'math' | 'detective' | 'language'

const FILTER_TABS: { id: FilterCategory; label: string; emoji: string }[] = [
  { id: 'all', label: 'All 10 Games', emoji: '🪐' },
  { id: 'early_years', label: 'Early Years (PreK-K)', emoji: '🐣' },
  { id: 'elementary', label: 'Explorer (Grades 1-3)', emoji: '🚀' },
  { id: 'advanced', label: 'Master (Grades 4-6)', emoji: '⚡' },
  { id: 'math', label: 'Math & Alchemy', emoji: '⚖️' },
  { id: 'physics', label: 'Physics & Contraptions', emoji: '⚙️' },
  { id: 'detective', label: 'Mystery Logic', emoji: '🔍' },
  { id: 'language', label: 'Words & Phonics', emoji: '🔤' },
]

export const GameUniverseHub: React.FC<GameUniverseHubProps> = ({
  adventureProgress,
  onQuickPlay,
}) => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all')

  const childId = adventureProgress?.childId || 'guest'
  const childName = adventureProgress?.childName || 'Explorer'
  const explorerTitle = adventureProgress?.explorerTitle || 'Novice Star-Seeker'
  const avatar = adventureProgress?.avatar || '🌟'
  const stars = adventureProgress?.stars || 10
  const streak = adventureProgress?.currentStreak || 1
  const level = adventureProgress?.level || 1
  const overallProgress = adventureProgress?.overallProgressPercentage || 0

  const completedChallengeIds = useMemo(() => {
    return getDailyChallengeCompletionStatus(childId)
  }, [childId])

  const dailyCosmicPackage = useMemo(() => {
    return getDailyCosmicChallenges(new Date(), level, completedChallengeIds)
  }, [level, completedChallengeIds])

  const canonicalGames = useMemo(() => getCanonicalFlagshipGames(), [])

  // Filter games based on selected world tab
  const filteredGames = useMemo(() => {
    return canonicalGames.filter((game) => {
      if (selectedFilter === 'all') return true
      if (selectedFilter === 'early_years') {
        return game.id === 'word_trace' || game.id === 'rhythm_spells' || game.id === 'potion_scales' || game.id === 'spellforge'
      }
      if (selectedFilter === 'elementary') {
        return game.id === 'magic_machine' || game.id === 'invention_lab' || game.id === 'cosmic_constellations'
      }
      if (selectedFilter === 'advanced') {
        return game.id === 'robopath' || game.id === 'mystery_detective' || game.id === 'ecosystem_sandbox'
      }
      if (selectedFilter === 'math') {
        return game.id === 'potion_scales'
      }
      if (selectedFilter === 'physics') {
        return game.id === 'magic_machine' || game.id === 'invention_lab' || game.id === 'robopath'
      }
      if (selectedFilter === 'detective') {
        return game.id === 'mystery_detective'
      }
      if (selectedFilter === 'language') {
        return game.id === 'spellforge' || game.id === 'rhythm_spells' || game.id === 'word_trace'
      }
      return true
    })
  }, [canonicalGames, selectedFilter])

  const handleTabClick = (tabId: FilterCategory) => {
    HapticsService.light()
    sfxService.play('card_flip')
    setSelectedFilter(tabId)
  }

  const handleLaunchStation = (route: string) => {
    HapticsService.medium()
    sfxService.play('star_pop')
    if (onQuickPlay) {
      onQuickPlay(route)
    } else {
      navigate(route)
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
        color: '#ffffff',
        padding: '24px 16px 64px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      aria-label="ORBis Playroom World Observatory"
    >
      {/* 60fps Ambient Stardust Particle Field */}
      <ParticleField count={40} particleType="stardust" speed={0.4} color="#a855f7" />

      {/* 1. Hero Observatory Capsule & World Passport Summary */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
        <GlassPanel
          variant="hero"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            padding: '24px 28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* Avatar Orb */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {avatar}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#fbbf24',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: 'rgba(245, 158, 11, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Level {level} Explorer
                </span>
                <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 700 }}>
                  {explorerTitle}
                </span>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '26px',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#f8fafc',
                }}
              >
                Playroom Game Universe
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94a3b8' }}>
                Welcome back, <strong style={{ color: '#e2e8f0' }}>{childName}</strong>! Select one of
                the 10 canonical stations to invent, deduce, and master physical science.
              </p>
            </div>
          </div>

          {/* Vital Stats Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Stars */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
              }}
            >
              <span style={{ fontSize: '18px' }}>⭐</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#fbbf24' }}>
                {stars} Stars
              </span>
            </div>

            {/* Streak */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
              }}
            >
              <span style={{ fontSize: '18px' }}>🔥</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#f87171' }}>
                {streak} Day Streak
              </span>
            </div>

            {/* World Mastery */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
              }}
            >
              <span style={{ fontSize: '18px' }}>🧭</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#60a5fa' }}>
                {overallProgress}% Mastered
              </span>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* 2. Infinite Daily Cosmic Challenges */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
        <DailyCosmicChallengeCard
          dailyPackage={dailyCosmicPackage}
          onChallengeLaunch={(challenge) => {
            if (onQuickPlay) {
              onQuickPlay(challenge.route)
            } else {
              navigate(challenge.route)
            }
          }}
        />
      </div>

      {/* 3. Category Filter Tabs */}
      <div
        style={{
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto 24px',
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '6px',
          boxSizing: 'border-box',
          zIndex: 1,
        }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = selectedFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '14px',
                border: isActive
                  ? '2px solid #a855f7'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(67, 56, 202, 0.35) 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
                color: isActive ? '#f8fafc' : '#94a3b8',
                fontWeight: isActive ? 800 : 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                minHeight: '44px',
              }}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 4. The 10 Canonical Flagship Stations Grid */}
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🚀</span>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 800,
                color: '#f8fafc',
                letterSpacing: '-0.01em',
              }}
            >
              The 10 Flagship Stations ({filteredGames.length})
            </h2>
          </div>
          <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
            ● 100% Free to Play & 3D Interactive
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredGames.map((station) => (
            <WorldPortal
              key={station.id}
              title={station.title}
              subtitle={station.subtitle}
              icon={station.icon}
              themeGradient={station.heroBannerColor}
              glowColor={station.accentGlow}
              badgeText={`Rank #${station.rankOrder}`}
              onClick={() => handleLaunchStation(station.route)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
