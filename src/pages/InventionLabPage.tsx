import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { InventionLab } from '../components/playroom/stations/InventionLab'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import type { DifficultyTier } from '../types/experience'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
import type { ChildProfile } from '../types/childProfile'
import { computeExplorerTitle } from '../services/progressionService'

export const InventionLabPage: React.FC = () => {
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
        minHeight: 'calc(100vh - 75px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StickyBackButton fallbackTo="/games" label="Playroom Games" />
      <div
        className="invention-lab-page-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingBottom: '2rem',
        }}
      >
        <InventionLab
          initialDifficulty={diffParam}
          explorerLevel={explorerLevel}
          childId={activeChild?.id || null}
          onBack={() => navigate('/games')}
        />
      </div>
    </div>
  )
}
