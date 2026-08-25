import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MysteryDetective } from '../components/playroom/stations/MysteryDetective'
import { PageContainer } from '../components/ui/PageContainer'
import type { DifficultyTier } from '../types/experience'

export const MysteryDetectivePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const diffParam = (searchParams.get('difficulty') as DifficultyTier) || 'easy'

  return (
    <PageContainer>
      <div className="mystery-detective-page-wrapper">
        <MysteryDetective
          initialDifficulty={diffParam}
          onBack={() => navigate('/games')}
        />
      </div>
    </PageContainer>
  )
}
