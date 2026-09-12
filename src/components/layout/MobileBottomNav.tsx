import React from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatedIcon, type IconKind } from '../ui/design/AnimatedIcon'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

interface NavItemConfig {
  to: string
  label: string
  iconKind: IconKind
  activeColor: string
}

const PRIMARY_WORLDS: NavItemConfig[] = [
  {
    to: '/',
    label: 'Overworld',
    iconKind: 'compass',
    activeColor: '#38bdf8',
  },
  {
    to: '/academy',
    label: 'Academy',
    iconKind: 'citadel',
    activeColor: '#a855f7',
  },
  {
    to: '/stories',
    label: 'Stories',
    iconKind: 'book',
    activeColor: '#fbbf24',
  },
  {
    to: '/playroom',
    label: 'Playroom',
    iconKind: 'planet',
    activeColor: '#ec4899',
  },
]

export const MobileBottomNav: React.FC = () => {
  const handleNavClick = () => {
    HapticsService.selection()
    sfxService.play('card_flip')
  }

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="ORBis Primary World Navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '6px',
        paddingBottom: 'max(6px, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(8px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(8px, env(safe-area-inset-right, 0px))',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {PRIMARY_WORLDS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={handleNavClick}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
          style={({ isActive }) => ({
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '6px 4px',
            color: isActive ? item.activeColor : '#94a3b8',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.02em',
            transition: 'color 0.2s ease, transform 0.15s ease',
            minHeight: '48px',
            touchAction: 'manipulation',
          })}
          aria-label={item.label}
        >
          {({ isActive }) => (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: isActive
                    ? `radial-gradient(circle, ${item.activeColor}25 0%, transparent 70%)`
                    : 'transparent',
                  transform: isActive ? 'scale(1.1)' : 'scale(1.0)',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <AnimatedIcon
                  kind={item.iconKind}
                  size={20}
                  color={isActive ? item.activeColor : '#94a3b8'}
                  animate={isActive ? 'pulse' : 'none'}
                />
              </div>
              <span style={{ fontSize: '10px', lineHeight: 1 }}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
