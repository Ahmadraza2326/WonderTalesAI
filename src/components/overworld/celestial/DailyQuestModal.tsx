import React from 'react'
import { useNavigate } from 'react-router-dom'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { AnimatedIcon } from '../../ui/design/AnimatedIcon'
import { MagicalButton } from '../../ui/design/MagicalButton'
import type { ChildAdventureProgress } from '../../../services/progressionService'

export interface DailyQuestModalProps {
  isOpen: boolean
  onClose: () => void
  adventureProgress?: ChildAdventureProgress
}

export const DailyQuestModal: React.FC<DailyQuestModalProps> = ({
  isOpen,
  onClose,
  adventureProgress,
}) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const childName = adventureProgress?.childName || 'Explorer'

  const quests = [
    {
      id: 'quest_academy',
      world: 'academy',
      title: 'Academy Expedition',
      description: 'Master a new math or science concept with Poly and Newton.',
      reward: 20,
      rewardType: 'xp',
      route: '/academy',
      color: '#38bdf8',
      iconKind: 'citadel' as const,
      status: 'Ready',
    },
    {
      id: 'quest_stories',
      world: 'stories',
      title: 'Storyteller Hearth',
      description: 'Create an illustrated fairy tale or read an adventure with Lexi.',
      reward: 15,
      rewardType: 'xp',
      route: '/stories',
      color: '#ffb84d',
      iconKind: 'book' as const,
      status: 'Ready',
    },
    {
      id: 'quest_playroom',
      world: 'playroom',
      title: 'Playroom Laboratory',
      description: 'Launch a physics simulation experiment or hatch a starlight beast.',
      reward: 25,
      rewardType: 'xp',
      route: '/playroom',
      color: '#f472b6',
      iconKind: 'planet' as const,
      status: 'Ready',
    },
  ]

  const handleEmbark = (route: string) => {
    HapticsService.medium()
    sfxService.play('star_pop')
    onClose()
    navigate(route)
  }

  const handleClose = () => {
    HapticsService.light()
    sfxService.play('card_flip')
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-quest-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.98) 100%)',
          border: '1.5px solid rgba(253, 224, 71, 0.45)',
          borderRadius: '28px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(253, 224, 71, 0.25)',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with North Star Glow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fde047 0%, #ca8a04 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(253, 224, 71, 0.6)',
              }}
            >
              <AnimatedIcon kind="north_star" size={24} color="#0f172a" animate="sparkle" />
            </div>
            <div>
              <h2
                id="daily-quest-modal-title"
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#fef08a',
                }}
              >
                North Star Daily Guidance
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Today&apos;s cosmic exploration quests for {childName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            ✕
          </button>
        </div>

        {/* Quest List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {quests.map((q) => (
            <div
              key={q.id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${q.color}40`,
                borderRadius: '18px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: `${q.color}20`,
                    border: `1px solid ${q.color}60`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AnimatedIcon kind={q.iconKind} size={20} color={q.color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>{q.title}</span>
                    <span
                      style={{
                        background: 'rgba(253, 224, 71, 0.15)',
                        color: '#fde047',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      +{q.reward} XP
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>
                    {q.description}
                  </p>
                </div>
              </div>

              <MagicalButton
                variant="primary"
                size="sm"
                onClick={() => handleEmbark(q.route)}
                aria-label={`Embark on ${q.title}`}
                style={{ flexShrink: 0, padding: '6px 14px', fontSize: '12px' }}
              >
                Embark
              </MagicalButton>
            </div>
          ))}
        </div>

        {/* Inspiring Curiosity Quote */}
        <div
          style={{
            background: 'rgba(253, 224, 71, 0.08)',
            border: '1px dashed rgba(253, 224, 71, 0.3)',
            borderRadius: '14px',
            padding: '10px 14px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: '#fef08a', fontStyle: 'italic' }}>
            &ldquo;Every great explorer begins with a single question.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
