import React, { useMemo } from 'react'
import { useChildProfiles } from '../hooks/useChildProfiles'
import { calculateAdventureProgress } from '../services/progressionService'
import { MasterCelestialOverworld } from '../components/overworld/celestial/MasterCelestialOverworld'

export const OverworldPage: React.FC = () => {
  const { selectedProfile } = useChildProfiles()

  const adventureProgress = useMemo(() => {
    let creatureCount = 0
    let machineCount = 0
    let detectiveCount = 0
    let potionCount = 0

    if (typeof window !== 'undefined' && window.localStorage && selectedProfile?.id) {
      try {
        const c = window.localStorage.getItem(`orbis_creature_lab_discovered_${selectedProfile.id}`)
        if (c) creatureCount = JSON.parse(c).length

        const m = window.localStorage.getItem(`orbis_magic_machine_completed_${selectedProfile.id}`)
        if (m) machineCount = JSON.parse(m).length

        const d = window.localStorage.getItem(`orbis_mystery_detective_solved_${selectedProfile.id}`)
        if (d) detectiveCount = JSON.parse(d).length

        const p = window.localStorage.getItem(`orbis_potion_scales_completed_${selectedProfile.id}`)
        if (p) potionCount = JSON.parse(p).length
      } catch {
        // Fallback safely
      }
    }

    return calculateAdventureProgress(selectedProfile, {
      creatureDiscoveriesCount: creatureCount,
      machineCompletedCount: machineCount,
      detectiveSolvedCount: detectiveCount,
      potionBrewedCount: potionCount,
    })
  }, [selectedProfile])

  /* No wrapper div — MasterCelestialOverworld uses position: absolute to fill the viewport */
  return <MasterCelestialOverworld adventureProgress={adventureProgress} />
}
