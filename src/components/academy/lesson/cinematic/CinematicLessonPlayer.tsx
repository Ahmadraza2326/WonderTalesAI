import React, { useState } from 'react'
import type { CinematicLesson } from '../../../../types/cinematicLesson'
import { LessonSceneRenderer } from './LessonSceneRenderer'
import { RealmStageBackdrop } from './RealmStageBackdrop'
import { GlassPanel, MagicalButton, LessonProgressRail, RewardChip } from '../../../ui/design'
import { GuideCharacterSvg } from '../../guide/GuideCharacterSvg'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'
import { narrationDirector } from '../../../../services/audio/narrationDirector'

interface CinematicLessonPlayerProps {
  lesson: CinematicLesson
  onComplete: (xp: number, stars: number) => void
  onOpenAskOrbis?: () => void
  onExit?: () => void
}

export const CinematicLessonPlayer: React.FC<CinematicLessonPlayerProps> = ({
  lesson,
  onComplete,
  onOpenAskOrbis,
  onExit,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isAudioPrimed, setIsAudioPrimed] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)

  const currentScene = lesson.scenes[currentSceneIndex]
  const totalScenes = lesson.scenes.length

  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted
    setIsAudioMuted(nextMuted)
    narrationDirector.setMuted(nextMuted)
  }

  const handleStartLesson = () => {
    setIsAudioPrimed(true)
    sfxService.play('star_pop')
    HapticsService.medium()
    if (currentScene?.guideDialogue) {
      narrationDirector.speak(currentScene.guideDialogue, lesson.guideId)
    }
  }

  const handleNextScene = () => {
    const nextIndex = currentSceneIndex + 1
    if (nextIndex < totalScenes) {
      setCurrentSceneIndex(nextIndex)
    } else {
      // Completed all scenes
      sfxService.play('victory_fanfare')
      HapticsService.success()
      onComplete(lesson.rewardXP, lesson.rewardStars)
    }
  }

  return (
    <RealmStageBackdrop subjectId={lesson.subjectId}>
      {/* 1. Floating Sticky Lesson Progress Rail */}
      <LessonProgressRail
        currentSceneIndex={currentSceneIndex}
        totalScenes={totalScenes}
        lessonTitle={lesson.title}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenAskOrbis={onOpenAskOrbis}
        onExit={onExit}
        style={{ marginBottom: '24px' }}
      />

      {/* 2. Welcome & Audio Primer Gate */}
      {!isAudioPrimed ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '440px',
            width: '100%',
            padding: '20px 12px',
            boxSizing: 'border-box',
          }}
        >
          <GlassPanel
            variant="hero"
            style={{
              padding: '40px 28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              maxWidth: '540px',
              width: '100%',
            }}
          >
            {/* Guide Companion Actor Welcome Stage */}
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
              <GuideCharacterSvg
                guideId={lesson.guideId}
                emotion="excited"
                pose="teaching"
                size={104}
              />
            </div>

            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {lesson.gradeBand.toUpperCase().replace('_', ' ')} • {lesson.estimatedMinutes} MIN ADVENTURE
              </span>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: '6px 0 0',
                  fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                }}
              >
                {lesson.title}
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: '#cbd5e1',
                  margin: '10px 0 0',
                  lineHeight: 1.6,
                }}
              >
                {lesson.storyHook}
              </p>
            </div>

            {/* Estimated Rewards Preview */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <RewardChip type="xp" amount={lesson.rewardXP} />
              <RewardChip type="stars" amount={lesson.rewardStars} />
            </div>

            {/* Primary Tactile CTA */}
            <div style={{ marginTop: '8px' }}>
              <MagicalButton
                variant="cosmic"
                size="lg"
                onClick={handleStartLesson}
                soundCue="star_pop"
                style={{
                  minHeight: '52px',
                  padding: '14px 40px',
                  fontSize: '18px',
                  fontWeight: 800,
                }}
              >
                Begin Adventure
              </MagicalButton>
            </div>
          </GlassPanel>
        </div>
      ) : (
        /* 3. Active Scene Stage */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
            maxWidth: '860px',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {currentScene && (
            <LessonSceneRenderer
              scene={currentScene}
              gradeBand={lesson.gradeBand}
              onSceneComplete={handleNextScene}
            />
          )}
        </div>
      )}
    </RealmStageBackdrop>
  )
}
