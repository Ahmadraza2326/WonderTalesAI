import React from 'react'
import type { StoryContinuityResult } from '../../services/academy/storyContinuityEngine'
import { GlassPanel } from '../ui/design/GlassPanel'
import { MagicalButton } from '../ui/design/MagicalButton'
import { AnimatedIcon } from '../ui/design/AnimatedIcon'
import { GuideCharacterSvg } from '../academy/guide/GuideCharacterSvg'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export interface StoryContinuityBridgeCardProps {
  bridge: StoryContinuityResult
  onLaunchLesson?: (lessonRoute: string) => void
  onLaunchPractice?: (practiceRoute: string) => void
  onLaunchGame?: (gameRoute: string) => void
  onBackToLibrary?: () => void
  onReadAgain?: () => void
  compact?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * StoryContinuityBridgeCard
 * 
 * Stitch Direction C (Living Learning Universe) Post-Story Learning Bridge.
 * Connects the completed story narrative to its target Academy Lesson,
 * Playroom Flagship Game, Guide Mentor, and Explorer Passport rewards.
 */
export const StoryContinuityBridgeCard: React.FC<StoryContinuityBridgeCardProps> = ({
  bridge,
  onLaunchLesson,
  onLaunchPractice,
  onLaunchGame,
  onBackToLibrary,
  onReadAgain,
  compact = false,
  className = '',
  style,
}) => {
  const {
    storyTitle,
    recommendedSkill,
    recommendedSubject,
    matchReasonLabel,
    connectionExplanation,
    guideId,
    guidePose,
    guideDialogue,
    capstoneGame,
    capstoneCallToAction,
    rewards,
    routes,
    evidence,
  } = bridge

  const subjectColor = recommendedSubject?.accentColor || '#38bdf8'

  const handleLaunchLesson = () => {
    HapticsService.heavy()
    sfxService.play('star_pop')
    if (onLaunchLesson) {
      onLaunchLesson(routes.lessonRoute)
    }
  }

  const handleLaunchPractice = () => {
    HapticsService.medium()
    sfxService.play('card_flip')
    if (onLaunchPractice) {
      onLaunchPractice(routes.practiceRoute)
    }
  }

  const handleLaunchGame = () => {
    HapticsService.heavy()
    sfxService.play('victory_fanfare')
    if (onLaunchGame && routes.gameRoute) {
      onLaunchGame(routes.gameRoute)
    }
  }

  return (
    <GlassPanel
      tier="hero"
      glow
      className={`story-continuity-bridge-card ${className}`}
      style={{
        padding: compact ? 'clamp(1rem, 2.5vw, 1.25rem)' : 'clamp(1.25rem, 3.5vw, 2rem)',
        borderRadius: '24px',
        border: `1.5px solid ${subjectColor}40`,
        boxShadow: `0 16px 40px rgba(2, 6, 23, 0.7), 0 0 30px ${subjectColor}25`,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? '1rem' : '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      role="region"
      aria-label={`Learning Connection for ${storyTitle}`}
    >
      {/* 1. Top Ribbon: Match Reason & Rewards Bounty */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 900,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'rgba(251, 191, 36, 0.15)',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <AnimatedIcon kind="sparkle" size={12} color="#fbbf24" animate="sparkle" />
            <span>{matchReasonLabel}</span>
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: subjectColor,
              background: `${subjectColor}18`,
              padding: '4px 10px',
              borderRadius: '9999px',
              border: `1px solid ${subjectColor}35`,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {recommendedSubject.title}
          </span>
        </div>

        {/* Reward Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '4px 10px',
              borderRadius: '10px',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 900,
              color: '#fbbf24',
            }}
          >
            <AnimatedIcon kind="star" size={12} color="#fbbf24" />
            <span>+{rewards.lessonStars} Stars</span>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '4px 10px',
              borderRadius: '10px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 900,
              color: '#c084fc',
            }}
          >
            <AnimatedIcon kind="crystal" size={12} color="#c084fc" />
            <span>+{rewards.lessonXp} XP</span>
          </div>
        </div>
      </div>

      {/* 2. Character Mentor & Concept Discovery Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          background: 'rgba(15, 23, 42, 0.55)',
          padding: '12px 16px',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GuideCharacterSvg
            guideId={guideId}
            pose={guidePose}
            size={compact ? 56 : 72}
          />
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '2px', lineHeight: 1.4 }}>
            {connectionExplanation}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.4 }}>
            &ldquo;{guideDialogue}&rdquo;
          </div>
        </div>
      </div>

      {/* 3. Primary Academy Recommendation Hero Panel */}
      <div
        style={{
          background: `linear-gradient(135deg, ${subjectColor}15 0%, rgba(15, 23, 42, 0.7) 100%)`,
          border: `1.5px solid ${subjectColor}45`,
          borderRadius: '20px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AnimatedIcon kind="star" size={10} color="#38bdf8" />
                <span>ACADEMY MISSION</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>•</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                {recommendedSkill.ageBand.replace('_', ' ')}
              </span>
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.01em',
              }}
            >
              {recommendedSkill.title}
            </h3>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            Interactive Concept Lesson
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          {recommendedSkill.description}
        </p>

        {/* Concept Chips */}
        {evidence?.matchedConcepts && evidence.matchedConcepts.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {evidence.matchedConcepts.slice(0, 3).map((concept, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AnimatedIcon kind="rune" size={10} color="#38bdf8" />
                <span>{concept}</span>
              </span>
            ))}
          </div>
        )}

        {/* Primary Academy Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <MagicalButton
            type="button"
            variant="cosmic"
            size="md"
            onClick={handleLaunchLesson}
            style={{
              flex: '1 1 200px',
              minHeight: '48px',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            aria-label={`Start Academy Lesson: ${recommendedSkill.title}`}
          >
            <AnimatedIcon kind="play" size={16} color="#ffffff" />
            <span>Start Academy Lesson (+{rewards.lessonXp} XP)</span>
          </MagicalButton>

          {onLaunchPractice && (
            <MagicalButton
              type="button"
              variant="secondary"
              size="md"
              onClick={handleLaunchPractice}
              style={{
                flex: '0 1 auto',
                minHeight: '48px',
                fontSize: '0.88rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              aria-label={`Practice skill: ${recommendedSkill.title}`}
            >
              <AnimatedIcon kind="wand" size={14} color="#c084fc" />
              <span>Practice Drill</span>
            </MagicalButton>
          )}
        </div>
      </div>

      {/* 4. Playroom Flagship Capstone Game (Triad Bridge) */}
      {capstoneGame && (
        <div
          style={{
            background: capstoneGame.heroBannerColor || 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ flex: '1 1 220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: '#fbbf24',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AnimatedIcon kind="circuit" size={12} color="#fbbf24" />
                <span>PLAYROOM CAPSTONE CHALLENGE</span>
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc' }}>
              {capstoneGame.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '2px' }}>
              {capstoneCallToAction || capstoneGame.subtitle}
            </div>
          </div>

          <MagicalButton
            type="button"
            variant="emerald"
            size="md"
            onClick={handleLaunchGame}
            style={{
              minHeight: '48px',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            aria-label={`Play Capstone Game: ${capstoneGame.title}`}
          >
            <span>Play Station (+{rewards.gameXp || 25} XP)</span>
            <AnimatedIcon kind="arrow_right" size={14} color="#ffffff" />
          </MagicalButton>
        </div>
      )}

      {/* 5. Footer Utility Actions */}
      {(onReadAgain || onBackToLibrary) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            paddingTop: '4px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {onReadAgain && (
            <button
              type="button"
              onClick={() => {
                sfxService.play('card_flip')
                onReadAgain()
              }}
              style={{
                background: 'transparent',
                color: '#cbd5e1',
                border: 'none',
                padding: '0.6rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AnimatedIcon kind="replay" size={14} color="#cbd5e1" />
              <span>Read Story Again</span>
            </button>
          )}

          {onBackToLibrary && (
            <button
              type="button"
              onClick={() => {
                sfxService.play('card_flip')
                onBackToLibrary()
              }}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                color: '#94a3b8',
                border: 'none',
                padding: '0.6rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Back to Stories</span>
            </button>
          )}
        </div>
      )}
    </GlassPanel>
  )
}
