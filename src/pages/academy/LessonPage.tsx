import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAcademyLesson } from '../../services/academy/curriculum/lessonsData'
import { getCinematicLesson } from '../../services/academy/curriculum/cinematicLessonsData'
import { LessonViewer } from '../../components/academy/lesson/LessonViewer'
import { AskOrbisModal } from '../../components/academy/assistant/AskOrbisModal'
import { VictoryCelebrationModal } from '../../components/experience/VictoryCelebrationModal'
import { ParticleField } from '../../components/ui/design'
import { useActivityEconomy } from '../../hooks/useActivityEconomy'
import { useChildProfiles } from '../../hooks/useChildProfiles'
import { getAcademySkill } from '../../services/academy/curriculum/curriculumRegistry'
import { recordLessonCompletion } from '../../services/academy/masteryService'

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { selectedProfile } = useChildProfiles()
  const rawLesson = getAcademyLesson(lessonId || '')
  const cinematicLesson = getCinematicLesson(lessonId || '')

  const lesson = rawLesson || (cinematicLesson ? {
    id: cinematicLesson.id,
    skillId: cinematicLesson.skillId,
    title: cinematicLesson.title,
    subtitle: cinematicLesson.subtitle,
    estimatedMinutes: cinematicLesson.estimatedMinutes,
    blocks: [],
    rewardXP: cinematicLesson.rewardXP,
    rewardStars: cinematicLesson.rewardStars,
    summaryTakeaways: [],
  } : null)

  const [isAskOrbisOpen, setIsAskOrbisOpen] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [earnedRewards, setEarnedRewards] = useState({ xp: 0, stars: 0 })

  const activeChildId = selectedProfile?.id || 'guest'

  const { completeActivity } = useActivityEconomy({
    childId: activeChildId,
    activityType: 'academy_lesson',
    activityId: `academy_lesson_${lessonId}`,
  })

  if (!lesson) {
    return (
      <div style={{ padding: '32px', color: '#ffffff', textAlign: 'center' }}>
        <h2>Lesson not found</h2>
        <button onClick={() => navigate('/academy')}>← Return to Academy</button>
      </div>
    )
  }

  const handleCompleteLesson = async (xp: number, stars: number) => {
    setEarnedRewards({ xp, stars })
    setShowVictory(true)

    // Save mastery progress for the skill and domain
    const skill = getAcademySkill(lesson.skillId)
    const subjectId = skill?.subjectId || 'general_knowledge'
    recordLessonCompletion(lesson.skillId, subjectId, activeChildId)

    try {
      await completeActivity({ xpAmount: xp, starsAmount: stars })
    } catch {
      // Safe fallback
    }
  }

  const handleExit = () => {
    navigate(`/academy/skill/${lesson.skillId}`)
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        background: '#020617',
        color: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      {/* Fallback exit button and particles only if running legacy non-cinematic lesson */}
      {!cinematicLesson && (
        <>
          <ParticleField count={30} particleType="stardust" speed={0.4} color="#38bdf8" />
          <div style={{ maxWidth: '840px', width: '100%', margin: '16px auto 0', padding: '0 16px', zIndex: 1 }}>
            <button
              onClick={handleExit}
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
              ← Exit Lesson
            </button>
          </div>
        </>
      )}

      <div style={{ zIndex: 1, width: '100%' }}>
        <LessonViewer
          lesson={lesson}
          onComplete={handleCompleteLesson}
          onOpenAskOrbis={() => setIsAskOrbisOpen(true)}
          onExit={handleExit}
        />
      </div>

      <AskOrbisModal isOpen={isAskOrbisOpen} onClose={() => setIsAskOrbisOpen(false)} />

      <VictoryCelebrationModal
        isOpen={showVictory}
        onNextLevel={() => {
          setShowVictory(false)
          navigate(`/academy/skill/${lesson.skillId}`)
        }}
        starsEarned={earnedRewards.stars}
        xpEarned={earnedRewards.xp}
        title="Lesson Mastered!"
        subtitle="You completed all guided steps and reflections!"
      />
    </div>
  )
}
