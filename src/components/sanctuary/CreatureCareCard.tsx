import React, { useState } from 'react'
import type { CreatureSpecies } from '../../types/games/creatureLab'
import type {
  SanctuaryCreatureState,
  FeedResult,
  PetResult,
} from '../../types/games/sanctuary'
import {
  SANCTUARY_TREATS,
  sanctuaryService,
} from '../../services/games/sanctuaryService'
import { sfxService } from '../../services/audio/sfxService'

interface CreatureCareCardProps {
  childId: string
  creature: CreatureSpecies
  creatureState: SanctuaryCreatureState
  treatInventory: Record<string, number>
  onFeed: (treatId: string) => FeedResult
  onPet: () => PetResult
  onRename: (nickname: string) => void
  onClose?: () => void
}

export const CreatureCareCard: React.FC<CreatureCareCardProps> = ({
  creature,
  creatureState,
  treatInventory,
  onFeed,
  onPet,
  onRename,
  onClose,
}) => {
  const [pettingAnimationActive, setPettingAnimationActive] = useState<boolean>(false)
  const [heartsList, setHeartsList] = useState<{ id: number; x: number; y: number; emoji: string }[]>([])
  const [feedFeedback, setFeedFeedback] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const [nicknameInput, setNicknameInput] = useState<string>(creatureState.customNickname || '')

  const happiness = creatureState.happiness
  const level = creatureState.friendshipLevel
  const currentXp = creatureState.friendshipXp
  const requiredXp = sanctuaryService.getXpForNextLevel(level)
  const xpPercent = Math.min(100, Math.round((currentXp / requiredXp) * 100))

  const handlePetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const result = onPet()
    setPettingAnimationActive(true)
    setTimeout(() => setPettingAnimationActive(false), 500)

    // Spawn floating heart particle
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left + (Math.random() * 40 - 20)
    const y = e.clientY - rect.top - 20
    const emojis = ['💖', '✨', '⭐', '🥰', '💕']
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

    const newHeart = { id: Date.now() + Math.random(), x, y, emoji: randomEmoji }
    setHeartsList((prev) => [...prev, newHeart])
    setTimeout(() => {
      setHeartsList((prev) => prev.filter((h) => h.id !== newHeart.id))
    }, 1200)

    setFeedFeedback(result.message)
  }

  const handleFeedClick = (treatId: string) => {
    const res = onFeed(treatId)
    setFeedFeedback(res.message)
  }

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault()
    onRename(nicknameInput)
    setIsRenaming(false)
  }

  return (
    <div
      className="creature-care-card"
      style={{
        background: 'var(--surface-card, #191a35)',
        color: 'var(--text-heading, #f8f7ff)',
        borderRadius: '28px',
        padding: '24px',
        border: '2px solid var(--border, rgba(157, 141, 253, 0.25))',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(108, 92, 231, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isRenaming ? (
              <form onSubmit={handleSaveNickname} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder={creature.name}
                  autoFocus
                  maxLength={24}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--accent, #6c5ce7)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'inherit',
                    fontWeight: 800,
                    fontSize: '16px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="button button-primary"
                  style={{ padding: '4px 12px', fontSize: '12px' }}
                >
                  Save
                </button>
              </form>
            ) : (
              <>
                <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#f8f7ff' }}>
                  {creatureState.customNickname || creature.name}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    sfxService.play('card_flip')
                    setNicknameInput(creatureState.customNickname || creature.name)
                    setIsRenaming(true)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '2px 6px',
                  }}
                  title="Edit Nickname"
                >
                  ✏️
                </button>
              </>
            )}
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            {creature.speciesTitle} • {creature.family.toUpperCase()}
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close care card"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Petting & Avatar Zone */}
      <div
        onClick={handlePetClick}
        role="button"
        tabIndex={0}
        aria-label={`Pet ${creatureState.customNickname || creature.name}`}
        style={{
          position: 'relative',
          background: `radial-gradient(circle at center, ${creature.primaryColor}22 0%, rgba(15, 23, 42, 0.4) 80%)`,
          borderRadius: '24px',
          padding: '28px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          border: `2px dashed ${creature.primaryColor}60`,
          boxShadow: `inset 0 0 25px ${creature.glowColor}`,
          userSelect: 'none',
        }}
      >
        {/* Floating Heart Particles */}
        {heartsList.map((h) => (
          <div
            key={h.id}
            style={{
              position: 'absolute',
              left: `${h.x}px`,
              top: `${h.y}px`,
              fontSize: '28px',
              pointerEvents: 'none',
              animation: 'floatUpAndFade 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              zIndex: 20,
            }}
          >
            {h.emoji}
          </div>
        ))}

        {/* Large Creature Avatar */}
        <div
          style={{
            fontSize: '76px',
            filter: `drop-shadow(0 10px 24px ${creature.glowColor})`,
            transform: pettingAnimationActive ? 'scale(1.2) rotate(6deg)' : 'scale(1)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            marginBottom: '8px',
          }}
        >
          {creature.emoji}
        </div>

        <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--magic-star, #fbbf24)' }}>
          ✨ Tap to Pet & Love (+Friendship XP)
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Total pats: {creatureState.totalPetted} | Mood: {creatureState.currentMood.toUpperCase()}
        </div>
      </div>

      {/* Happiness & Friendship Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Happiness Meter */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>
              HAPPINESS
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 900,
                color: happiness >= 75 ? '#34d399' : '#fbbf24',
              }}
            >
              {happiness}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${happiness}%`,
                background:
                  happiness >= 75
                    ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                    : happiness >= 40
                    ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                    : 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Friendship Level */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>
              FRIENDSHIP LV {level}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#a855f7' }}>
              {currentXp}/{requiredXp} XP
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${xpPercent}%`,
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Live Action Feedback Bubble */}
      {feedFeedback && (
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#fbbf24',
            fontWeight: 700,
            textAlign: 'center',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {feedFeedback}
        </div>
      )}

      {/* Feeding Section: Elemental Treat Shelf */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            FEED ELEMENTAL TREATS
          </label>
          <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
            Fav: {creature.favoriteFood}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '10px',
          }}
        >
          {SANCTUARY_TREATS.map((treat) => {
            const count = treatInventory[treat.id] || 0
            const isFavorite =
              treat.family === creature.family || treat.family === 'cosmic'

            return (
              <button
                key={treat.id}
                type="button"
                onClick={() => handleFeedClick(treat.id)}
                disabled={count <= 0}
                style={{
                  padding: '10px 8px',
                  borderRadius: '16px',
                  background: isFavorite
                    ? 'rgba(251, 191, 36, 0.12)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isFavorite
                    ? '1.5px solid #fbbf24'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'inherit',
                  cursor: count > 0 ? 'pointer' : 'not-allowed',
                  opacity: count > 0 ? 1 : 0.4,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                {isFavorite && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '6px',
                      background: '#f59e0b',
                      color: '#1e1b4b',
                      fontSize: '8px',
                      fontWeight: 900,
                      padding: '1px 5px',
                      borderRadius: '6px',
                      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
                    }}
                  >
                    FAVORITE ⭐
                  </span>
                )}
                <span style={{ fontSize: '26px' }}>{treat.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: 800 }}>{treat.name}</span>
                <span
                  style={{
                    fontSize: '10px',
                    color: count > 0 ? '#34d399' : '#f87171',
                    fontWeight: 700,
                  }}
                >
                  x{count} Left
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Science of Wonder Concept Lore */}
      <div
        style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '16px',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '16px' }}>🔬</span>
          <span style={{ fontWeight: 800, fontSize: '13px', color: '#93c5fd' }}>
            {creature.scientificConcept.name}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1.4 }}>
          {creature.scientificConcept.explanation}
        </p>
        <div style={{ fontSize: '11px', color: '#fbbf24', fontStyle: 'italic' }}>
          💡 Fun Fact: {creature.scientificConcept.funFact}
        </div>
      </div>
    </div>
  )
}
