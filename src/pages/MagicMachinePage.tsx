import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MagicMachineLab } from '../components/playroom/stations/MagicMachineLab'
import { PageContainer } from '../components/ui/PageContainer'
import type { DifficultyTier } from '../types/experience'

export const MagicMachinePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const diffParam = (searchParams.get('difficulty') as DifficultyTier) || 'easy'
  const puzzleParam = searchParams.get('puzzle') || undefined

  return (
    <PageContainer>
      <div className="magic-machine-page-wrapper">
        <MagicMachineLab
          initialDifficulty={diffParam}
          puzzleId={puzzleParam}
          onExit={() => navigate('/games')}
        />
      </div>
    </PageContainer>
  )
}
