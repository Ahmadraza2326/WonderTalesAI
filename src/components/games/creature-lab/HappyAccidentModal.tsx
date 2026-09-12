import React, { useEffect, useState } from 'react'
import type { HappyAccidentReaction } from '../../../types/games/creatureLab'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface HappyAccidentModalProps {
  reaction: HappyAccidentReaction
  onContinue: () => void
}

export const HappyAccidentModal: React.FC<HappyAccidentModalProps> = ({
  reaction,
  onContinue,
}) => {
  const [bounceScale, setBounceScale] = useState({ sx: 1, sy: 1 })

  useEffect(() => {
    HapticsService.medium()
    sfxService.play('happy_accident')
  }, [])

  const handleSlimePoke = () => {
    HapticsService.light()
    sfxService.play('cauldron_bubble')
    // Spring squash
    setBounceScale({ sx: 1.3, sy: 0.7 })
    setTimeout(() => {
      // Spring stretch
      setBounceScale({ sx: 0.85, sy: 1.2 })
      setTimeout(() => {
        setBounceScale({ sx: 1.05, sy: 0.95 })
        setTimeout(() => {
          setBounceScale({ sx: 1, sy: 1 })
        }, 120)
      }, 120)
    }, 120)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(12px)',
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
          maxWidth: '430px',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          border: `2px solid ${reaction.primaryColor}`,
          boxShadow: `0 0 35px ${reaction.primaryColor}50, 0 16px 32px rgba(0,0,0,0.6)`,
          borderRadius: '26px',
          padding: '24px',
          textAlign: 'center',
          color: '#ffffff',
          animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
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

        {/* 3D Spring Squash/Stretch Bouncing Slime Avatar */}
        <div
          onClick={handleSlimePoke}
          role="button"
          tabIndex={0}
          aria-label="Poke the playful slime"
          style={{
            width: '105px',
            height: '105px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${reaction.primaryColor}50 0%, rgba(30, 27, 75, 0.8) 80%)`,
            border: `2.5px dashed ${reaction.primaryColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '52px',
            cursor: 'pointer',
            transform: `scale(${bounceScale.sx}, ${bounceScale.sy})`,
            transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 0 24px ${reaction.primaryColor}40`,
            userSelect: 'none',
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
            margin: '0 0 14px',
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: 1.5,
          }}
        >
          {reaction.description}
        </p>

        {/* Scientific / Magic Concept Note */}
        {reaction.concept && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.65)',
              borderRadius: '12px',
              padding: '8px 12px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12px',
              color: '#94a3b8',
            }}
          >
            💡 <strong>Observation:</strong> {reaction.concept}
          </div>
        )}

        {/* Stardust Reward Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#fbbf24',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '20px',
          }}
        >
          <span>✨ +{reaction.rewardStardust} Crafting Stardust earned!</span>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => {
            HapticsService.light()
            onContinue()
          }}
          style={{
            width: '100%',
            background: `linear-gradient(135deg, ${reaction.primaryColor} 0%, #4338ca 100%)`,
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '13px',
            fontSize: '15px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            minHeight: '46px',
          }}
        >
          Try Another Mixture 🧪
        </button>
      </div>
    </div>
  )
}
