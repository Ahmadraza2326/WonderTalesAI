import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAcademySubject } from '../../services/academy/curriculum/curriculumRegistry'
import { getGuideProfile } from '../../services/academy/guideDirector'
import {
  GlassPanel,
  ParticleField,
  MagicalButton,
  AnimatedIcon,
  type IconKind,
} from '../../components/ui/design'
import { GuideCharacterSvg } from '../../components/academy/guide/GuideCharacterSvg'
import type { GuideId } from '../../types/learningUniverse'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const SubjectDetailPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const navigate = useNavigate()
  const subject = getAcademySubject(subjectId || '')

  const guideId: GuideId = useMemo(() => {
    switch (subjectId) {
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
  }, [subjectId])

  const guide = useMemo(() => getGuideProfile(guideId), [guideId])

  const realmIconKind: IconKind = useMemo(() => {
    switch (subjectId) {
      case 'math':
        return 'citadel'
      case 'science':
        return 'biome'
      case 'english':
      case 'vocabulary':
      case 'grammar':
        return 'rune'
      case 'reading':
        return 'scroll'
      case 'computer_science':
        return 'circuit'
      case 'logic':
        return 'enigma'
      case 'creativity':
        return 'radiance'
      case 'general_knowledge':
      default:
        return 'globe'
    }
  }, [subjectId])

  if (!subject) {
    return (
      <div style={{ padding: '48px 16px', color: '#ffffff', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>Academic Realm Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The requested subject realm could not be located in the curriculum registry.</p>
        <MagicalButton variant="cosmic" size="md" onClick={() => navigate('/academy')}>
          ← Return to Academy Hub
        </MagicalButton>
      </div>
    )
  }

  const totalSkillsInSubject = subject.courses.reduce((acc, course) => {
    return acc + course.units.reduce((uAcc, unit) => uAcc + unit.skills.length, 0)
  }, 0)

  const subjectAccent = subject.accentColor || '#38bdf8'

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
      aria-label={`Academic Realm: ${subject.title}`}
    >
      <ParticleField count={36} particleType="stardust" speed={0.4} color={subjectAccent} />

      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
        {/* Back Navigation Bar */}
        <button
          type="button"
          onClick={() => {
            HapticsService.light()
            sfxService.play('card_flip')
            navigate('/academy')
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
          aria-label="Back to All Academy Realms"
        >
          <AnimatedIcon kind="arrow_left" size={14} color="#94a3b8" />
          <span>Back to All Academy Realms</span>
        </button>

        {/* Hero Subject Stage */}
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
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
                  <AnimatedIcon kind={realmIconKind} size={12} color={subjectAccent} />
                  <span>Academic Realm</span>
                </span>

                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#fbbf24',
                    fontWeight: 800,
                    background: 'rgba(251, 191, 36, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                  }}
                >
                  {subject.courses.length} Courses • {totalSkillsInSubject} Skills
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
                  fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                  fontWeight: 900,
                  color: '#f8fafc',
                  letterSpacing: '-0.02em',
                }}
              >
                {subject.title}
              </h1>

              <p style={{ margin: '6px 0 0', fontSize: '1rem', color: '#e2e8f0', fontWeight: 600 }}>
                {subject.tagline}
              </p>

              <p style={{ margin: '10px 0 0', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '680px' }}>
                {subject.description}
              </p>
            </div>

            {/* Guide Mascot Realm Stage */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '14px 20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '340px',
              }}
            >
              <GuideCharacterSvg guideId={guideId} pose="teaching" size={72} />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: subjectAccent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {guide.name} • {guide.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '3px', lineHeight: 1.4 }}>
                  &ldquo;{guide.catchphrase}&rdquo;
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Courses Grid */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AnimatedIcon kind="scroll" size={18} color={subjectAccent} />
            <span>Realm Learning Paths & Courses</span>
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Choose a course to explore its constellation map
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {subject.courses.map((course) => {
            const courseSkillCount = course.units.reduce((acc, u) => acc + u.skills.length, 0)

            return (
              <GlassPanel
                key={course.id}
                tier="card"
                interactive
                onClick={() => {
                  HapticsService.medium()
                  sfxService.play('card_flip')
                  navigate(`/academy/course/${course.id}`)
                }}
                style={{
                  padding: '20px',
                  borderRadius: '20px',
                  border: `1.5px solid ${subjectAccent}35`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  minHeight: '180px',
                }}
                role="button"
                tabIndex={0}
                aria-label={`Enter course ${course.title}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {course.ageBand.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                      ~{course.estimatedMinutes || 40} min
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc' }}>
                    {course.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {course.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 800 }}>
                    {course.units.length} Units • {courseSkillCount} Skills
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: subjectAccent, fontSize: '0.85rem', fontWeight: 800 }}>
                    <span>Constellation Map</span>
                    <AnimatedIcon kind="arrow_right" size={14} color={subjectAccent} />
                  </div>
                </div>
              </GlassPanel>
            )
          })}
        </div>
      </div>
    </div>
  )
}

