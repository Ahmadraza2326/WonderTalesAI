import React, { useState } from 'react'
import type { PracticeQuestion } from '../../../types/academy'
import { getProgressiveHint } from '../../../services/academy/hintService'
import { GlassPanel } from '../../ui/design'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface ProgressiveHintDrawerProps {
  question: PracticeQuestion
  onHintRevealed?: (tier: number) => void
}

const TIER_LABELS: Record<number, { title: string; color: string; icon: string }> = {
  1: { title: 'Tier 1: Core Concept Rule', color: '#38bdf8', icon: '💡' },
  2: { title: 'Tier 2: Specific Problem Clue', color: '#a855f7', icon: '🔍' },
  3: { title: 'Tier 3: Partial Strategy', color: '#f59e0b', icon: '🧩' },
  4: { title: 'Tier 4: Full Worked Method', color: '#10b981', icon: '📖' },
}

export const ProgressiveHintDrawer: React.FC<ProgressiveHintDrawerProps> = ({
  question,
  onHintRevealed,
}) => {
  const [unlockedTier, setUnlockedTier] = useState<number>(0)

  const handleRequestNextHint = () => {
    const nextTier = Math.min(4, unlockedTier + 1)
    HapticsService.light()
    sfxService.play('card_flip')
    setUnlockedTier(nextTier)
    if (onHintRevealed) onHintRevealed(nextTier)
  }

  return (
    <GlassPanel
      variant="elevated"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderRadius: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>💡</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
            Progressive Hint Assistance
          </span>
        </div>

        {unlockedTier < 4 && (
          <button
            onClick={handleRequestNextHint}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {unlockedTier === 0 ? 'Unlock Hint 1' : `Unlock Hint ${unlockedTier + 1}`}
          </button>
        )}
      </div>

      {unlockedTier > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2, 3, 4].map((tierNum) => {
            if (tierNum > unlockedTier) return null
            const hint = getProgressiveHint(question, tierNum)
            const meta = TIER_LABELS[tierNum] || { title: `Tier ${tierNum}`, color: '#38bdf8', icon: '💡' }

            return (
              <div
                key={tierNum}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  borderLeft: `4px solid ${meta.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: meta.color }}>
                  {meta.icon} {meta.title}
                </span>
                <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {hint.hintText}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </GlassPanel>
  )
}
