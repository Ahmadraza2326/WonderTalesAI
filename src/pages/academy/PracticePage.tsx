import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAcademyPracticeSet } from '../../services/academy/curriculum/practiceData'
import { PracticeQuestionRenderer } from '../../components/academy/practice/PracticeQuestionRenderer'
import { VictoryCelebrationModal } from '../../components/experience/VictoryCelebrationModal'
import { ParticleField } from '../../components/ui/design'
import { useActivityEconomy } from '../../hooks/useActivityEconomy'
import { useChildProfiles } from '../../hooks/useChildProfiles'
import { getAcademySkill } from '../../services/academy/curriculum/curriculumRegistry'
import { saveSkillProgress, calculateSkillMastery } from '../../services/academy/masteryService'

export const PracticePage: React.FC = () => {
  const { practiceSetId } = useParams<{ practiceSetId: string }>()
  const navigate = useNavigate()
  const { selectedProfile } = useChildProfiles()
  const practiceSet = getAcademyPracticeSet(practiceSetId || '')
  const [showVictory, setShowVictory] = useState(false)
  const [results, setResults] = useState<{ scorePercent: number; correctCount: number; total: number } | null>(null)

  const activeChildId = selectedProfile?.id || 'guest'

  const { completeActivity } = useActivityEconomy({
    childId: activeChildId,
    activityType: 'academy_practice',
    activityId: `academy_practice_${practiceSetId}`,
  })

  if (!practiceSet) {
    return (
      <div style={{ padding: '32px', color: '#ffffff', textAlign: 'center' }}>
        <h2>Practice set not found</h2>
        <button onClick={() => navigate('/academy')}>← Return to Academy</button>
      </div>
    )
  }

  const handleFinishPractice = async (summary: { scorePercent: number; correctCount: number; total: number }) => {
    setResults(summary)
    setShowVictory(true)

    // Calculate mastery and save progress record
    const { score, tier } = calculateSkillMastery({
      attemptsCount: summary.total,
      correctCount: summary.correctCount,
      hintsUsedCount: 0,
      daysSinceLastPracticed: 0,
    })

    const skill = getAcademySkill(practiceSet.skillId)
    const subjectId = skill?.subjectId || 'math'

    saveSkillProgress({
      childId: activeChildId,
      skillId: practiceSet.skillId,
      subjectId: subjectId,
      masteryLevel: tier,
      masteryScore: score,
      attemptsCount: summary.total,
      correctCount: summary.correctCount,
      hintsUsedCount: 0,
      streak: 1,
      lastPracticedAt: new Date().toISOString(),
    })

    try {
      await completeActivity({
        xpAmount: practiceSet.rewardXP,
        starsAmount: practiceSet.rewardStars,
      })
    } catch {
      // Safe fallback
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
        color: '#ffffff',
        padding: '24px 16px 64px',
        boxSizing: 'border-box',
      }}
    >
      <ParticleField count={30} particleType="stardust" speed={0.4} color="#a855f7" />

      <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto 16px', zIndex: 1 }}>
        <button
          onClick={() => navigate(`/academy/skill/${practiceSet.skillId}`)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Exit Practice
        </button>
      </div>

      <div style={{ zIndex: 1, width: '100%' }}>
        <PracticeQuestionRenderer
          practiceSet={practiceSet}
          onFinished={handleFinishPractice}
        />
      </div>

      <VictoryCelebrationModal
        isOpen={showVictory}
        onNextLevel={() => {
          setShowVictory(false)
          navigate(`/academy/skill/${practiceSet.skillId}`)
        }}
        starsEarned={practiceSet.rewardStars}
        xpEarned={practiceSet.rewardXP}
        title="Practice Set Complete!"
        subtitle={
          results
            ? `You answered ${results.correctCount}/${results.total} questions correctly (${results.scorePercent}%)!`
            : 'Great job!'
        }
      />
    </div>
  )
}
