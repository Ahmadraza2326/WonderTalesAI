import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
import type { ChildProfile } from '../types/childProfile'
import { CreatureLab } from '../components/games/creature-lab/CreatureLab'
import { StickyBackButton } from '../components/layout/StickyBackButton'

import { computeExplorerTitle } from '../services/progressionService'

export function CreatureLabPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null)
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadChild() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await childProfileService.getChildProfiles(user.id)
        if (!error && data && data.length > 0) {
          setActiveChild(data[0])
        }
      } catch {
        // Fallback to guest mode
      } finally {
        setIsLoading(false)
      }
    }

    void loadChild()
  }, [user])

  const explorerLevel = computeExplorerTitle(activeChild?.xp || 0).level

  return (
    <div
      style={{
        height: 'calc(100vh - 75px)',
        maxHeight: 'calc(100vh - 75px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StickyBackButton fallbackTo="/games" label="Playroom Games" />
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          transform: 'scale(0.95)',
          transformOrigin: 'top center',
        }}
      >
        <CreatureLab
          childId={activeChild?.id}
          childName={activeChild?.name || 'Explorer'}
          explorerLevel={explorerLevel}
          onBack={() => navigate('/games')}
        />
      </div>
    </div>
  )
}
