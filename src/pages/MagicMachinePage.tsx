import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MagicMachineLab } from '../components/playroom/stations/MagicMachineLab'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import type { DifficultyTier } from '../types/experience'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
import type { ChildProfile } from '../types/childProfile'
import { computeExplorerTitle } from '../services/progressionService'

export const MagicMachinePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const diffParam = (searchParams.get('difficulty') as DifficultyTier) || 'easy'
  const puzzleParam = searchParams.get('puzzle') || undefined
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
        height: 'calc(100vh - 75px)',
        maxHeight: 'calc(100vh - 75px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StickyBackButton fallbackTo="/games" label="Playroom Games" />
      <div
        className="magic-machine-page-wrapper"
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
        <MagicMachineLab
          initialDifficulty={diffParam}
          puzzleId={puzzleParam}
          explorerLevel={explorerLevel}
          onExit={() => navigate('/games')}
        />
      </div>
    </div>
  )
}
