import React from 'react'
import { AnimatedIcon, type IconKind } from './AnimatedIcon'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

export interface AdventureStepNode {
  id: string
  title: string
  subtitle?: string
  status: 'completed' | 'current' | 'locked'
  icon?: IconKind
  rewardStars?: number
}

export interface AdventurePathProps {
  steps: AdventureStepNode[]
  currentStepIndex: number
  onSelectStep?: (index: number, step: AdventureStepNode) => void
  className?: string
  style?: React.CSSProperties
}

export const AdventurePath: React.FC<AdventurePathProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
  className = '',
  style,
}) => {
  const handleNodeClick = (index: number, step: AdventureStepNode) => {
    if (step.status === 'locked') {
      sfxService.play('button_click')
      HapticsService.light()
      return
    }
    sfxService.play('card_flip')
    HapticsService.medium()
    onSelectStep?.(index, step)
  }

  return (
    <div
      className={`orbis-adventure-path ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        padding: '16px 0',
        ...style,
      }}
    >
      {steps.map((step, index) => {
        const isCurrent = step.status === 'current' || index === currentStepIndex
        const isCompleted = step.status === 'completed'
        const isLocked = step.status === 'locked'

        const getNodeBg = () => {
          if (isCompleted) return 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
          if (isCurrent) return 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
          return 'rgba(30, 41, 59, 0.8)'
        }

        const getNodeBorder = () => {
          if (isCompleted) return '2px solid rgba(52, 211, 153, 0.6)'
          if (isCurrent) return '2px solid rgba(56, 189, 248, 0.8)'
          return '2px solid rgba(100, 116, 139, 0.4)'
        }

        const getNodeGlow = () => {
          if (isCompleted) return '0 0 20px rgba(16, 185, 129, 0.5)'
          if (isCurrent) return '0 0 25px rgba(56, 189, 248, 0.6)'
          return 'none'
        }

        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              position: 'relative',
            }}
          >
            {/* Connecting line behind node */}
            {index < steps.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '27px',
                  top: '56px',
                  width: '4px',
                  height: '24px',
                  background: isCompleted
                    ? 'rgba(16, 185, 129, 0.6)'
                    : 'rgba(100, 116, 139, 0.3)',
                  borderRadius: '2px',
                  zIndex: 0,
                }}
              />
            )}

            {/* Circular Step Node */}
            <button
              onClick={() => handleNodeClick(index, step)}
              disabled={isLocked}
              aria-label={`Step ${index + 1}: ${step.title}, Status: ${step.status}`}
              style={{
                width: '56px',
                height: '56px',
                minWidth: '56px',
                borderRadius: '50%',
                background: getNodeBg(),
                border: getNodeBorder(),
                boxShadow: getNodeGlow(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 240ms ease',
                zIndex: 1,
                padding: 0,
                outline: 'none',
              }}
            >
              {isCompleted ? (
                <AnimatedIcon kind="check" size={24} color="#ffffff" />
              ) : isLocked ? (
                <AnimatedIcon kind="lock" size={20} color="#94a3b8" />
              ) : (
                <AnimatedIcon kind={step.icon || 'star'} size={24} color="#ffffff" animate={isCurrent ? 'sparkle' : 'none'} />
              )}
            </button>

            {/* Node Info Text */}
            <div
              onClick={() => handleNodeClick(index, step)}
              style={{
                flex: 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  fontSize: '1rem',
                  fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  color: isCurrent ? '#38bdf8' : isCompleted ? '#10b981' : '#f8fafc',
                }}
              >
                {step.title}
              </div>
              {step.subtitle && (
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '2px' }}>
                  {step.subtitle}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
