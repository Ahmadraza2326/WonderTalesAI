import React, { useEffect } from 'react'
import type { HappyAccidentReaction } from '../../../types/games/creatureLab'
import { sfxService } from '../../../services/audio/sfxService'

interface HappyAccidentModalProps {
  reaction: HappyAccidentReaction
  onContinue: () => void
}

export const HappyAccidentModal: React.FC<HappyAccidentModalProps> = ({
  reaction,
  onContinue,
}) => {
  useEffect(() => {
    sfxService.play('happy_accident')
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="accident-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          border: `2px solid ${reaction.primaryColor}`,
          boxShadow: `0 0 30px ${reaction.primaryColor}40, 0 16px 32px rgba(0,0,0,0.5)`,
          borderRadius: '24px',
          padding: '24px',
          textAlign: 'center',
          color: '#ffffff',
        }}
      >
        {/* Playful Tag */}
        <div style={{ marginBottom: '12px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.4)',
            }}
          >
            🧪 Playful Magic Reaction!
          </span>
        </div>

        {/* Reaction Emoji Avatar */}
        <div
          style={{
            width: '96px',
            height: '96px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${reaction.primaryColor}40 0%, transparent 70%)`,
            border: `2px dashed ${reaction.primaryColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            animation: 'pulse 1.5s infinite',
          }}
        >
          {reaction.emoji}
        </div>

        {/* Reaction Name */}
        <h3
          id="accident-title"
          style={{
            margin: '0 0 8px',
            fontSize: '22px',
            fontWeight: 800,
            color: '#f8fafc',
          }}
        >
          {reaction.name}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: '0 0 16px',
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#cbd5e1',
          }}
        >
          {reaction.description}
        </p>

        {/* Bonus Stardust reward pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#38bdf8',
          }}
        >
          <span>✨</span>
          <span>+{reaction.rewardStardust} Stardust Gained!</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onContinue}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '15px',
            fontWeight: 800,
            cursor: 'pointer',
            minHeight: '48px',
          }}
        >
          Try Another Mixture 🪄
        </button>
      </div>
    </div>
  )
}
