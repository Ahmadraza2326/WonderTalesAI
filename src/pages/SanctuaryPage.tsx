import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildProfiles } from '../hooks/useChildProfiles'
import { sanctuaryService } from '../services/games/sanctuaryService'
import type {
  SanctuaryData,
  SanctuaryBiome,
  FeedResult,
  PetResult,
} from '../types/games/sanctuary'
import type { CreatureSpecies } from '../types/games/creatureLab'
import { getCreatureById } from '../services/games/creatureLabEngine'
import { SanctuaryHabitat } from '../components/sanctuary/SanctuaryHabitat'
import { CreatureCareCard } from '../components/sanctuary/CreatureCareCard'
import { sfxService } from '../services/audio/sfxService'

export function SanctuaryPage() {
  const navigate = useNavigate()
  const { profiles, selectedProfile, selectProfile } = useChildProfiles()
  const activeChild = selectedProfile || (profiles.length > 0 ? profiles[0] : null)
  const childId = activeChild?.id || 'guest'

  const [sanctuaryData, setSanctuaryData] = useState<SanctuaryData>(() =>
    sanctuaryService.getSanctuaryData(childId)
  )

  const [discoveredCreatures, setDiscoveredCreatures] = useState<CreatureSpecies[]>(() =>
    sanctuaryService.getDiscoveredCreatures(childId)
  )

  const [selectedCreatureId, setSelectedCreatureId] = useState<string | null>(null)

  const refreshSanctuary = useCallback(() => {
    const data = sanctuaryService.getSanctuaryData(childId)
    const creatures = sanctuaryService.getDiscoveredCreatures(childId)
    setSanctuaryData(data)
    setDiscoveredCreatures(creatures)

    // Select first creature by default if none selected
    if (creatures.length > 0 && (!selectedCreatureId || !creatures.some((c) => c.id === selectedCreatureId))) {
      setSelectedCreatureId(creatures[0].id)
    } else if (creatures.length === 0) {
      setSelectedCreatureId(null)
    }
  }, [childId, selectedCreatureId])

  useEffect(() => {
    refreshSanctuary()
  }, [childId, refreshSanctuary])

  const handleBiomeChange = (biome: SanctuaryBiome) => {
    sanctuaryService.setActiveBiome(childId, biome)
    setSanctuaryData((prev) => ({ ...prev, activeBiome: biome }))
  }

  const handlePet = (): PetResult => {
    if (!selectedCreatureId) {
      return {
        happinessBefore: 0,
        happinessAfter: 0,
        happinessGained: 0,
        friendshipXpGained: 0,
        totalPetted: 0,
        reactionSound: 'creature_pet',
        reactionEmoji: '💖',
        message: 'No creature selected',
      }
    }
    const result = sanctuaryService.petCreature(childId, selectedCreatureId)
    setSanctuaryData(sanctuaryService.getSanctuaryData(childId))
    return result
  }

  const handleFeed = (treatId: string): FeedResult => {
    if (!selectedCreatureId) {
      return {
        success: false,
        isFavorite: false,
        happinessBefore: 0,
        happinessAfter: 0,
        happinessGained: 0,
        friendshipXpGained: 0,
        leveledUp: false,
        newLevel: 1,
        message: 'No creature selected',
      }
    }
    const result = sanctuaryService.feedCreature(childId, selectedCreatureId, treatId)
    setSanctuaryData(sanctuaryService.getSanctuaryData(childId))
    return result
  }

  const handleRename = (nickname: string) => {
    if (!selectedCreatureId) return
    sanctuaryService.setNickname(childId, selectedCreatureId, nickname)
    setSanctuaryData(sanctuaryService.getSanctuaryData(childId))
  }

  const selectedCreature = selectedCreatureId ? getCreatureById(selectedCreatureId) : null
  const selectedCreatureState = selectedCreatureId
    ? sanctuaryService.getOrCreateCreatureState(sanctuaryData, selectedCreatureId).state
    : null

  // Calculate Sanctuary average happiness
  const states = Object.values(sanctuaryData.creatures)
  const averageHappiness =
    states.length > 0
      ? Math.round(states.reduce((acc, curr) => acc + curr.happiness, 0) / states.length)
      : 80

  return (
    <div
      className="sanctuary-page-container"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 16px 60px',
      }}
    >
      {/* Top Header & Navigation Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>🐾</span>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0, color: '#f8f7ff' }}>
                The Living Creature Sanctuary
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Care for, pet, and feed your hatched starlight companions in their magical habitat.
              </p>
            </div>
          </div>
        </div>

        {/* Action Shortcuts & Child Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Child Profile Switcher */}
          {profiles.length > 1 && (
            <select
              value={activeChild?.id}
              onChange={(e) => {
                sfxService.play('card_flip')
                selectProfile(e.target.value)
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'inherit',
                border: '1px solid var(--border)',
                fontWeight: 700,
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id} style={{ background: '#191a35' }}>
                  {p.avatar} {p.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => {
              sfxService.play('card_flip')
              navigate('/overworld')
            }}
            className="button button-secondary"
            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700 }}
          >
            🗺️ Overworld Map
          </button>

          <button
            type="button"
            onClick={() => {
              sfxService.play('star_pop')
              navigate('/games/creature-lab')
            }}
            className="button button-primary"
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
            }}
          >
            🧪 Hatch New in Lab
          </button>
        </div>
      </div>

      {/* Sanctuary Stat Badges Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: 'var(--surface-card, #191a35)',
            padding: '14px 18px',
            borderRadius: '18px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '26px' }}>🌟</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#fbbf24' }}>
              {discoveredCreatures.length} / 24
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Hatched Species
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface-card, #191a35)',
            padding: '14px 18px',
            borderRadius: '18px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '26px' }}>💖</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#34d399' }}>
              {averageHappiness}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Sanctuary Happiness
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface-card, #191a35)',
            padding: '14px 18px',
            borderRadius: '18px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '26px' }}>🤲</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#a855f7' }}>
              {sanctuaryData.totalPatsEver}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Total Loving Pats
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface-card, #191a35)',
            padding: '14px 18px',
            borderRadius: '18px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '26px' }}>🍪</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8' }}>
              {sanctuaryData.totalFeedingsEver}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Treats Shared
            </div>
          </div>
        </div>
      </div>

      {/* Main Sanctuary Interactive Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedCreature ? '1.2fr 0.8fr' : '1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left: Habitat Canvas */}
        <SanctuaryHabitat
          creatures={discoveredCreatures}
          creatureStates={sanctuaryData.creatures}
          activeBiome={sanctuaryData.activeBiome}
          onBiomeChange={handleBiomeChange}
          selectedCreatureId={selectedCreatureId}
          onSelectCreature={(cId) => setSelectedCreatureId(cId)}
          onNavigateToLab={() => navigate('/games/creature-lab')}
        />

        {/* Right: Creature Care Card / Details */}
        {selectedCreature && selectedCreatureState && (
          <CreatureCareCard
            childId={childId}
            creature={selectedCreature}
            creatureState={selectedCreatureState}
            treatInventory={sanctuaryData.treats}
            onFeed={handleFeed}
            onPet={handlePet}
            onRename={handleRename}
            onClose={() => setSelectedCreatureId(null)}
          />
        )}
      </div>
    </div>
  )
}
