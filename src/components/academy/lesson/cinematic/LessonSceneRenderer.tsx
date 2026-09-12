import React, { useState } from 'react'
import type { CinematicLessonScene } from '../../../../types/cinematicLesson'
import type { GradeBand } from '../../../../types/learningUniverse'
import { GuideTeachingLayer } from './GuideTeachingLayer'
import { VisualDemoRenderer } from './VisualDemoRenderer'
import { MicroQuestionRenderer } from './MicroQuestionRenderer'
import { TenFrameManipulative } from '../../practice/manipulatives/TenFrameManipulative'
import { NumberLineManipulative } from '../../practice/manipulatives/NumberLineManipulative'
import { StarArrayManipulative } from '../../practice/manipulatives/StarArrayManipulative'
import { PhonemeTileManipulative } from '../../practice/manipulatives/PhonemeTileManipulative'
import { FractionManipulative } from '../../practice/manipulatives/FractionManipulative'
import { BalanceScaleManipulative } from '../../practice/manipulatives/BalanceScaleManipulative'
import { CodeBlockManipulative } from '../../practice/manipulatives/CodeBlockManipulative'
import { LogicDeductionManipulative } from '../../practice/manipulatives/LogicDeductionManipulative'
import { InteractiveRoboGridSimulator } from '../../practice/manipulatives/InteractiveRoboGridSimulator'
import { SentenceRuneManipulative } from '../../practice/manipulatives/SentenceRuneManipulative'
import { RhythmDrumsManipulative } from '../../practice/manipulatives/RhythmDrumsManipulative'
import { ColorPaletteManipulative } from '../../practice/manipulatives/ColorPaletteManipulative'
import { MagicalButton } from '../../../ui/design'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface LessonSceneRendererProps {
  scene: CinematicLessonScene
  gradeBand?: GradeBand
  onSceneComplete: () => void
}

export const LessonSceneRenderer: React.FC<LessonSceneRendererProps> = ({
  scene,
  gradeBand = 'grade_1',
  onSceneComplete,
}) => {
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false)
  const [isManipulativeSolved, setIsManipulativeSolved] = useState(false)

  const isPreK = gradeBand === 'pre_k' || gradeBand === 'kindergarten'
  const requiresInteraction = Boolean(scene.microQuestion || scene.manipulative?.targetGoal)
  const canAdvance = !requiresInteraction || isQuestionAnswered || isManipulativeSolved

  const handleAdvance = () => {
    sfxService.play('card_flip')
    HapticsService.light()
    onSceneComplete()
  }

  const renderManipulative = () => {
    if (!scene.manipulative) return null

    switch (scene.manipulative.kind as string) {
      case 'star_array':
        return (
          <StarArrayManipulative
            initialRows={Number(scene.manipulative.initialState?.rows || 1)}
            initialCols={Number(scene.manipulative.initialState?.cols || 4)}
            targetRows={Number(scene.manipulative.targetGoal?.rows || 3)}
            targetCols={Number(scene.manipulative.targetGoal?.cols || 4)}
            interactive={scene.manipulative.interactive}
            onTargetReached={() => setIsManipulativeSolved(true)}
          />
        )
      case 'ten_frame':
        return (
          <TenFrameManipulative
            initialCount={Number(scene.manipulative.initialState?.count || 0)}
            targetCount={Number(scene.manipulative.targetGoal?.count || 10)}
            interactive={scene.manipulative.interactive}
            onTargetReached={() => setIsManipulativeSolved(true)}
          />
        )
      case 'number_line': {
        const start = Number(scene.manipulative.initialState?.start || 0)
        const target = scene.manipulative.targetGoal?.target !== undefined ? Number(scene.manipulative.targetGoal.target) : undefined
        const max = scene.manipulative.initialState?.max !== undefined ? Number(scene.manipulative.initialState.max) : (target !== undefined ? Math.max(10, target) : undefined)
        return (
          <NumberLineManipulative
            startNumber={start}
            targetNumber={target}
            maxNumber={max}
            jumpSteps={Number(scene.manipulative.initialState?.jumpSteps || 1)}
            interactive={scene.manipulative.interactive}
            onTargetReached={() => setIsManipulativeSolved(true)}
          />
        )
      }
      case 'phoneme_builder':
        return (
          <PhonemeTileManipulative
            targetWord={String(scene.manipulative.targetGoal?.word || 'CAT')}
            interactive={scene.manipulative.interactive}
            onWordComplete={() => setIsManipulativeSolved(true)}
          />
        )
      case 'fraction_bar':
        return (
          <FractionManipulative
            totalParts={Number(scene.manipulative.initialState?.denominator || 2)}
            selectedParts={Number(scene.manipulative.initialState?.numerator || 1)}
          />
        )
      case 'balance_scale':
        return (
          <BalanceScaleManipulative
            targetWeight={Number(scene.manipulative.targetGoal?.weight || 10)}
            onWeightChange={(w) => {
              if (w === Number(scene.manipulative?.targetGoal?.weight || 10)) {
                setIsManipulativeSolved(true)
              }
            }}
          />
        )
      case 'code_blocks':
        return (
          <CodeBlockManipulative
            initialTokens={Array.isArray(scene.manipulative.initialState?.blocks) ? (scene.manipulative.initialState.blocks as string[]) : ['FORWARD', 'FORWARD']}
            onSequenceChange={() => setIsManipulativeSolved(true)}
          />
        )
      case 'logic_clues':
        return (
          <LogicDeductionManipulative
            onSolutionSelected={() => setIsManipulativeSolved(true)}
          />
        )
      case 'sentence_runes':
        return (
          <SentenceRuneManipulative
            onVerbDiscovered={() => setIsManipulativeSolved(true)}
          />
        )
      case 'robot_grid':
        return (
          <InteractiveRoboGridSimulator
            onGoalReached={() => setIsManipulativeSolved(true)}
          />
        )
      case 'rhythm_drums':
        return (
          <RhythmDrumsManipulative
            tempo={Number(scene.manipulative.initialState?.tempo || 90)}
            targetCadence={String(scene.manipulative.targetGoal?.cadence || 'piano_to_forte')}
            interactive={scene.manipulative.interactive}
            onTargetReached={() => setIsManipulativeSolved(true)}
          />
        )
      case 'color_palette':
        return (
          <ColorPaletteManipulative
            primaryColor={String(scene.manipulative.initialState?.primaryColor || '#38bdf8')}
            secondaryColor={String(scene.manipulative.initialState?.secondaryColor || '#ef4444')}
            targetBlendedColor={String(scene.manipulative.targetGoal?.blended || '#6366f1')}
            interactive={scene.manipulative.interactive}
            onTargetReached={() => setIsManipulativeSolved(true)}
          />
        )
      default:
        return (
          <div
            style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center',
              color: '#cbd5e1',
            }}
          >
            <p style={{ margin: '0 0 12px' }}>✨ {scene.manipulative.instructions || 'Interactive Exercise'}</p>
            <MagicalButton variant="cosmic" size="sm" onClick={() => setIsManipulativeSolved(true)}>
              Complete Step ✓
            </MagicalButton>
          </div>
        )
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '840px',
        margin: '0 auto',
      }}
    >
      {/* 1. Guide Teaching Companion Layer */}
      <GuideTeachingLayer
        guideId={scene.guideId}
        emotion={scene.guideEmotion}
        dialogueText={scene.guideDialogue}
        narrationText={scene.narrationText}
        autoPlayAudio={isPreK || true}
        focusTargetId={scene.focusTargetId}
      />

      {/* 2. Visual Demonstration Stage */}
      {scene.visualDemo && (
        <div style={{ width: '100%' }}>
          <VisualDemoRenderer model={scene.visualDemo} />
        </div>
      )}

      {/* 3. Interactive Manipulative Stage */}
      {scene.manipulative && (
        <div style={{ width: '100%' }}>
          {renderManipulative()}
        </div>
      )}

      {/* 4. Micro-Question Comprehension Check */}
      {scene.microQuestion && (
        <div style={{ width: '100%' }}>
          <MicroQuestionRenderer
            question={scene.microQuestion}
            guideId={scene.guideId}
            onAnswerSubmitted={(isCorrect) => {
              if (isCorrect) setIsQuestionAnswered(true)
            }}
          />
        </div>
      )}

      {/* 5. Navigation Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '12px' }}>
        <MagicalButton
          variant={canAdvance ? 'cosmic' : 'secondary'}
          size={isPreK ? 'lg' : 'md'}
          onClick={handleAdvance}
          disabled={!canAdvance}
        >
          {canAdvance ? 'Continue Adventure ➔' : 'Complete the Step Above 👆'}
        </MagicalButton>
      </div>
    </div>
  )
}
