import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAcademyCourse, getAcademySubject } from '../../services/academy/curriculum/curriculumRegistry'
import { loadAllSkillProgress } from '../../services/academy/masteryService'
import { getPlaygroundGame } from '../../services/games/playgroundRegistry'
import {
  GlassPanel,
  ParticleField,
  SkillCrystal,
  AdventurePath,
  MagicalButton,
  AnimatedIcon,
  type AdventureStepNode,
} from '../../components/ui/design'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const course = getAcademyCourse(courseId || '')
  const subject = course ? getAcademySubject(course.subjectId) : undefined
  const progressMap = useMemo(() => loadAllSkillProgress(), [])

  // Aggregate course stats unconditionally before any early returns
  const allSkillsInCourse = useMemo(() => {
    return course?.units.flatMap((u) => u.skills) || []
  }, [course])

  const completedSkillsCount = useMemo(() => {
    return allSkillsInCourse.filter((s) => {
      const p = progressMap[s.id]
      return p && (p.masteryLevel === 'mastered' || p.masteryLevel === 'proficient')
    }).length
  }, [allSkillsInCourse, progressMap])

  const courseMasteryPct = allSkillsInCourse.length > 0
    ? Math.round((completedSkillsCount / allSkillsInCourse.length) * 100)
    : 0

  if (!course) {
    return (
      <div style={{ padding: '48px 16px', color: '#ffffff', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>Course Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The requested course could not be located in the curriculum registry.</p>
        <MagicalButton variant="cosmic" size="md" onClick={() => navigate('/academy')}>
          ← Return to Academy Hub
        </MagicalButton>
      </div>
    )
  }

  const subjectAccent = subject?.accentColor || '#38bdf8'

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
      aria-label={`Course Constellation: ${course.title}`}
    >
      <ParticleField count={36} particleType="stardust" speed={0.4} color={subjectAccent} />

      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
        {/* Back to Subject Navigation */}
        <button
          type="button"
          onClick={() => {
            HapticsService.light()
            sfxService.play('card_flip')
            navigate(`/academy/subject/${course.subjectId}`)
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
          aria-label={`Back to ${subject?.title || 'Subject'}`}
        >
          <AnimatedIcon kind="arrow_left" size={14} color="#94a3b8" />
          <span>Back to {subject?.title || 'Subject'}</span>
        </button>

        {/* Hero Course Constellation Card */}
        <GlassPanel
          tier="hero"
          glow
          style={{
            padding: 'clamp(20px, 4vw, 32px)',
            borderRadius: '24px',
            border: `1.5px solid ${subjectAccent}45`,
            background: `linear-gradient(135deg, ${subjectAccent}20 0%, rgba(15, 23, 42, 0.85) 100%)`,
            boxShadow: `0 16px 40px rgba(2, 6, 23, 0.7), 0 0 30px ${subjectAccent}20`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: subjectAccent,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: `${subjectAccent}18`,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: `1px solid ${subjectAccent}35`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <AnimatedIcon kind="citadel" size={12} color={subjectAccent} />
                  <span>Constellation Course</span>
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    textTransform: 'capitalize',
                  }}
                >
                  Age Band: {course.ageBand.replace('_', ' ')}
                </span>

                <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800 }}>
                  ~{course.estimatedMinutes || 40} min estimated
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
                {course.title}
              </h1>

              <p style={{ margin: '6px 0 0', fontSize: '0.98rem', color: '#e2e8f0', fontWeight: 600 }}>
                {course.tagline}
              </p>

              <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, maxWidth: '700px' }}>
                {course.description}
              </p>
            </div>

            {/* Course Progress Summary Card */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '16px 20px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '200px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>
                <span>COURSE MASTERY</span>
                <span style={{ color: '#fbbf24' }}>{courseMasteryPct}%</span>
              </div>

              {/* Progress Track */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${courseMasteryPct}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${subjectAccent} 0%, #fbbf24 100%)`,
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>
                {completedSkillsCount} of {allSkillsInCourse.length} Skills Mastered
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Units & Constellation Progression Section */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px', zIndex: 1 }}>
        {course.units.map((unit) => {
          // Generate AdventurePath nodes for unit
          const adventureSteps: AdventureStepNode[] = unit.skills.map((skill) => {
            const p = progressMap[skill.id]
            const isCompleted = p && (p.masteryLevel === 'mastered' || p.masteryLevel === 'proficient')

            // Prerequisite gating
            const prereqsMet = (skill.prerequisiteSkillIds || []).every((prereqId) => {
              const prProg = progressMap[prereqId]
              return prProg && (prProg.masteryLevel === 'mastered' || prProg.masteryLevel === 'proficient')
            })

            const status: 'completed' | 'current' | 'locked' = isCompleted
              ? 'completed'
              : prereqsMet
              ? 'current'
              : 'locked'

            return {
              id: skill.id,
              title: skill.title,
              subtitle: skill.description,
              status,
              rewardStars: 5,
            }
          })

          // Find first uncompleted index
          const activeStepIndex = adventureSteps.findIndex((s) => s.status === 'current')

          // Check if unit has flagship capstone games
          const capstoneGameIds = Array.from(
            new Set(unit.skills.map((s) => s.capstoneGameId).filter(Boolean) as string[])
          )
          const firstCapstoneGame = capstoneGameIds.length > 0 ? getPlaygroundGame(capstoneGameIds[0]) : null

          return (
            <GlassPanel
              key={unit.id}
              tier="card"
              style={{
                padding: 'clamp(18px, 3vw, 28px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Unit Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      color: '#fbbf24',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: 'rgba(251, 191, 36, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    Unit {unit.orderIndex} Milestone
                  </span>

                  <h2 style={{ margin: '8px 0 4px', fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc' }}>
                    {unit.title}
                  </h2>

                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
                    {unit.description}
                  </p>
                </div>

                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800 }}>
                  {unit.skills.length} Standard Competencies
                </span>
              </div>

              {/* Adventure Path Constellation Visualizer */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px 20px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <AdventurePath
                  steps={adventureSteps}
                  currentStepIndex={activeStepIndex >= 0 ? activeStepIndex : 0}
                  onSelectStep={(_, step) => {
                    navigate(`/academy/skill/${step.id}`)
                  }}
                />
              </div>

              {/* Skills Interactive Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {unit.skills.map((skill) => {
                  const p = progressMap[skill.id]
                  const tier = p?.masteryLevel || 'not_started'
                  const score = p?.masteryScore || 0

                  // Prerequisite check
                  const prereqsMet = (skill.prerequisiteSkillIds || []).every((prereqId) => {
                    const prProg = progressMap[prereqId]
                    return prProg && (prProg.masteryLevel === 'mastered' || prProg.masteryLevel === 'proficient')
                  })

                  return (
                    <GlassPanel
                      key={skill.id}
                      tier="slot"
                      interactive={prereqsMet}
                      onClick={() => {
                        if (!prereqsMet) {
                          sfxService.play('button_click')
                          HapticsService.light()
                          return
                        }
                        HapticsService.medium()
                        sfxService.play('star_pop')
                        navigate(`/academy/skill/${skill.id}`)
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: prereqsMet
                          ? `1px solid ${tier === 'mastered' ? '#fbbf24' : 'rgba(255, 255, 255, 0.12)'}`
                          : '1px dashed rgba(100, 116, 139, 0.4)',
                        opacity: prereqsMet ? 1 : 0.65,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        cursor: prereqsMet ? 'pointer' : 'not-allowed',
                        minHeight: '140px',
                      }}
                      role="button"
                      tabIndex={prereqsMet ? 0 : -1}
                      aria-label={`${skill.title} - ${tier.replace('_', ' ')}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <SkillCrystal tier={tier} size="sm" />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                color: tier === 'mastered' ? '#fbbf24' : '#38bdf8',
                                textTransform: 'capitalize',
                              }}
                            >
                              {tier.replace('_', ' ')}
                            </span>
                            {score > 0 && (
                              <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>
                                {score}%
                              </span>
                            )}
                          </div>

                          <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                            {skill.title}
                          </h3>

                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                            {skill.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        {!prereqsMet ? (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AnimatedIcon kind="lock" size={12} color="#94a3b8" />
                            <span>Requires Prerequisite</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>
                            +30 XP • +5 Stars
                          </span>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: prereqsMet ? '#38bdf8' : '#94a3b8', fontSize: '0.78rem', fontWeight: 800 }}>
                          <span>{prereqsMet ? 'Skill Hub' : 'Locked'}</span>
                          <AnimatedIcon kind={prereqsMet ? 'arrow_right' : 'lock'} size={12} color={prereqsMet ? '#38bdf8' : '#94a3b8'} />
                        </div>
                      </div>
                    </GlassPanel>
                  )
                })}
              </div>

              {/* Unit Capstone Flagship Game Milestone */}
              {firstCapstoneGame && (
                <div
                  style={{
                    background: firstCapstoneGame.heroBannerColor || 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)',
                    borderRadius: '18px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
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
                        <span>UNIT CAPSTONE CHALLENGE</span>
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>
                      {firstCapstoneGame.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '2px' }}>
                      {firstCapstoneGame.subtitle}
                    </div>
                  </div>

                  <MagicalButton
                    variant="emerald"
                    size="md"
                    onClick={() => {
                      HapticsService.heavy()
                      sfxService.play('victory_fanfare')
                      navigate(firstCapstoneGame.route)
                    }}
                    style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    aria-label={`Play Flagship Game: ${firstCapstoneGame.title}`}
                  >
                    <span>Play Station (+25 XP)</span>
                    <AnimatedIcon kind="arrow_right" size={14} color="#ffffff" />
                  </MagicalButton>
                </div>
              )}
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}

