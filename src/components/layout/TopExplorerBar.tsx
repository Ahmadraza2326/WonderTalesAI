import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildProfiles } from '../../hooks/useChildProfiles'
import { computeExplorerTitle, getNextLevelThreshold } from '../../services/progressionService'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'
import { AnimatedIcon } from '../ui/design/AnimatedIcon'

export interface TopExplorerBarProps {
  compact?: boolean
  className?: string
}

export const TopExplorerBar: React.FC<TopExplorerBarProps> = ({ compact = false, className = '' }) => {
  const navigate = useNavigate()
  const { profiles, selectedProfile, selectProfile } = useChildProfiles()
  const [isSwitcherOpen, setIsSwitcherOpen] = React.useState(false)

  const xp = selectedProfile?.xp ?? 0
  const stars = selectedProfile?.stars ?? 10
  const streak = selectedProfile?.current_streak ?? 1
  const childName = selectedProfile?.name ?? 'Explorer'

  const titleMeta = computeExplorerTitle(xp)
  const threshold = getNextLevelThreshold(xp)

  const handleClick = () => {
    if (profiles.length > 1 && compact) {
      setIsSwitcherOpen((prev) => !prev)
    } else {
      HapticsService.light()
      sfxService.play('star_pop')
      navigate('/')
    }
  }

  const handleSelectSibling = (p: typeof profiles[0]) => {
    HapticsService.medium()
    sfxService.play('star_pop')
    selectProfile(p)
    setIsSwitcherOpen(false)
  }

  if (compact) {
    return (
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <button
          type="button"
          onClick={handleClick}
          className={`top-explorer-bar-compact ${className}`}
          title={`${childName}: Level ${titleMeta.level} (${titleMeta.title}) - ${xp}/${threshold.nextLevelXp} XP. ${profiles.length > 1 ? 'Tap to switch profile!' : 'Tap for Overworld!'}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 27, 75, 0.9) 100%)',
            border: '1.5px solid rgba(168, 85, 247, 0.45)',
            borderRadius: '9999px',
            padding: '4px 12px',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3), 0 0 12px rgba(168, 85, 247, 0.2)',
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
            }}
          >
            <AnimatedIcon kind="crystal" size={12} color="#ffffff" />
          </span>

          <span
            style={{
              background: '#fbbf24',
              color: '#0f172a',
              fontSize: '10px',
              fontWeight: 900,
              padding: '1px 6px',
              borderRadius: '9999px',
            }}
          >
            LV {titleMeta.level}
          </span>

          <span style={{ color: '#c084fc', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <AnimatedIcon kind="circuit" size={12} color="#c084fc" />
            <span>{xp}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>/{threshold.nextLevelXp}</span>
          </span>

          <span style={{ color: '#fbbf24', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <AnimatedIcon kind="star" size={12} color="#fbbf24" />
            <span>{stars}</span>
          </span>

          <span style={{ color: '#f87171', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <AnimatedIcon kind="radiance" size={12} color="#f87171" />
            <span>{streak}d</span>
          </span>

          {profiles.length > 1 && <span style={{ fontSize: '9px', opacity: 0.7 }}>▾</span>}
        </button>

        {isSwitcherOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(168, 85, 247, 0.45)',
              borderRadius: '16px',
              padding: '8px',
              minWidth: '200px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
              zIndex: 110,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, padding: '4px 8px', textTransform: 'uppercase' }}>
              Switch Child Profile
            </div>
            {profiles.map((p) => {
              const isSelected = p.id === selectedProfile?.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectSibling(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                    border: isSelected ? '1px solid #c084fc' : 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AnimatedIcon kind="crystal" size={16} color="#fbbf24" />
                    <span>{p.name}</span>
                  </span>
                  {isSelected && <AnimatedIcon kind="check" size={14} color="#10b981" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`top-explorer-bar-full card-panel ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 27, 75, 0.95) 100%)',
        border: '1.5px solid rgba(168, 85, 247, 0.35)',
        borderRadius: '16px',
        padding: '12px 18px',
        color: '#ffffff',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Left: Avatar & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
          }}
        >
          <AnimatedIcon kind="crystal" size={24} color="#ffffff" animate="pulse" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                background: '#fbbf24',
                color: '#0f172a',
                fontSize: '10px',
                fontWeight: 900,
                padding: '2px 7px',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
              }}
            >
              LV {titleMeta.level}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>{childName}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: 600, marginTop: '2px' }}>
            {titleMeta.title}
          </div>
        </div>
      </div>

      {/* Center: XP Progress Bar */}
      <div style={{ flex: '1 1 180px', minWidth: '160px', maxWidth: '280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 700, marginBottom: '4px' }}>
          <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AnimatedIcon kind="circuit" size={12} color="#c084fc" />
            <span>XP Progress</span>
          </span>
          <span style={{ color: '#e2e8f0' }}>{xp} / {threshold.nextLevelXp} XP ({threshold.progressPercent}%)</span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${threshold.progressPercent}%`,
              background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)',
            }}
          />
        </div>
      </div>

      {/* Right: Currency & Streak Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.15)',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '10px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#fbbf24',
          }}
        >
          <AnimatedIcon kind="star" size={14} color="#fbbf24" animate="sparkle" />
          <span>{stars}</span>
        </div>

        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#f87171',
          }}
        >
          <AnimatedIcon kind="radiance" size={14} color="#f87171" animate="pulse" />
          <span>{streak}d</span>
        </div>
      </div>
    </div>
  )
}
