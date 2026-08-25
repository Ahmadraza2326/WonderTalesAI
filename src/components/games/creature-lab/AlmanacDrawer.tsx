import React, { useState, useMemo } from 'react'
import type { CreatureSpecies, ElementalFamily, DiscoveredCreatureMetadata } from '../../../types/games/creatureLab'
import { CREATURE_ROSTER, getCollectionStats } from '../../../services/games/creatureLabEngine'
import { sfxService } from '../../../services/audio/sfxService'

interface AlmanacDrawerProps {
  isOpen: boolean
  discoveredCreatureIds: string[]
  metadataMap?: Record<string, DiscoveredCreatureMetadata>
  onClose: () => void
}

type FilterCategory = 'all' | ElementalFamily | 'secret'

export const AlmanacDrawer: React.FC<AlmanacDrawerProps> = ({
  isOpen,
  discoveredCreatureIds,
  metadataMap = {},
  onClose,
}) => {
  const [selectedCreature, setSelectedCreature] = useState<CreatureSpecies | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  const stats = useMemo(() => getCollectionStats(discoveredCreatureIds), [discoveredCreatureIds])

  if (!isOpen) return null

  const handleInspect = (creature: CreatureSpecies, isDiscovered: boolean) => {
    setSelectedCreature(creature)
    if (isDiscovered) {
      if (creature.rarity === 'legendary') {
        sfxService.play('legendary_discovery')
      } else if (creature.rarity === 'epic' || creature.rarity === 'rare') {
        sfxService.play('rare_discovery')
      } else {
        sfxService.play('creature_reveal')
      }
    } else {
      sfxService.play('card_flip')
    }
  }

  const filteredCreatures = CREATURE_ROSTER.filter((c) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'secret') return Boolean(c.isSecret)
    return c.family === activeFilter
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="almanac-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          borderLeft: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          overflowY: 'auto',
          padding: '24px 20px',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div>
            <h2 id="almanac-title" style={{ margin: 0, fontSize: '22px', fontWeight: 900 }}>
              📖 Almanac of Wonder
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#cbd5e1' }}>
              Collection Progress: <strong>{stats.discoveredCount}</strong> / {stats.totalSpecies} Discovered ({stats.progressPercent}%)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Almanac"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Milestone Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: `${stats.progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Family Filter Chips */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '16px',
          }}
        >
          {(
            [
              { id: 'all', label: 'All', icon: '🌟' },
              { id: 'lumina', label: 'Lumina', icon: '☀️' },
              { id: 'flora', label: 'Flora', icon: '🌿' },
              { id: 'aero', label: 'Aero', icon: '💨' },
              { id: 'pyro', label: 'Pyro', icon: '🔥' },
              { id: 'terra', label: 'Terra', icon: '🪴' },
              { id: 'cosmic', label: 'Cosmic', icon: '✨' },
              { id: 'secret', label: 'Secret', icon: '🔮' },
            ] as const
          ).map((filter) => {
            const isActive = activeFilter === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  sfxService.play('card_flip')
                  setActiveFilter(filter.id)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: isActive ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#f3e8ff' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minHeight: '36px',
                }}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Creature Detail Dossier */}
        {selectedCreature && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: `1.5px solid ${selectedCreature.primaryColor}`,
              borderRadius: '20px',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: `0 0 20px ${selectedCreature.glowColor}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: selectedCreature.glowColor,
                  border: `2px solid ${selectedCreature.primaryColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                {discoveredCreatureIds.includes(selectedCreature.id) ? selectedCreature.emoji : '❓'}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  {discoveredCreatureIds.includes(selectedCreature.id)
                    ? metadataMap[selectedCreature.id]?.customNickname || selectedCreature.name
                    : 'Mysterious Creature'}
                </h3>
                <span style={{ fontSize: '12px', color: selectedCreature.primaryColor, fontWeight: 600 }}>
                  {selectedCreature.speciesTitle}
                </span>
              </div>
            </div>

            {discoveredCreatureIds.includes(selectedCreature.id) ? (
              <>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4, fontStyle: 'italic' }}>
                  "{selectedCreature.loreSnippet}"
                </p>

                {/* Science of Wonder Concept */}
                {selectedCreature.scientificConcept && (
                  <div
                    style={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      marginBottom: '10px',
                      fontSize: '12px',
                    }}
                  >
                    <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#38bdf8' }}>
                      💡 Science: {selectedCreature.scientificConcept.name}
                    </p>
                    <p style={{ margin: '0 0 4px', color: '#e2e8f0', lineHeight: 1.3 }}>
                      {selectedCreature.scientificConcept.explanation}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#93c5fd' }}>
                      🔍 {selectedCreature.scientificConcept.funFact}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
                  <span>🍽️ <strong>Favorite:</strong> {selectedCreature.favoriteFood}</span>
                  <span>⭐ <strong>Rarity:</strong> {selectedCreature.rarity}</span>
                  {metadataMap[selectedCreature.id]?.discoveryCount && (
                    <span>🔄 <strong>Brews:</strong> {metadataMap[selectedCreature.id].discoveryCount}</span>
                  )}
                </div>
              </>
            ) : (
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
                  🔍 DISCOVERY CLUE:
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#e2e8f0', fontStyle: 'italic' }}>
                  "{selectedCreature.clue}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Creature Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px',
          }}
        >
          {filteredCreatures.map((creature) => {
            const isDiscovered = discoveredCreatureIds.includes(creature.id)
            const isSelected = selectedCreature?.id === creature.id
            const customNick = metadataMap[creature.id]?.customNickname

            return (
              <button
                key={creature.id}
                type="button"
                onClick={() => handleInspect(creature, isDiscovered)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 8px',
                  borderRadius: '16px',
                  background: isDiscovered
                    ? isSelected
                      ? 'rgba(99, 102, 241, 0.35)'
                      : 'rgba(30, 41, 59, 0.65)'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: isSelected
                    ? `2px solid ${creature.primaryColor}`
                    : isDiscovered
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px dashed rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  minHeight: '110px',
                  transition: 'transform 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isDiscovered ? creature.glowColor : 'rgba(255, 255, 255, 0.05)',
                    border: isDiscovered ? `1.5px solid ${creature.primaryColor}` : '1px dashed rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isDiscovered ? '24px' : '18px',
                    marginBottom: '6px',
                    filter: isDiscovered ? 'none' : 'grayscale(1) opacity(0.5)',
                  }}
                >
                  {isDiscovered ? creature.emoji : '❓'}
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDiscovered ? '#f8fafc' : '#94a3b8',
                    lineHeight: 1.2,
                  }}
                >
                  {isDiscovered ? customNick || creature.name : 'Unknown'}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: isDiscovered ? creature.primaryColor : '#64748b',
                    textTransform: 'capitalize',
                    marginTop: '2px',
                  }}
                >
                  {creature.rarity}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
