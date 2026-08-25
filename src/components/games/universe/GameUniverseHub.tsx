import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLAYGROUND_REGISTRY } from '../../../services/games/playgroundRegistry'
import type { PlaygroundGameMetadata } from '../../../types/playground'
import type { ChildAdventureProgress } from '../../../services/progressionService'
import { sfxService } from '../../../services/audio/sfxService'
import {
  getDailyCosmicChallenges,
  getDailyChallengeCompletionStatus,
} from '../../../services/proceduralChallengeService'
import { DailyCosmicChallengeCard } from './DailyCosmicChallengeCard'

interface GameUniverseHubProps {
  adventureProgress?: ChildAdventureProgress
  onQuickPlay?: (route: string) => void
}

type FilterCategory = 'all' | 'alchemy' | 'physics' | 'detective' | 'language' | 'upcoming'

const FILTER_TABS: { id: FilterCategory; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Stations', emoji: '🪐' },
  { id: 'alchemy', label: 'Alchemy & Biology', emoji: '🧪' },
  { id: 'physics', label: 'Physics & Engineering', emoji: '⚙️' },
  { id: 'detective', label: 'Mystery & Logic', emoji: '🔍' },
  { id: 'language', label: 'Language & Words', emoji: '🔤' },
  { id: 'upcoming', label: 'Future Horizons', emoji: '🔮' },
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

  const allGames = Object.values(PLAYGROUND_REGISTRY)

  // Filter games based on selected world tab
  const filteredGames = allGames.filter((game) => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'upcoming') return !game.isPlayable
    if (selectedFilter === 'alchemy') {
      return game.id === 'creature_lab' || game.id === 'potion_scales' || game.id === 'world_builder'
    }
    if (selectedFilter === 'physics') {
      return game.id === 'magic_machine' || game.id === 'invention_lab'
    }
    if (selectedFilter === 'detective') {
      return game.id === 'mystery_detective' || game.id === 'memory_museum'
    }
    if (selectedFilter === 'language') {
      return (
        game.id === 'spellforge' ||
        game.primaryDomain === 'vocabulary' ||
        game.primaryDomain === 'phonics'
      )
    }
    return true
  })

  // Group into playable flagships vs future discoveries
  const playableStations = filteredGames.filter((g) => g.isPlayable)
  const upcomingStations = filteredGames.filter((g) => !g.isPlayable)

  const handleTabClick = (tabId: FilterCategory) => {
    sfxService.play('card_flip')
    setSelectedFilter(tabId)
  }

  const handleLaunchStation = (route: string) => {
    sfxService.play('star_pop')
    if (onQuickPlay) {
      onQuickPlay(route)
    } else {
      navigate(route)
    }
  }

  // Get live mastery stats for a station
  const getStationStats = (gameId: string) => {
    if (!adventureProgress) return null
    if (gameId === 'creature_lab') return adventureProgress.stations.creatureLab
    if (gameId === 'magic_machine' || gameId === 'invention_lab') {
      return adventureProgress.stations.magicMachine
    }
    if (gameId === 'mystery_detective') return adventureProgress.stations.mysteryDetective
    if (gameId === 'potion_scales') return adventureProgress.stations.potionScales
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
        color: '#ffffff',
        padding: '24px 16px 64px',
        boxSizing: 'border-box',
      }}
      aria-label="ORBis Playroom World Observatory"
    >
      {/* 1. Hero Observatory Capsule & World Passport Summary */}
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          background: 'rgba(30, 27, 75, 0.45)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          padding: '24px 28px',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
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
              Playroom World Observatory
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94a3b8' }}>
              Welcome back, <strong style={{ color: '#e2e8f0' }}>{childName}</strong>! Select an
              enchanted station to play, invent, and discover.
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
      </div>

      {/* 2. Infinite Daily Cosmic Challenges */}
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
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

      {/* 3. World Filter Tabs */}
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto 28px',
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '4px',
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

      {/* 3. The 4 Active Playable Stations Grid */}
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto 36px',
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
              Active Flagship Stations ({playableStations.length})
            </h2>
          </div>
          <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
            ● 100% Free to Play & Instant
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {playableStations.map((station) => {
            const stats = getStationStats(station.id)
            return (
              <StationCard
                key={station.id}
                station={station}
                stats={stats}
                onLaunch={() => handleLaunchStation(station.route)}
              />
            )
          })}
        </div>
      </div>

      {/* 4. Upcoming Future Biomes */}
      {upcomingStations.length > 0 && (
        <div
          style={{
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '20px' }}>🔮</span>
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 800,
                color: '#cbd5e1',
                letterSpacing: '-0.01em',
              }}
            >
              Future Horizon Biomes (In Discovery)
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {upcomingStations.map((station) => (
              <UpcomingBiomeCard key={station.id} station={station} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Interactive Flagship Station Card Component
 */
interface StationCardProps {
  station: PlaygroundGameMetadata
  stats: {
    completedCount: number
    totalAvailable: number
    masteryPercentage: number
    badgeLabel: string
  } | null
  onLaunch: () => void
}

const StationCard: React.FC<StationCardProps> = ({ station, stats, onLaunch }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true)
        sfxService.play('card_flip')
      }}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(30, 27, 75, 0.45)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: isHovered
          ? '2px solid #a855f7'
          : '1px solid rgba(168, 85, 247, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 16px 36px ${station.accentGlow || 'rgba(168, 85, 247, 0.35)'}`
          : '0 6px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Station Banner Header */}
      <div
        style={{
          background: station.heroBannerColor,
          padding: '20px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          {station.icon}
        </div>

        {/* Live Mastery Pill */}
        {stats && (
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '12px',
              fontWeight: 800,
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🏆</span>
            <span>{stats.badgeLabel}</span>
          </div>
        )}
      </div>

      {/* Station Content Body */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 4px',
              fontSize: '18px',
              fontWeight: 800,
              color: '#f8fafc',
            }}
          >
            {station.title}
          </h3>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#c084fc',
            }}
          >
            {station.subtitle}
          </p>

          <p
            style={{
              margin: '0 0 16px',
              fontSize: '13px',
              lineHeight: 1.5,
              color: '#94a3b8',
            }}
          >
            {station.description}
          </p>

          {/* Progress Bar */}
          {stats && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#cbd5e1',
                  marginBottom: '6px',
                }}
              >
                <span>Station Mastery</span>
                <span>{stats.masteryPercentage}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '9999px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div
                  style={{
                    width: `${stats.masteryPercentage}%`,
                    height: '100%',
                    borderRadius: '9999px',
                    background: 'linear-gradient(90deg, #a855f7 0%, #06b6d4 100%)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* Key Mechanics Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {station.learningObjectives.slice(0, 2).map((obj, i) => (
              <span
                key={i}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  background: 'rgba(51, 65, 85, 0.5)',
                  color: '#e2e8f0',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                ✓ {obj}
              </span>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={onLaunch}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '48px',
          }}
        >
          <span>Enter Station</span>
          <span style={{ fontSize: '18px' }}>➔</span>
        </button>
      </div>
    </div>
  )
}

/**
 * Locked / Future Biome Card Component
 */
interface UpcomingBiomeCardProps {
  station: PlaygroundGameMetadata
}

const UpcomingBiomeCard: React.FC<UpcomingBiomeCardProps> = ({ station }) => {
  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(6px)',
        borderRadius: '16px',
        border: '1px dashed rgba(148, 163, 184, 0.25)',
        padding: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        opacity: 0.75,
      }}
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'rgba(30, 41, 59, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
        }}
      >
        {station.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <h4
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 800,
              color: '#cbd5e1',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {station.title}
          </h4>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#64748b',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {station.subtitle}
        </p>
      </div>

      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          background: 'rgba(51, 65, 85, 0.4)',
          color: '#94a3b8',
          padding: '3px 8px',
          borderRadius: '6px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          flexShrink: 0,
        }}
      >
        In Discovery
      </span>
    </div>
  )
}
