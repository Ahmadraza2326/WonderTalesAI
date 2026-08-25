import React, { useState, useEffect, useCallback } from 'react'
import type {
  Essence,
  CauldronState,
  BrewResult,
  CreatureSpecies,
  DiscoveredCreatureMetadata,
} from '../../../types/games/creatureLab'
import {
  evaluateBrew,
  getAllEssences,
  getEssenceById,
  migrateGuestDiscoveriesToChild,
} from '../../../services/games/creatureLabEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { GameUniverseHUD } from '../universe/GameUniverseHUD'
import { EssenceShelf } from './EssenceShelf'
import { CauldronStage } from './CauldronStage'
import { CreatureHatchModal } from './CreatureHatchModal'
import { HappyAccidentModal } from './HappyAccidentModal'
import { AlmanacDrawer } from './AlmanacDrawer'

interface CreatureLabProps {
  childId?: string
  childName?: string
  storyContext?: {
    storyId: string
    storyTitle: string
  }
  onBack?: () => void
}

export const CreatureLab: React.FC<CreatureLabProps> = ({
  childId,
  childName = 'Explorer',
  storyContext,
  onBack,
}) => {
  const currentProfile = childId || 'guest'
  const storageKey = `orbis_creature_lab_discovered_${currentProfile}`
  const stardustKey = `orbis_creature_lab_stardust_${currentProfile}`
  const metadataKey = `orbis_creature_lab_metadata_${currentProfile}`

  // 1. Guest Data Migration on child profile connection
  useEffect(() => {
    if (childId && childId !== 'guest') {
      const migration = migrateGuestDiscoveriesToChild(childId)
      if (migration.migratedCount > 0) {
        setAriaAnnouncement(`Transferred ${migration.migratedCount} guest discoveries to ${childName}'s profile!`)
      }
    }
  }, [childId, childName])

  // Persistent discovered creature IDs & crafting stardust
  const [discoveredIds, setDiscoveredIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(storageKey)
        if (saved) return JSON.parse(saved)
      } catch {
        // Fallback to empty array
      }
    }
    return []
  })

  const [stardust, setStardust] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(stardustKey)
        if (saved) return Number(saved) || 0
      } catch {
        // Fallback
      }
    }
    return 10 // Starting starter stardust
  })

  const [metadataMap, setMetadataMap] = useState<Record<string, DiscoveredCreatureMetadata>>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(metadataKey)
        if (saved) return JSON.parse(saved)
      } catch {
        // Fallback
      }
    }
    return {}
  })

  // Cauldron & Mixing State
  const [selectedEssences, setSelectedEssences] = useState<Essence[]>([])
  const [cauldronState, setCauldronState] = useState<CauldronState>('idle')
  const [activeBrewResult, setActiveBrewResult] = useState<BrewResult | null>(null)
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false)
  const [pendingCreatureForReward, setPendingCreatureForReward] = useState<CreatureSpecies | null>(null)
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('')

  // Save discovered IDs, stardust, & metadata
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(discoveredIds))
        window.localStorage.setItem(stardustKey, String(stardust))
        window.localStorage.setItem(metadataKey, JSON.stringify(metadataMap))
      } catch {
        // Ignore storage errors
      }
    }
  }, [discoveredIds, stardust, metadataMap, storageKey, stardustKey, metadataKey])

  // Reward economy integration
  const currentActivityId = pendingCreatureForReward
    ? `discovery_${pendingCreatureForReward.id}`
    : 'creature_lab_session'

  const { completeActivity } = useActivityEconomy({
    childId,
    activityType: 'creature_lab',
    activityId: currentActivityId,
  })

  // Handle Essence Selection (Max 3 slots)
  const handleSelectEssence = useCallback(
    (essence: Essence) => {
      if (selectedEssences.length >= 3 || cauldronState === 'stirring' || cauldronState === 'revealing') {
        return
      }

      sfxService.play('essence_drop')
      const updated = [...selectedEssences, essence]
      setSelectedEssences(updated)

      if (updated.length >= 2) {
        setCauldronState('ready_to_brew')
        setAriaAnnouncement(`Added ${essence.name}. Cauldron has ${updated.length} essences! Ready to stir.`)
      } else {
        setCauldronState('idle')
        setAriaAnnouncement(`Added ${essence.name}. Select at least 1 more essence.`)
      }
    },
    [selectedEssences, cauldronState]
  )

  const handleDropEssenceById = useCallback(
    (essenceId: string) => {
      const essence = getEssenceById(essenceId)
      if (essence) {
        handleSelectEssence(essence)
      }
    },
    [handleSelectEssence]
  )

  const handleRemoveEssence = (index: number) => {
    sfxService.play('card_flip')
    const removed = selectedEssences[index]
    const updated = selectedEssences.filter((_, i) => i !== index)
    setSelectedEssences(updated)
    if (updated.length >= 2) {
      setCauldronState('ready_to_brew')
    } else {
      setCauldronState('idle')
    }
    setAriaAnnouncement(`Removed ${removed?.name || 'essence'} from the cauldron.`)
  }

  const handleResetCauldron = () => {
    sfxService.play('card_flip')
    setSelectedEssences([])
    setCauldronState('idle')
    setActiveBrewResult(null)
    setAriaAnnouncement('Cauldron cleared.')
  }

  // Keyboard shortcut listener (1-5 for essences)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cauldronState === 'stirring' || cauldronState === 'revealing' || isAlmanacOpen || activeBrewResult) {
        return
      }

      const essences = getAllEssences()
      const keyNum = parseInt(e.key, 10)
      if (keyNum >= 1 && keyNum <= essences.length) {
        const targetEssence = essences[keyNum - 1]
        if (targetEssence && selectedEssences.length < 3) {
          handleSelectEssence(targetEssence)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cauldronState, isAlmanacOpen, activeBrewResult, selectedEssences, handleSelectEssence])

  // Active Stirring & Hatching Choreography
  const handleStirCauldron = async () => {
    if (selectedEssences.length < 2) return

    setCauldronState('stirring')
    setAriaAnnouncement('Stirring the cauldron! Starlight essences are reacting...')

    // 1.2s stirring animation
    setTimeout(async () => {
      setCauldronState('revealing')

      const essenceIds = selectedEssences.map((e) => e.id)
      const result = evaluateBrew(essenceIds, discoveredIds, Date.now())

      if (result.type === 'creature' && result.creature) {
        setPendingCreatureForReward(result.creature)

        const cId = result.creature.id
        const prevMeta = metadataMap[cId]
        const newDiscoveryCount = (prevMeta?.discoveryCount || 0) + 1

        if (result.isNewDiscovery) {
          setDiscoveredIds((prev) => [...prev, cId])
          setAriaAnnouncement(`Magical Hatching! You discovered ${result.creature.name}!`)
        } else {
          setAriaAnnouncement(`You re-hatched ${result.creature.name}!`)
        }

        setMetadataMap((prev) => ({
          ...prev,
          [cId]: {
            creatureId: cId,
            discoveredAt: prevMeta?.discoveredAt || new Date().toISOString(),
            recipeEssences: essenceIds,
            discoveryCount: newDiscoveryCount,
            customNickname: prevMeta?.customNickname,
          },
        }))

        // Award rewards into authoritative ledger
        await completeActivity({
          xpAmount: result.xpAwarded,
          starsAmount: result.starsAwarded,
        })
      } else if (result.type === 'happy_accident' && result.reaction) {
        setAriaAnnouncement(`Magic Reaction! You created ${result.reaction.name}!`)
      }

      // Add earned stardust
      setStardust((prev) => prev + result.stardustAwarded)
      setActiveBrewResult(result)
      setCauldronState('hatched')
    }, 1200)
  }

  const handleCloseModalAndContinue = (customNickname?: string) => {
    if (pendingCreatureForReward && customNickname) {
      setMetadataMap((prev) => {
        const cId = pendingCreatureForReward.id
        const existing = prev[cId]
        if (!existing) return prev
        return {
          ...prev,
          [cId]: {
            ...existing,
            customNickname,
          },
        }
      })
    }

    setActiveBrewResult(null)
    setSelectedEssences([])
    setCauldronState('idle')
    setPendingCreatureForReward(null)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        width: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 70%, #090d16 100%)',
        color: '#ffffff',
        position: 'relative',
        overflowX: 'hidden',
        userSelect: 'none',
      }}
      aria-label="Creature Lab Alchemical Discovery"
    >
      {/* Screen Reader Live Region */}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
        {ariaAnnouncement}
      </div>

      {/* Persistent Game Universe HUD */}
      <GameUniverseHUD
        gameTitle="Creature Lab"
        gameIcon="🧪"
        childName={childName}
        stardustCount={stardust}
        onBack={onBack}
        customAction={
          <button
            type="button"
            onClick={() => {
              sfxService.play('card_flip')
              setIsAlmanacOpen(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
              border: '1.5px solid rgba(168, 85, 247, 0.5)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)',
              minHeight: '44px',
              transition: 'transform 0.15s ease',
            }}
            aria-label={`Open Almanac of Wonder. ${discoveredIds.length} creatures discovered.`}
          >
            <span>📖</span>
            <span>Almanac ({discoveredIds.length})</span>
          </button>
        }
      />

      {/* Main Play Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Story Context Banner if launched from a Story */}
        {storyContext && (
          <div
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#c7d2fe',
              marginBottom: '12px',
            }}
          >
            <span>✨</span>
            <span>
              Brewing companion essences inspired by: <strong>{storyContext.storyTitle}</strong>
            </span>
          </div>
        )}

        {/* Cauldron Stage Component */}
        <CauldronStage
          selectedEssences={selectedEssences}
          cauldronState={cauldronState}
          onStir={handleStirCauldron}
          onDropEssence={handleDropEssenceById}
          onRemoveEssence={handleRemoveEssence}
          onReset={handleResetCauldron}
        />

        {/* Essence Shelf (Draggable & Clickable Jars) */}
        <EssenceShelf
          selectedEssenceIds={selectedEssences.map((e) => e.id)}
          onSelectEssence={handleSelectEssence}
          disabled={selectedEssences.length >= 3 || cauldronState === 'stirring' || cauldronState === 'revealing'}
        />
      </main>

      {/* Creature Hatch Celebration Modal */}
      {activeBrewResult?.type === 'creature' && activeBrewResult.creature && (
        <CreatureHatchModal
          creature={activeBrewResult.creature}
          isNewDiscovery={activeBrewResult.isNewDiscovery}
          xpAwarded={activeBrewResult.xpAwarded}
          starsAwarded={activeBrewResult.starsAwarded}
          onCollectAndContinue={handleCloseModalAndContinue}
        />
      )}

      {/* Happy Accident Surprising Reaction Modal */}
      {activeBrewResult?.type === 'happy_accident' && activeBrewResult.reaction && (
        <HappyAccidentModal
          reaction={activeBrewResult.reaction}
          onContinue={() => handleCloseModalAndContinue()}
        />
      )}

      {/* Almanac Drawer Overlay */}
      <AlmanacDrawer
        isOpen={isAlmanacOpen}
        discoveredCreatureIds={discoveredIds}
        metadataMap={metadataMap}
        onClose={() => setIsAlmanacOpen(false)}
      />
    </div>
  )
}
