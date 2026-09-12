import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAcademySkill, getAcademyCourse, getAcademySubject } from '../../services/academy/curriculum/curriculumRegistry'
import { loadAllSkillProgress } from '../../services/academy/masteryService'
import { getEcosystemLinksForSkill } from '../../services/academy/ecosystemBridgeService'
import { getGuideProfile } from '../../services/academy/guideDirector'
import {
  GlassPanel,
  ParticleField,
  SkillCrystal,
  MagicalButton,
  AnimatedIcon,
} from '../../components/ui/design'
import { GuideCharacterSvg } from '../../components/academy/guide/GuideCharacterSvg'
import type { GuideId } from '../../types/learningUniverse'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const SkillHubPage: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>()
  const navigate = useNavigate()
  const skill = getAcademySkill(skillId || '')
  const course = skill ? getAcademyCourse(skill.courseId) : undefined
  const subject = course ? getAcademySubject(course.subjectId) : undefined
  const progressMap = useMemo(() => loadAllSkillProgress(), [])
  const progress = skill ? progressMap[skill.id] : undefined
  const links = skill ? getEcosystemLinksForSkill(skill.id) : undefined

  const guideId: GuideId = useMemo(() => {
    if (!subject) return 'poly'
    switch (subject.id) {
      case 'math':
        return 'poly'
      case 'science':
        return 'newton'
      case 'english':
      case 'vocabulary':
      case 'grammar':
        return 'lexi'
      case 'reading':
        return 'aria'
      case 'computer_science':
        return 'beep_0'
      case 'logic':
        return 'sherlock'
      case 'creativity':
        return 'davinci'
      case 'general_knowledge':
      default:
        return 'atlas'
    }
  }, [subject])

  const guide = useMemo(() => getGuideProfile(guideId), [guideId])

  if (!skill) {
    return (
      <div style={{ padding: '48px 16px', color: '#ffffff', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>Skill Competency Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The requested skill could not be located in the curriculum registry.</p>
        <MagicalButton variant="cosmic" size="md" onClick={() => navigate('/academy')}>
          ← Return to Academy Hub
        </MagicalButton>
      </div>
    )
  }

  const currentTier = progress?.masteryLevel || 'not_started'
  const currentScore = progress?.masteryScore || 0

  // Check prerequisites
  const prereqSkills = (skill.prerequisiteSkillIds || [])
    .map((prId) => getAcademySkill(prId))
    .filter(Boolean)

  const allPrereqsMet = (skill.prerequisiteSkillIds || []).every((prId) => {
    const prProg = progressMap[prId]
    return prProg && (prProg.masteryLevel === 'mastered' || prProg.masteryLevel === 'proficient')
  })

  // 10-Step Pedagogical Loop Stages
  const loopSteps = [
    { num: 1, label: 'Phenomenon Hook' },
    { num: 2, label: 'Interactive Model' },
    { num: 3, label: 'Scaffolding' },
    { num: 4, label: 'Misconception Check' },
    { num: 5, label: 'Active Practice' },
    { num: 6, label: 'Playroom Apply' },
    { num: 7, label: 'Socratic Dialogue' },
    { num: 8, label: 'Self-Reflection' },
    { num: 9, label: 'Mastery Crystal' },
    { num: 10, label: 'Story Expansion' },
  ]

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
        padding: 'clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px) 64px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      role="region"
      aria-label={`Skill Hub: ${skill.title}`}
    >
      <ParticleField count={36} particleType="stardust" speed={0.4} color="#a855f7" />

      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
        {/* Back Navigation Bar */}
        <button
          type="button"
          onClick={() => {
            HapticsService.light()
            sfxService.play('card_flip')
            if (skill.courseId) {
              navigate(`/academy/course/${skill.courseId}`)
            } else {
              navigate('/academy')
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            borderRadius: '8px',
            minHeight: '48px',
          }}
          aria-label="Back to Course Constellation"
        >
          <AnimatedIcon kind="arrow_left" size={14} color="#94a3b8" />
          <span>Back to Course Constellation</span>
        </button>

        {/* Skill Hero Stage */}
        <GlassPanel
          tier="hero"
          glow
          style={{
            padding: 'clamp(20px, 4vw, 32px)',
            borderRadius: '24px',
            border: '1.5px solid rgba(168, 85, 247, 0.45)',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
            boxShadow: '0 16px 40px rgba(2, 6, 23, 0.7), 0 0 30px rgba(168, 85, 247, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <SkillCrystal tier={currentTier} size="lg" glow />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      color: '#a855f7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: 'rgba(168, 85, 247, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <AnimatedIcon kind="sparkle" size={12} color="#a855f7" />
                    <span>Skill Superpower Hub</span>
                  </span>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#fbbf24',
                      background: 'rgba(251, 191, 36, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    +30 XP • +5 Stars
                  </span>
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                    fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                    fontWeight: 900,
                    color: '#f8fafc',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {skill.title}
                </h1>

                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', textTransform: 'capitalize' }}>
                  Tier: <strong style={{ color: '#fbbf24' }}>{currentTier.replace('_', ' ')}</strong>
                </div>
              </div>
            </div>

            {/* Mastery Score Box */}
            <div
              style={{
                padding: '12px 24px',
                borderRadius: '18px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1.5px solid rgba(168, 85, 247, 0.4)',
                textAlign: 'center',
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mastery Score
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>
                {currentScore}%
              </div>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.98rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {skill.description}
          </p>

          {/* Guide Encouragement Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '12px 18px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <GuideCharacterSvg guideId={guideId} pose="excited" size={54} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                {guide.name}&apos;s Learning Challenge
              </div>
              <div style={{ fontSize: '0.86rem', color: '#f1f5f9', fontStyle: 'italic', marginTop: '2px' }}>
                &ldquo;Master this concept in the lesson, sharpen your reflexes in practice, and prove your mastery in the capstone!&rdquo;
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* 10-Step Pedagogical Loop Visualizer */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
        <GlassPanel
          tier="card"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AnimatedIcon kind="wand" size={14} color="#38bdf8" />
              <span>ORBis 10-Step Pedagogical Mastery Loop</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Structured Cognitive Progression
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {loopSteps.map((step) => {
              const isActive = (step.num <= 4 && currentTier === 'not_started') ||
                               (step.num <= 6 && (currentTier === 'learning' || currentTier === 'practicing')) ||
                               (step.num <= 8 && (currentTier === 'developing' || currentTier === 'proficient')) ||
                               (currentTier === 'mastered')

              return (
                <div
                  key={step.num}
                  style={{
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${isActive ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                    minWidth: '76px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, color: isActive ? '#fbbf24' : '#64748b' }}>
                    Step {step.num}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: isActive ? '#f8fafc' : '#94a3b8', fontWeight: 700 }}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </GlassPanel>
      </div>

      {/* Prerequisite Alert if any missing */}
      {prereqSkills.length > 0 && !allPrereqsMet && (
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1.5px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AnimatedIcon kind="lock" size={20} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24' }}>
                Prerequisites Recommended
              </div>
              <div style={{ fontSize: '0.8rem', color: '#fef3c7', marginTop: '2px' }}>
                Mastering foundational skills first ensures the best learning outcome.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Pathways: The Learning Triad */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AnimatedIcon kind="star" size={18} color="#fbbf24" />
          <span>The Learning Triad Activities</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Step 1: Guided Concept Lesson */}
          <GlassPanel
            tier="card"
            style={{
              padding: '24px',
              borderRadius: '20px',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px',
              minHeight: '220px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: '#38bdf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  Step 1 • Guided Theory
                </span>
                <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800 }}>
                  +30 XP
                </span>
              </div>

              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc' }}>
                Interactive Cinematic Lesson
              </h3>

              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Master the core concepts through guided diagrams, interactive models, and Socratic reflection with your guide.
              </p>
            </div>

            <MagicalButton
              variant="cosmic"
              size="md"
              soundCue="card_flip"
              onClick={() => {
                HapticsService.medium()
                navigate(`/academy/lesson/${skill.lessonId}`)
              }}
              style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              aria-label="Start Interactive Lesson"
            >
              <AnimatedIcon kind="play" size={16} color="#ffffff" />
              <span>Start Interactive Lesson</span>
            </MagicalButton>
          </GlassPanel>

          {/* Step 2: Practice Challenge */}
          <GlassPanel
            tier="card"
            style={{
              padding: '24px',
              borderRadius: '20px',
              border: '1.5px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px',
              minHeight: '220px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: '#c084fc',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: 'rgba(168, 85, 247, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  Step 2 • Active Drills
                </span>
                <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800 }}>
                  4-Tier Hints
                </span>
              </div>

              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc' }}>
                Practice Challenge
              </h3>

              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Test your skills across multiple question types with adaptive scaffolding and immediate corrective feedback.
              </p>
            </div>

            <MagicalButton
              variant="gold"
              size="md"
              soundCue="card_flip"
              onClick={() => {
                HapticsService.medium()
                navigate(`/academy/practice/${skill.practiceSetId}`)
              }}
              style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              aria-label="Start Practice Challenge"
            >
              <AnimatedIcon kind="wand" size={16} color="#ffffff" />
              <span>Start Practice Challenge</span>
            </MagicalButton>
          </GlassPanel>

          {/* Step 3: Flagship Capstone Game (if linked) */}
          {links?.capstoneGame && (
            <GlassPanel
              tier="card"
              style={{
                padding: '24px',
                borderRadius: '20px',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px',
                minHeight: '220px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      color: '#fbbf24',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: 'rgba(251, 191, 36, 0.15)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Step 3 • 3D Playroom Capstone
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800 }}>
                    +25 XP
                  </span>
                </div>

                <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc' }}>
                  {links.capstoneGame.title}
                </h3>

                <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  Apply your knowledge in the immersive simulation and earn your final realm mastery stars!
                </p>
              </div>

              <MagicalButton
                variant="emerald"
                size="md"
                soundCue="star_pop"
                onClick={() => {
                  HapticsService.heavy()
                  navigate(links.capstoneGame!.route)
                }}
                style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                aria-label={`Launch Flagship Game: ${links.capstoneGame.title}`}
              >
                <AnimatedIcon kind="star" size={16} color="#ffffff" />
                <span>Launch Flagship Game</span>
              </MagicalButton>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  )
}

