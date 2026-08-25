import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PotionScales } from '../components/playroom/stations/PotionScales'
import { PageContainer } from '../components/ui/PageContainer'
import type { DifficultyTier } from '../types/experience'

export const PotionScalesPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const diffParam = (searchParams.get('difficulty') as DifficultyTier) || 'easy'

  return (
    <PageContainer>
      <div className="potion-scales-page-wrapper">
        <PotionScales
          initialDifficulty={diffParam}
          onBack={() => navigate('/games')}
        />
      </div>
    </PageContainer>
  )
}
