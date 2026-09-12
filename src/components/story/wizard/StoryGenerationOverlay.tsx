import React, { useEffect, useState } from 'react'
import { GlassPanel } from '../../ui/design/GlassPanel'
import { ParticleField } from '../../ui/design/ParticleField'
import { AnimatedIcon } from '../../ui/design/AnimatedIcon'

export interface StoryGenerationOverlayProps {
  isOpen: boolean
  childName?: string
  storyTitle?: string
}

interface ProgressStage {
  id: number
  title: string
  subtitle: string
  icon: 'wand' | 'sparkle' | 'scroll' | 'star'
  auraColor: string
}

const STAGES: ProgressStage[] = [
  {
    id: 1,
    title: 'Weaving the Story Plot',
    subtitle: 'Crafting magical characters, dialogues, and gentle bedtime narrative...',
    icon: 'wand',
    auraColor: '#a855f7',
  },
  {
    id: 2,
    title: 'Illustrating the Adventure',
    subtitle: 'Generating colorful story scenes, glowing backgrounds, and book pages...',
    icon: 'sparkle',
    auraColor: '#38bdf8',
  },
  {
    id: 3,
    title: 'Building the Brain Quest',
    subtitle: 'Preparing interactive comprehension puzzles and vocabulary tooltips...',
    icon: 'scroll',
    auraColor: '#f59e0b',
  },
  {
    id: 4,
    title: 'Launching Your StoryBook',
    subtitle: 'Binding story chapters, audio segments, and opening your enchanted book!',
    icon: 'star',
    auraColor: '#10b981',
  },
]

export const StoryGenerationOverlay: React.FC<StoryGenerationOverlayProps> = ({
  isOpen,
  childName = 'Explorer',
  storyTitle = 'Magical Tale',
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0)
      return
    }

    const timer1 = setTimeout(() => setCurrentStageIndex(1), 2200)
    const timer2 = setTimeout(() => setCurrentStageIndex(2), 4800)
    const timer3 = setTimeout(() => setCurrentStageIndex(3), 7400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [isOpen])

  if (!isOpen) return null

  const currentStage = STAGES[currentStageIndex] || STAGES[0]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      role="status"
      aria-live="polite"
      aria-label={`Weaving story: ${currentStage.title}`}
    >
      {/* 60fps Ambient Celestial Stardust Field */}
      <ParticleField count={36} particleType="stardust" speed={0.5} color={currentStage.auraColor} />

      <GlassPanel
        tier="hero"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '36px 28px',
          textAlign: 'center',
          position: 'relative',
          borderRadius: '32px',
          border: `1.5px solid ${currentStage.auraColor}60`,
          boxShadow: `0 24px 64px rgba(0, 0, 0, 0.7), 0 0 45px ${currentStage.auraColor}35`,
          transition: 'border-color 400ms ease, box-shadow 400ms ease',
        }}
      >
        {/* Animated Central Celestial Orb */}
        <div
          style={{
            position: 'relative',
            width: '96px',
            height: '96px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Pulsing Outer Rings */}
          <div
            style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '50%',
              border: `2px dashed ${currentStage.auraColor}`,
              animation: 'spinSlow 12s linear infinite',
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${currentStage.auraColor} 0%, rgba(15, 23, 42, 0.9) 85%)`,
              boxShadow: `0 0 30px ${currentStage.auraColor}80`,
              animation: 'pulseGlow 2.4s ease-in-out infinite alternate',
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <AnimatedIcon kind={currentStage.icon} size={36} color="#ffffff" animate="sparkle" />
          </div>
        </div>

        {/* Story Metadata Badge */}
        <div style={{ marginBottom: '12px' }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fbbf24',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '9999px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            ★ Star Studio for {childName}
          </span>
        </div>

        <h3
          style={{
            margin: '0 0 8px',
            fontSize: '1.45rem',
            fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
            fontWeight: 900,
            color: '#f8fafc',
            letterSpacing: '-0.02em',
          }}
        >
          {currentStage.title}
        </h3>

        <p
          style={{
            margin: '0 0 28px',
            fontSize: '0.9rem',
            color: '#cbd5e1',
            lineHeight: 1.5,
            minHeight: '42px',
          }}
        >
          {currentStage.subtitle}
        </p>

        {/* 4-Stage Progress Stepper */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            margin: '0 auto',
            maxWidth: '360px',
          }}
        >
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex
            const isActive = idx === currentStageIndex

            return (
              <div
                key={stage.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    borderRadius: '9999px',
                    backgroundColor: isCompleted || isActive ? stage.auraColor : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: isActive ? `0 0 10px ${stage.auraColor}` : 'none',
                    transition: 'background-color 300ms ease, box-shadow 300ms ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: isActive ? '#f8fafc' : isCompleted ? stage.auraColor : '#64748b',
                  }}
                >
                  Step {stage.id}
                </span>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
          Tale: <strong style={{ color: '#e2e8f0' }}>{storyTitle}</strong>
        </div>
      </GlassPanel>
    </div>
  )
}
