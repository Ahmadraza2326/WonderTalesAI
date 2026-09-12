import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RoboPathAcademy } from '../components/playroom/stations/RoboPathAcademy'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import type { DifficultyTier } from '../types/experience'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
import type { ChildProfile } from '../types/childProfile'

export const RoboPathPage: React.FC = () => {
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
        // Fallback for offline/guest
      }
    }
    loadChild()
  }, [user])

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
        className="robopath-page-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <RoboPathAcademy
          initialDifficulty={diffParam}
          childId={activeChild?.id || 'guest'}
          onBack={() => navigate('/games')}
        />
      </div>
    </div>
  )
}
