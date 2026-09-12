import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAcademySubjects } from '../../services/academy/curriculum/curriculumRegistry'
import { getRecommendedAcademySkills } from '../../services/academy/recommendationService'
import { getSubjectMasterySummaries, loadAllSkillProgress } from '../../services/academy/masteryService'
import { generateDailyLearningPlan } from '../../services/academy/learningDirector'
import {
  GlassPanel,
  ParticleField,
  WorldPortal,
  SkillCrystal,
  MagicalButton,
  AnimatedIcon,
  type IconKind,
} from '../../components/ui/design'
import { AskOrbisModal } from '../../components/academy/assistant/AskOrbisModal'
import { GuideCharacterSvg } from '../../components/academy/guide/GuideCharacterSvg'
import { useChildProfiles } from '../../hooks/useChildProfiles'
import type { GradeBand } from '../../types/learningUniverse'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const AcademyHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [isAskOrbisOpen, setIsAskOrbisOpen] = useState(false)
  const { selectedProfile } = useChildProfiles()

  const mapAgeToGradeBand = (age?: number): GradeBand => {
    if (!age) return 'grade_2'
    if (age <= 4) return 'pre_k'
    if (age === 5) return 'kindergarten'
    if (age === 6) return 'grade_1'
    if (age === 7) return 'grade_2'
    if (age === 8) return 'grade_3'
    if (age === 9) return 'grade_4'
    return 'grade_5'
  }

  const activeGradeBand = mapAgeToGradeBand(selectedProfile?.age)
  const activeChildId = selectedProfile?.id || 'default_child'
  const activeChildName = selectedProfile?.name || 'Explorer'
  const activeStreak = selectedProfile?.current_streak ?? 1
  const preferredGuide = ((selectedProfile as any)?.guide_companion as any) || 'poly'

  const subjects = useMemo(() => getAllAcademySubjects(), [])
  const recommendations = useMemo(() => getRecommendedAcademySkills(3), [])
  const summaries = useMemo(() => getSubjectMasterySummaries(), [])
  const allProgress = useMemo(() => loadAllSkillProgress(), [])

  // Generate today's personalized plan from Learning Director
  const dailyPlan = useMemo(
    () =>
      generateDailyLearningPlan({
        childId: activeChildId,
        gradeBand: activeGradeBand,
        preferredGuideId: preferredGuide,
        currentStreak: activeStreak,
      }),
    [activeChildId, activeGradeBand, preferredGuide, activeStreak]
  )

  // Primary continue-learning skill
  const primaryHeroSkill = recommendations[0]?.skill || dailyPlan.plannedActivities[0]

  // Filter skills for Recently Mastered and Needs Practice
  const masteredSkills = useMemo(() => {
    return Object.entries(allProgress)
      .filter(([_, prog]) => prog.masteryLevel === 'mastered' || prog.masteryLevel === 'proficient')
      .slice(0, 4)
  }, [allProgress])

  const needsPracticeSkills = useMemo(() => {
    return Object.entries(allProgress)
      .filter(([_, prog]) => prog.masteryLevel === 'learning' || prog.masteryLevel === 'practicing')
      .slice(0, 3)
  }, [allProgress])

  const handleSubjectClick = (subjectId: string) => {
    HapticsService.medium()
    sfxService.play('card_flip')
    navigate(`/academy/subject/${subjectId}`)
  }

  const handleSkillClick = (skillId: string) => {
    HapticsService.light()
    sfxService.play('star_pop')
    navigate(`/academy/skill/${skillId}`)
  }

  const cleanEmoji = (text?: string): string => {
    if (!text) return ''
    return text.replace(/[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '').trim()
  }

  const shortcuts: Array<{
    label: string
    iconKind: IconKind
    route: string
    color: string
    ariaLabel: string
  }> = [
    { label: 'Library', iconKind: 'scroll', route: '/academy/library', color: '#38bdf8', ariaLabel: 'Open Academy Library' },
    { label: 'Creative Studio', iconKind: 'radiance', route: '/academy/create', color: '#f97316', ariaLabel: 'Open Creative Studio' },
    { label: 'Think Lab', iconKind: 'enigma', route: '/academy/think', color: '#a855f7', ariaLabel: 'Open Think Lab' },
    { label: 'Science Lab', iconKind: 'biome', route: '/academy/science', color: '#10b981', ariaLabel: 'Open Science Lab' },
    { label: 'Project Studio', iconKind: 'circuit', route: '/academy/projects', color: '#f59e0b', ariaLabel: 'Open Project Studio' },
    { label: 'Playroom Games', iconKind: 'planet', route: '/playroom', color: '#ec4899', ariaLabel: 'Open Playroom Games' },
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
      aria-label="ORBis Learning Universe Command Center"
    >
      <ParticleField count={45} particleType="stardust" speed={0.4} color="#38bdf8" />

      {/* 1. Hero Command Center Header */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
        <GlassPanel
          tier="hero"
          glow
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            padding: 'clamp(20px, 4vw, 28px)',
            borderRadius: '24px',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 16px 40px rgba(2, 6, 23, 0.7), 0 0 30px rgba(56, 189, 248, 0.15)',
          }}
        >
          <div style={{ flex: '1 1 340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(56, 189, 248, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <AnimatedIcon kind="sparkle" size={12} color="#38bdf8" animate="sparkle" />
                <span>Living Learning Universe</span>
              </span>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#fbbf24',
                  fontWeight: 900,
                  background: 'rgba(251, 191, 36, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AnimatedIcon kind="star" size={12} color="#fbbf24" animate="pulse" />
                <span>{dailyPlan.streakDays} Day Adventure Streak!</span>
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
              }}
            >
              Welcome, {activeChildName}!
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '640px', lineHeight: 1.5 }}>
              Explore, read, solve, create, and master superpowers across 10 living academic realms.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '6px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GuideCharacterSvg guideId={preferredGuide} pose="excited" size={54} />
            </div>

            <MagicalButton
              variant="cosmic"
              size="md"
              soundCue="card_flip"
              onClick={() => setIsAskOrbisOpen(true)}
              style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              aria-label="Ask ORBis Socratic Tutor"
            >
              <AnimatedIcon kind="robot" size={16} color="#ffffff" />
              <span>Ask Tutor</span>
            </MagicalButton>

            <MagicalButton
              variant="gold"
              size="md"
              soundCue="star_pop"
              onClick={() => navigate('/academy/missions')}
              style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              aria-label="View Daily Quests and Missions"
            >
              <AnimatedIcon kind="scroll" size={16} color="#ffffff" />
              <span>Daily Quests</span>
            </MagicalButton>
          </div>
        </GlassPanel>
      </div>

      {/* 2. Universal Discovery Shortcuts Bar */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {shortcuts.map((sc) => (
            <button
              key={sc.label}
              type="button"
              onClick={() => {
                HapticsService.light()
                sfxService.play('star_pop')
                navigate(sc.route)
              }}
              style={{
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: `1.5px solid ${sc.color}40`,
                color: '#f8fafc',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '48px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = sc.color
                e.currentTarget.style.boxShadow = `0 6px 16px ${sc.color}30`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = `${sc.color}40`
                e.currentTarget.style.boxShadow = 'none'
              }}
              aria-label={sc.ariaLabel}
            >
              <AnimatedIcon kind={sc.iconKind} size={18} color={sc.color} />
              <span>{sc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Pillar 1: Continue Learning Hero */}
      {primaryHeroSkill && (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
          <GlassPanel
            tier="hero"
            style={{
              padding: 'clamp(18px, 3.5vw, 24px)',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(3, 105, 161, 0.3) 0%, rgba(15, 23, 42, 0.85) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              boxShadow: '0 12px 32px rgba(2, 6, 23, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
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
                    <AnimatedIcon kind="play" size={10} color="#38bdf8" />
                    <span>CONTINUE LEARNING HERO</span>
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>•</span>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>
                    +30 XP • +5 Stars
                  </span>
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                    fontWeight: 900,
                    color: '#f8fafc',
                  }}
                >
                  {'title' in primaryHeroSkill ? primaryHeroSkill.title : (primaryHeroSkill as any).title}
                </h2>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: 'rgba(56, 189, 248, 0.18)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  textTransform: 'uppercase',
                }}
              >
                Active Concept Lesson
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {'description' in primaryHeroSkill ? primaryHeroSkill.description : (primaryHeroSkill as any).description}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
              <MagicalButton
                variant="cosmic"
                size="md"
                soundCue="star_pop"
                onClick={() => {
                  HapticsService.heavy()
                  const lessonId = 'lessonId' in primaryHeroSkill ? primaryHeroSkill.lessonId : 'lesson_g2_array_multiplication'
                  navigate(`/academy/lesson/${lessonId}`)
                }}
                style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                aria-label="Start Active Academy Lesson"
              >
                <AnimatedIcon kind="play" size={16} color="#ffffff" />
                <span>Resume Lesson (+30 XP)</span>
              </MagicalButton>

              {'practiceSetId' in primaryHeroSkill && (
                <MagicalButton
                  variant="secondary"
                  size="md"
                  soundCue="card_flip"
                  onClick={() => {
                    HapticsService.medium()
                    navigate(`/academy/practice/${primaryHeroSkill.practiceSetId}`)
                  }}
                  style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  aria-label="Start Practice Challenge"
                >
                  <AnimatedIcon kind="wand" size={14} color="#c084fc" />
                  <span>Practice Challenge</span>
                </MagicalButton>
              )}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* 4. Pillar 2: Today's Guided Adventure (Missions Tracker) */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AnimatedIcon kind="scroll" size={18} color="#38bdf8" />
            <span>Today&apos;s Guided Adventure ({dailyPlan.totalDurationMinutes} min)</span>
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>
            Personalized by Learning Director
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {dailyPlan.plannedActivities.map((act) => (
            <GlassPanel
              key={act.id}
              tier="card"
              interactive
              onClick={() => {
                HapticsService.medium()
                sfxService.play('card_flip')
                navigate(act.route)
              }}
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer',
                minHeight: '120px',
              }}
              role="button"
              tabIndex={0}
              aria-label={`Launch activity: ${act.title}`}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#fbbf24',
                      background: 'rgba(251, 191, 36, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {cleanEmoji(act.reasonLabel)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{act.durationMinutes} min</span>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                  {act.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {act.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 800, gap: '4px' }}>
                <span>Start</span>
                <AnimatedIcon kind="arrow_right" size={14} color="#38bdf8" />
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* 5. Pillar 4: Next Best Skills to Master (Adaptive Recommendations) */}
      {recommendations.length > 0 && (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AnimatedIcon kind="sparkle" size={18} color="#c084fc" />
            <span>Next Best Skills to Master</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {recommendations.map((rec) => (
              <GlassPanel
                key={rec.skill.id}
                tier="card"
                interactive
                onClick={() => handleSkillClick(rec.skill.id)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  minHeight: '120px',
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open Skill Hub for ${rec.skill.title}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#c084fc',
                        background: 'rgba(168, 85, 247, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {cleanEmoji(rec.reasonLabel)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                      {rec.skill.ageBand.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                    {rec.skill.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {rec.skill.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800 }}>
                    +30 XP Bounty
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 800 }}>
                    <span>Skill Hub</span>
                    <AnimatedIcon kind="arrow_right" size={14} color="#38bdf8" />
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* 6. Pillar 5 & 6: Recently Mastered Skill Crystals & Needs Practice */}
      {(masteredSkills.length > 0 || needsPracticeSkills.length > 0) && (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 28px', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Recently Mastered */}
            {masteredSkills.length > 0 && (
              <GlassPanel tier="card" style={{ padding: '18px', borderRadius: '18px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <AnimatedIcon kind="trophy" size={18} color="#fbbf24" />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>
                    Mastery Crystal Hall
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {masteredSkills.map(([id, prog]) => (
                    <div
                      key={id}
                      onClick={() => handleSkillClick(id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(251, 191, 36, 0.25)',
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View mastered skill crystal for ${id}`}
                    >
                      <SkillCrystal tier={prog.masteryLevel} size="sm" />
                      <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 800 }}>
                        {prog.masteryScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* Needs Practice */}
            {needsPracticeSkills.length > 0 && (
              <GlassPanel tier="card" style={{ padding: '18px', borderRadius: '18px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <AnimatedIcon kind="hint_bulb" size={18} color="#38bdf8" />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>
                    Targeted Reinforcement
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {needsPracticeSkills.map(([id]) => (
                    <div
                      key={id}
                      onClick={() => handleSkillClick(id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        cursor: 'pointer',
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Practice reinforcement for ${id}`}
                    >
                      <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 700 }}>{id}</span>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>
                        Practice Drill →
                      </span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}
          </div>
        </div>
      )}

      {/* 7. Pillar 3: All 10 Academic Realms (Your Worlds) */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AnimatedIcon kind="globe" size={20} color="#38bdf8" />
            <span>10 Core Academic Realms</span>
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Select a realm to enter courses and constellation maps
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px',
          }}
        >
          {subjects.map((subject) => {
            const summary = summaries.find((s) => s.subjectId === subject.id)
            const masteredCount = summary?.masteredSkillsCount || 0
            const totalCount = summary?.totalSkills || 0
            const masteryPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0

            return (
              <WorldPortal
                key={subject.id}
                title={subject.title}
                subtitle={subject.tagline}
                totalSkills={totalCount}
                completedSkills={masteredCount}
                masteryPercentage={masteryPct}
                themeGradient={subject.heroGradient}
                glowColor={subject.accentColor}
                badgeText={`${masteredCount}/${totalCount} Mastered`}
                onClick={() => handleSubjectClick(subject.id)}
              />
            )
          })}
        </div>
      </div>

      {/* Ask ORBis Socratic Tutor Modal */}
      <AskOrbisModal isOpen={isAskOrbisOpen} onClose={() => setIsAskOrbisOpen(false)} />
    </div>
  )
}

