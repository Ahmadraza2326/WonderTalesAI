import React, { useEffect, useState } from 'react'
import type { CreatureSpecies } from '../../../types/games/creatureLab'
import { sfxService } from '../../../services/audio/sfxService'
import { CelebrationParticles } from '../../experience/CelebrationParticles'

interface CreatureHatchModalProps {
  creature: CreatureSpecies
  isNewDiscovery: boolean
  xpAwarded: number
  starsAwarded: number
  onCollectAndContinue: (customNickname?: string) => void
}

export const CreatureHatchModal: React.FC<CreatureHatchModalProps> = ({
  creature,
  isNewDiscovery,
  xpAwarded,
  starsAwarded,
  onCollectAndContinue,
}) => {
  const [stage, setStage] = useState<'flash' | 'revealed'>('flash')
  const [nickname, setNickname] = useState<string>('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)

  useEffect(() => {
    if (creature.rarity === 'legendary') {
      sfxService.play('legendary_discovery')
    } else if (creature.rarity === 'epic' || creature.rarity === 'rare') {
      sfxService.play('rare_discovery')
    } else {
      sfxService.play('creature_reveal')
    }

    const timer = setTimeout(() => {
      setStage('revealed')
      if (isNewDiscovery) {
        sfxService.play('victory_fanfare')
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [creature.rarity, isNewDiscovery])

  const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
    common: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80', border: '#22c55e' },
    rare: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', border: '#3b82f6' },
    epic: { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc', border: '#a855f7' },
    legendary: { bg: 'rgba(234, 179, 8, 0.2)', text: '#facc15', border: '#eab308' },
  }

  const currentRarity = rarityColors[creature.rarity] || rarityColors.common

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
        animation: 'fadeIn 0.3s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="creature-name-title"
    >
      {isNewDiscovery && <CelebrationParticles particleCount={50} />}

      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          border: `2px solid ${creature.primaryColor}`,
          boxShadow: `0 0 40px ${creature.glowColor}, 0 20px 40px rgba(0,0,0,0.6)`,
          borderRadius: '28px',
          padding: '24px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          transform: stage === 'revealed' ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header Tag */}
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: isNewDiscovery ? 'rgba(245, 158, 11, 0.25)' : 'rgba(148, 163, 184, 0.2)',
              color: isNewDiscovery ? '#fbbf24' : '#cbd5e1',
              border: isNewDiscovery ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {isNewDiscovery ? '✨ New Discovery!' : '🐾 Known Friend Re-Hatched'}
          </span>
          {creature.isSecret && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(236, 72, 153, 0.3)',
                color: '#f472b6',
                border: '1px solid #ec4899',
              }}
            >
              🌟 Secret Discovery
            </span>
          )}
        </div>

        {/* Animated Creature Hero Avatar */}
        <div
          style={{
            position: 'relative',
            width: '110px',
            height: '110px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${creature.glowColor} 0%, rgba(30, 27, 75, 0.6) 80%)`,
            border: `3px solid ${creature.primaryColor}`,
            boxShadow: `0 0 30px ${creature.glowColor}`,
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          <span style={{ fontSize: '56px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
            {creature.emoji}
          </span>
        </div>

        {/* Creature Name & Title */}
        <h2 id="creature-name-title" style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>
          {nickname ? nickname : creature.name}
        </h2>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: creature.primaryColor, fontWeight: 700 }}>
          {creature.speciesTitle}
        </p>

        {/* Personality Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.25)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#e0e7ff',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '16px',
          }}
        >
          <span>💖</span>
          <span>{creature.personality}</span>
        </div>

        {/* Lore / Story Snippet */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'left',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{creature.loreSnippet}"
          </p>
        </div>

        {/* 💡 Science of Wonder Concept Box */}
        {creature.scientificConcept && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              border: '1.5px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '16px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '15px' }}>💡</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                Science of Wonder: {creature.scientificConcept.name}
              </span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
              {creature.scientificConcept.explanation}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#a78bfa', fontWeight: 600 }}>
              🔍 <strong>Fun Fact:</strong> {creature.scientificConcept.funFact}
            </p>
          </div>
        )}

        {/* Custom Nickname Input (Optional) */}
        {isNewDiscovery && (
          <div style={{ marginBottom: '16px' }}>
            {!isEditingNickname && !nickname ? (
              <button
                type="button"
                onClick={() => setIsEditingNickname(true)}
                style={{
                  background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                ✏️ Give your new friend a nickname
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', maxWidth: '320px', margin: '0 auto' }}>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={`Nickname for ${creature.name}...`}
                  maxLength={24}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(168, 85, 247, 0.5)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingNickname(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#8b5cf6',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}

        {/* Traits & Rarity Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: currentRarity.bg,
              border: `1px solid ${currentRarity.border}`,
              color: currentRarity.text,
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {creature.rarity}
          </span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            Family: {creature.family}
          </span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            Favorite Food: {creature.favoriteFood}
          </span>
        </div>

        {/* Reward Summary Pill */}
        {isNewDiscovery ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '16px',
              padding: '10px 16px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24' }}>
              +{xpAwarded} XP
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b' }}>
              +{starsAwarded} ⭐ Stars
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#c084fc' }}>
              +10 ✨ Stardust
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '16px',
              padding: '8px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#c084fc',
              fontWeight: 700,
            }}
          >
            <span>✨ +3 Crafting Stardust added to your lab!</span>
          </div>
        )}

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => onCollectAndContinue(nickname.trim() || undefined)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0,0,0,0.3)',
            minHeight: '48px',
          }}
          aria-label="Collect creature and return to lab"
        >
          {isNewDiscovery ? '📖 Add to Almanac of Wonder!' : '✨ Keep Exploring!'}
        </button>
      </div>
    </div>
  )
}
