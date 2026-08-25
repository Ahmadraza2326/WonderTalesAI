import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
import type { ChildProfile } from '../types/childProfile'
import { GameUniverseHub } from '../components/games/universe/GameUniverseHub'
import {
  calculateAdventureProgress,
  type ChildAdventureProgress,
} from '../services/progressionService'

export function GameUniversePage() {
  const { user } = useAuth()
  const [adventureProgress, setAdventureProgress] = useState<ChildAdventureProgress>(() =>
    calculateAdventureProgress(null)
  )

  useEffect(() => {
    async function loadChildAndProgress() {
      if (!user) return

      try {
        const { data, error } = await childProfileService.getChildProfiles(user.id)
        if (!error && data && data.length > 0) {
          const child: ChildProfile = data[0]

          let creatureCount = 0
          let machineCount = 0
          let detectiveCount = 0
          let potionCount = 0

          // Read station discover records from browser storage
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              const savedCreatures = window.localStorage.getItem(
                `orbis_creature_lab_discovered_${child.id}`
              )
              if (savedCreatures) {
                const parsed = JSON.parse(savedCreatures)
                if (Array.isArray(parsed)) creatureCount = parsed.length
              }

              const savedMachines = window.localStorage.getItem(
                `orbis_magic_machine_completed_${child.id}`
              )
              if (savedMachines) {
                const parsed = JSON.parse(savedMachines)
                if (Array.isArray(parsed)) machineCount = parsed.length
              }

              const savedDetective = window.localStorage.getItem(
                `orbis_mystery_detective_solved_${child.id}`
              )
              if (savedDetective) {
                const parsed = JSON.parse(savedDetective)
                if (Array.isArray(parsed)) detectiveCount = parsed.length
              }

              const savedPotions = window.localStorage.getItem(
                `orbis_potion_scales_completed_${child.id}`
              )
              if (savedPotions) {
                const parsed = JSON.parse(savedPotions)
                if (Array.isArray(parsed)) potionCount = parsed.length
              }
            } catch {
              // Ignore JSON parse errors safely
            }
          }

          const progress = calculateAdventureProgress(child, {
            creatureDiscoveriesCount: creatureCount,
            machineCompletedCount: machineCount,
            detectiveSolvedCount: detectiveCount,
            potionBrewedCount: potionCount,
          })

          setAdventureProgress(progress)
        }
      } catch {
        // Safe fallback to default progress
      }
    }

    void loadChildAndProgress()
  }, [user])

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GameUniverseHub adventureProgress={adventureProgress} />
    </div>
  )
}
