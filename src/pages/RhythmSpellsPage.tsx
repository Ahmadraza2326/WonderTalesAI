import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RhythmSpellsConductor } from '../components/playroom/stations/RhythmSpellsConductor'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import type { DifficultyTier } from '../types/experience'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
import type { ChildProfile } from '../types/childProfile'
import { computeExplorerTitle } from '../services/progressionService'

export const RhythmSpellsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const diffParam = (searchParams.get('difficulty') as DifficultyTier) || 'easy'
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null)

  useEffect(() => {
    async function loadChild() {
      if (!user) return
      try {
        const { data } = await childProfileService.getChildProfiles(user.id)
        if (data && data.length > 0) {
          setActiveChild(data[0])
        }
      } catch {
        // Fallback
      }
    }
    loadChild()
  }, [user])

  const explorerLevel = computeExplorerTitle(activeChild?.xp || 0).level

  return (
    <div
      style={{
        height: 'calc(100vh - 70px)',
        maxHeight: 'calc(100dvh - 70px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StickyBackButton fallbackTo="/games" label="Playroom Games" />
      <div
        className="rhythm-spells-page-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <RhythmSpellsConductor
          initialDifficulty={diffParam}
          explorerLevel={explorerLevel}
          childId={activeChild?.id}
          onBack={() => navigate('/games')}
        />
      </div>
    </div>
  )
}

export default RhythmSpellsPage
