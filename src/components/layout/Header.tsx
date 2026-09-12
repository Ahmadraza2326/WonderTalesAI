import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'
import { TopExplorerBar } from './TopExplorerBar'
import { AnimatedIcon, type IconKind } from '../ui/design/AnimatedIcon'
import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../context/I18nContext'
import { useAudio } from '../../context/AudioContext'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

type HeaderProps = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

interface NavLinkItem {
  to: string
  label: string
  iconKind: IconKind
}

export function Header({ theme, toggleTheme }: HeaderProps) {
  const { user } = useAuth()
  const { t } = useI18n()
  const { isMuted, isMusicPlaying, toggleMute, toggleMusic, resumeAudio } = useAudio()
  const location = useLocation()
  const isOverworld = location.pathname === '/' || location.pathname === '/overworld'

  const handleToggleMute = async () => {
    HapticsService.light()
    await resumeAudio()
    const nextMuted = toggleMute()
    if (!nextMuted) {
      sfxService.play('star_pop')
    }
  }

  const handleToggleMusic = async () => {
    HapticsService.light()
    await resumeAudio()
    const nextMusic = toggleMusic()
    if (nextMusic) {
      sfxService.play('star_pop')
    }
  }

  const [isExploreOpen, setIsExploreOpen] = useState(false)

  const primaryLinks: NavLinkItem[] = [
    { to: '/', label: 'Overworld', iconKind: 'compass' },
    { to: '/academy', label: 'Academy', iconKind: 'citadel' },
    { to: '/stories', label: 'Stories', iconKind: 'book' },
    { to: '/playroom', label: 'Playroom', iconKind: 'planet' },
  ]

  const exploreLinks: NavLinkItem[] = [
    { to: '/explore', label: 'Explore Observatory Hub', iconKind: 'crystal' },
    { to: '/academy/library', label: 'Universal Library', iconKind: 'scroll' },
    { to: '/academy/create', label: 'Creative Studio', iconKind: 'palette' },
    { to: '/sanctuary', label: 'Starlight Sanctuary', iconKind: 'heart' },
    { to: '/passport', label: 'Explorer Passport', iconKind: 'trophy' },
    { to: '/parent-zone', label: 'Parent Zone', iconKind: 'shield' },
    { to: '/profile', label: 'Profile & Settings', iconKind: 'user' },
  ]

  return (
    <header
      className="site-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        gap: 'clamp(4px, 1.2vw, 10px)',
        padding: 'clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 14px)',
      }}
    >
      <div className="brand-block" style={{ flexShrink: 0 }}>
        <NavLink
          to="/"
          className="brand-link"
          aria-label="ORBIS Home"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <AnimatedIcon kind="planet" size={24} color="#38bdf8" animate="float" />
          <span className="brand-text" style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.2rem)' }}>
            ORBIS<span className="brand-text-ai" style={{ color: '#38bdf8' }}>AI</span>
          </span>
        </NavLink>
      </div>

      {/* Section navigation is hidden on the Overworld — the map IS the navigation */}
      {!isOverworld && (
        <nav className="site-nav site-nav--desktop" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <AnimatedIcon kind={link.iconKind} size={16} />
              <span>{link.label}</span>
            </NavLink>
          ))}

          {/* Responsive Explore Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsExploreOpen((prev) => !prev)}
              onBlur={() => setTimeout(() => setIsExploreOpen(false), 200)}
              className={`nav-link ${isExploreOpen ? 'active' : ''}`}
              style={{
                background: isExploreOpen ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
              }}
              aria-expanded={isExploreOpen}
              aria-haspopup="true"
            >
              <AnimatedIcon kind="sparkle" size={16} color="#fbbf24" animate="pulse" />
              <span>Explore</span>
              <span style={{ fontSize: '10px', marginLeft: '2px' }}>{isExploreOpen ? '▲' : '▼'}</span>
            </button>

            {isExploreOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'rgba(15, 23, 42, 0.96)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1.5px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '220px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {exploreLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsExploreOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.15s ease',
                    }}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <AnimatedIcon kind={link.iconKind} size={18} color="#38bdf8" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
      )}

      <div
        className="header-actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        {/* Live Top Explorer Bar Pill */}
        <TopExplorerBar compact />

        {/* Master Sound FX & Voice Mute Toggle */}
        <Button
          variant="secondary"
          onClick={handleToggleMute}
          ariaLabel={isMuted ? 'Unmute all audio and sound effects' : 'Mute all audio and sound effects'}
          className={`audio-toggle-btn ${isMuted ? 'audio-muted' : 'audio-active'}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            minWidth: '38px',
            minHeight: '38px',
            padding: 0,
            borderRadius: '10px',
          }}
        >
          <AnimatedIcon
            kind={isMuted ? 'volume_off' : 'volume_on'}
            size={18}
            color={isMuted ? '#ef4444' : '#38bdf8'}
          />
        </Button>

        {/* Ambient Cosmic Music Toggle */}
        <Button
          variant="secondary"
          onClick={handleToggleMusic}
          ariaLabel={isMusicPlaying ? 'Turn ambient soundscape music off' : 'Turn ambient soundscape music on'}
          className={`music-toggle-btn ${isMusicPlaying ? 'music-active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            minWidth: '38px',
            minHeight: '38px',
            padding: 0,
            borderRadius: '10px',
          }}
        >
          <AnimatedIcon
            kind="music"
            size={18}
            color={isMusicPlaying ? '#a855f7' : '#64748b'}
            animate={isMusicPlaying ? 'pulse' : 'none'}
          />
        </Button>

        {/* Theme Light/Dark Toggle */}
        <Button
          variant="secondary"
          onClick={toggleTheme}
          ariaLabel={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          className="theme-toggle-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            minWidth: '38px',
            minHeight: '38px',
            padding: 0,
            borderRadius: '10px',
          }}
        >
          <AnimatedIcon
            kind={theme === 'light' ? 'moon' : 'sun'}
            size={18}
            color={theme === 'light' ? '#6366f1' : '#fbbf24'}
          />
        </Button>

        {!user ? (
          <NavLink
            to="/auth"
            className="button button-primary header-auth-link"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              minHeight: '38px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {t('sign_in')}
          </NavLink>
        ) : null}
      </div>
    </header>
  )
}
