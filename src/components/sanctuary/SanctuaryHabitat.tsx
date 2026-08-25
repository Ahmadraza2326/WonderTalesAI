import React, { useState } from 'react'
import type { CreatureSpecies } from '../../types/games/creatureLab'
import type {
  SanctuaryBiome,
  SanctuaryCreatureState,
} from '../../types/games/sanctuary'
import { sfxService } from '../../services/audio/sfxService'

interface SanctuaryHabitatProps {
  creatures: CreatureSpecies[]
  creatureStates: Record<string, SanctuaryCreatureState>
  activeBiome: SanctuaryBiome
  onBiomeChange: (biome: SanctuaryBiome) => void
  selectedCreatureId: string | null
  onSelectCreature: (creatureId: string) => void
  onNavigateToLab: () => void
}

const BIOME_CONFIGS: Record<
  SanctuaryBiome,
  {
    name: string
    icon: string
    background: string
    particleColor: string
    ambientEmoji: string[]
  }
> = {
  all: {
    name: 'All Habitats',
    icon: '🌈',
    background: 'radial-gradient(ellipse at bottom, #1e1b4b 0%, #0f172a 70%, #050814 100%)',
    particleColor: 'rgba(236, 72, 153, 0.4)',
    ambientEmoji: ['✨', '🍃', '⭐', '🌸'],
  },
  grove: {
    name: 'Verdant Grove',
    icon: '🌿',
    background: 'radial-gradient(ellipse at bottom, #064e3b 0%, #022c22 60%, #0f172a 100%)',
    particleColor: 'rgba(16, 185, 129, 0.4)',
    ambientEmoji: ['🌿', '🍃', '🍄', '🌸', '✨'],
  },
  crystal_cave: {
    name: 'Crystal Cavern',
    icon: '💎',
    background: 'radial-gradient(ellipse at bottom, #31104b 0%, #1e1b4b 60%, #090a1a 100%)',
    particleColor: 'rgba(168, 85, 247, 0.4)',
    ambientEmoji: ['💎', '🔮', '✨', '⚡'],
  },
  cloud_citadel: {
    name: 'Cloud Citadel',
    icon: '☁️',
    background: 'radial-gradient(ellipse at bottom, #1e3a8a 0%, #172554 60%, #0b132b 100%)',
    particleColor: 'rgba(56, 189, 248, 0.4)',
    ambientEmoji: ['☁️', '💨', '🌈', '⭐'],
  },
  stardust_observatory: {
    name: 'Stardust Observatory',
    icon: '🪐',
    background: 'radial-gradient(ellipse at bottom, #4c1d95 0%, #1e1b4b 70%, #030712 100%)',
    particleColor: 'rgba(251, 191, 36, 0.4)',
    ambientEmoji: ['🪐', '⭐', '✨', '🌙', '☄️'],
  },
}

export const SanctuaryHabitat: React.FC<SanctuaryHabitatProps> = ({
  creatures,
  creatureStates,
  activeBiome,
  onBiomeChange,
  selectedCreatureId,
  onSelectCreature,
  onNavigateToLab,
}) => {
  const [hoveredCreatureId, setHoveredCreatureId] = useState<string | null>(null)

  const currentBiomeConfig = BIOME_CONFIGS[activeBiome] || BIOME_CONFIGS.all

  const filteredCreatures = creatures.filter((c) => {
    if (activeBiome === 'all') return true
    return c.habitatPreference === activeBiome
  })

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'ecstatic':
        return '🤩'
      case 'happy':
        return '😊'
      case 'content':
        return '😌'
      case 'hungry':
        return '😋'
      case 'sleepy':
        return '💤'
      default:
        return '✨'
    }
  }

  return (
    <div
      className="sanctuary-habitat-container"
      style={{
        position: 'relative',
        borderRadius: '28px',
        minHeight: '480px',
        maxHeight: '620px',
        background: currentBiomeConfig.background,
        border: '2px solid var(--border, rgba(157, 141, 253, 0.2))',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Biome Filter Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{currentBiomeConfig.icon}</span>
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#f8f7ff' }}>
            {currentBiomeConfig.name}
          </span>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: 'var(--text-muted)',
              fontWeight: 700,
            }}
          >
            {filteredCreatures.length} {filteredCreatures.length === 1 ? 'Creature' : 'Creatures'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(Object.keys(BIOME_CONFIGS) as SanctuaryBiome[]).map((biomeKey) => {
            const bConfig = BIOME_CONFIGS[biomeKey]
            const isSelected = activeBiome === biomeKey
            return (
              <button
                key={biomeKey}
                type="button"
                onClick={() => {
                  sfxService.play('component_place')
                  onBiomeChange(biomeKey)
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#fbbf24' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{bConfig.icon}</span>
                <span className="hide-on-mobile-sm">{bConfig.name.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Floating Ambient Atmosphere Elements */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {currentBiomeConfig.ambientEmoji.map((emoji, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: `${15 + ((idx * 27) % 65)}%`,
              left: `${8 + ((idx * 33) % 85)}%`,
              fontSize: '22px',
              opacity: 0.25,
              animation: `float ${(idx % 3) + 4}s ease-in-out infinite alternate`,
              filter: 'blur(0.5px)',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Main Habitat World Stage */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: '24px',
          overflowY: 'auto',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: filteredCreatures.length === 0 ? 'center' : 'flex-start',
        }}
      >
        {filteredCreatures.length === 0 ? (
          /* Empty Habitat Incubator Card */
          <div
            style={{
              maxWidth: '440px',
              margin: '0 auto',
              padding: '32px 24px',
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '2px dashed rgba(251, 191, 36, 0.4)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                marginBottom: '12px',
                animation: 'bounce 2.5s infinite ease-in-out',
              }}
            >
              🥚✨
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px', color: '#f8f7ff' }}>
              The Sanctuary Awaits!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
              {activeBiome === 'all'
                ? 'You haven’t hatched any creatures yet. Brew your first magical creature in Creature Lab!'
                : `No creatures are currently dwelling in the ${currentBiomeConfig.name}.`}
            </p>
            <button
              type="button"
              onClick={onNavigateToLab}
              className="button button-primary"
              style={{
                padding: '12px 24px',
                fontWeight: 800,
                fontSize: '14px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e1b4b',
                border: 'none',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
              }}
            >
              🧪 Enter Creature Lab
            </button>
          </div>
        ) : (
          /* Creature Roaming Grid / Habitat Playground */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            {filteredCreatures.map((creature, idx) => {
              const state = creatureStates[creature.id]
              const isSelected = selectedCreatureId === creature.id
              const isHovered = hoveredCreatureId === creature.id
              const moodEmoji = getMoodEmoji(state?.currentMood)
              const nickname = state?.customNickname || creature.name
              const happiness = state?.happiness ?? 70
              const level = state?.friendshipLevel ?? 1

              return (
                <div
                  key={creature.id}
                  onClick={() => {
                    sfxService.play('card_flip')
                    onSelectCreature(creature.id)
                  }}
                  onMouseEnter={() => setHoveredCreatureId(creature.id)}
                  onMouseLeave={() => setHoveredCreatureId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select creature ${nickname}`}
                  style={{
                    position: 'relative',
                    background: isSelected
                      ? 'rgba(251, 191, 36, 0.16)'
                      : 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '24px',
                    padding: '20px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: isSelected
                      ? '2px solid #fbbf24'
                      : isHovered
                      ? `2px solid ${creature.primaryColor}`
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: isSelected
                      ? '0 0 25px rgba(251, 191, 36, 0.35)'
                      : isHovered
                      ? `0 10px 25px ${creature.glowColor}`
                      : '0 6px 18px rgba(0, 0, 0, 0.25)',
                    transform: isSelected || isHovered ? 'scale(1.04) translateY(-4px)' : 'scale(1)',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: `float ${(idx % 3) + 3}s ease-in-out infinite alternate`,
                    animationDelay: `${idx * 0.2}s`,
                  }}
                >
                  {/* Mood Bubble Indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                    title={`Mood: ${state?.currentMood || 'Happy'}`}
                  >
                    {moodEmoji}
                  </div>

                  {/* Friendship Level Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      padding: '2px 7px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                    }}
                  >
                    LV {level}
                  </div>

                  {/* Animated Creature Avatar */}
                  <div
                    style={{
                      fontSize: '54px',
                      margin: '10px 0 8px',
                      filter: `drop-shadow(0 6px 16px ${creature.glowColor})`,
                      animation: isSelected ? 'bounce 1.5s infinite' : 'none',
                    }}
                  >
                    {creature.emoji}
                  </div>

                  {/* Name & Title */}
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '14px',
                      color: isSelected ? '#fbbf24' : '#f8f7ff',
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {nickname}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginBottom: '10px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {creature.speciesTitle.replace('The ', '')}
                  </div>

                  {/* Mini Happiness Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${happiness}%`,
                        borderRadius: '3px',
                        background:
                          happiness >= 75
                            ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                            : happiness >= 40
                            ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                            : 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      fontWeight: 700,
                    }}
                  >
                    <span>Happiness</span>
                    <span style={{ color: happiness >= 75 ? '#34d399' : '#fbbf24' }}>
                      {happiness}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
