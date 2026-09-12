import React from 'react'
import type { SubjectId } from '../../../../types/academy'
import { ParticleField } from '../../../ui/design/ParticleField'

interface RealmStageBackdropProps {
  subjectId?: SubjectId
  children: React.ReactNode
}

interface RealmBackdropTheme {
  background: string
  accentAura: string
  accentColor: string
  particleType: 'stardust' | 'embers' | 'runes' | 'bubbles'
  particleColor: string
}

export const RealmStageBackdrop: React.FC<RealmStageBackdropProps> = ({
  subjectId = 'math',
  children,
}) => {
  const getBackdropStyles = (): RealmBackdropTheme => {
    switch (subjectId) {
      case 'math':
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(56, 189, 248, 0.18)',
          accentColor: '#38bdf8',
          particleType: 'stardust',
          particleColor: '#38bdf8',
        }
      case 'science':
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #064e3b 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(16, 185, 129, 0.18)',
          accentColor: '#10b981',
          particleType: 'bubbles',
          particleColor: '#10b981',
        }
      case 'reading':
      case 'grammar':
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #451a03 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(245, 158, 11, 0.18)',
          accentColor: '#f59e0b',
          particleType: 'runes',
          particleColor: '#f59e0b',
        }
      case 'computer_science':
      case 'logic':
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #312e81 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(6, 182, 212, 0.18)',
          accentColor: '#06b6d4',
          particleType: 'stardust',
          particleColor: '#06b6d4',
        }
      case 'creativity':
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #831843 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(236, 72, 153, 0.18)',
          accentColor: '#ec4899',
          particleType: 'runes',
          particleColor: '#ec4899',
        }
      case 'english':
      case 'vocabulary':
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #581c87 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(168, 85, 247, 0.18)',
          accentColor: '#a855f7',
          particleType: 'runes',
          particleColor: '#a855f7',
        }
      case 'general_knowledge':
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #134e4a 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(20, 184, 166, 0.18)',
          accentColor: '#14b8a6',
          particleType: 'stardust',
          particleColor: '#14b8a6',
        }
      default:
        return {
          background: 'radial-gradient(ellipse at 50% 15%, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
          accentAura: 'rgba(56, 189, 248, 0.15)',
          accentColor: '#38bdf8',
          particleType: 'stardust',
          particleColor: '#38bdf8',
        }
    }
  }

  const theme = getBackdropStyles()

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: theme.background,
        overflowX: 'hidden',
        boxSizing: 'border-box',
        padding: '0 16px 48px',
      }}
    >
      {/* 1. Ambient Celestial Glow Aura */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(800px, 100vw)',
          height: '360px',
          borderRadius: '50%',
          background: theme.accentAura,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 2. Floating Atmospheric World Particles via Canvas (Zero Emoji) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <ParticleField
          particleType={theme.particleType}
          count={28}
          speed={0.3}
          color={theme.particleColor}
        />
      </div>

      {/* 3. Foreground Lesson Content Stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '880px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  )
}
