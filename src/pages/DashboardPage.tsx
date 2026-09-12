import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import { TopExplorerBar } from '../components/layout/TopExplorerBar'
import { DailyLoginModal } from '../components/experience/DailyLoginModal'
import { storyService } from '../services/storyService'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { useChildProfiles } from '../hooks/useChildProfiles'
import { calculateAdventureProgress } from '../services/progressionService'
import { sfxService } from '../services/audio/sfxService'
import { HapticsService } from '../services/hapticsService'
import { GlassPanel } from '../components/ui/design/GlassPanel'
import { MagicalButton } from '../components/ui/design/MagicalButton'
import { ParticleField } from '../components/ui/design/ParticleField'
import { AnimatedIcon } from '../components/ui/design/AnimatedIcon'
import type { StoryRecord } from '../types/story'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useI18n()
  const { selectedProfile } = useChildProfiles()
  const [stories, setStories] = useState<StoryRecord[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)
  const [isDailyBonusOpen, setIsDailyBonusOpen] = useState(false)

  // Compute live adventure progress for dashboard preview
  const adventureProgress = useMemo(() => {
    let creatureCount = 0
    let machineCount = 0
    let detectiveCount = 0
    let potionCount = 0

    if (typeof window !== 'undefined' && window.localStorage && selectedProfile?.id) {
      try {
        const c = window.localStorage.getItem(`orbis_creature_lab_discovered_${selectedProfile.id}`)
        if (c) creatureCount = JSON.parse(c).length

        const m = window.localStorage.getItem(`orbis_magic_machine_completed_${selectedProfile.id}`)
        if (m) machineCount = JSON.parse(m).length

        const d = window.localStorage.getItem(`orbis_mystery_detective_solved_${selectedProfile.id}`)
        if (d) detectiveCount = JSON.parse(d).length

        const p = window.localStorage.getItem(`orbis_potion_scales_completed_${selectedProfile.id}`)
        if (p) potionCount = JSON.parse(p).length
      } catch {
        // Fallback
      }
    }

    return calculateAdventureProgress(selectedProfile, {
      creatureDiscoveriesCount: creatureCount,
      machineCompletedCount: machineCount,
      detectiveSolvedCount: detectiveCount,
      potionBrewedCount: potionCount,
    })
  }, [selectedProfile])

  // Khan Academy Kids + Duolingo Next Lesson Recommendation based on lowest cognitive domain score
  const recommendedActivity = useMemo(() => {
    const scores = adventureProgress.cognitiveDomainScores
    if (!scores) {
      return { title: 'Magic Machine Lab', route: '/playroom/magic-machine', domainLabel: 'Logic & Physics Rigs' }
    }
    const entries = Object.entries(scores) as [string, { xp: number; level: number; label: string }][]
    entries.sort((a, b) => a[1].xp - b[1].xp)
    const lowestDomain = entries[0]?.[0] || 'logic'

    switch (lowestDomain) {
      case 'logic':
        return { title: 'Magic Machine Lab', route: '/playroom/magic-machine', domainLabel: 'Logic & Physics Rigs' }
      case 'creativity':
        return { title: 'Creature Lab Alchemist', route: '/games/creature-lab', domainLabel: 'Creativity & Alchemy' }
      case 'memory':
        return { title: 'Mystery Detective', route: '/playroom/mystery-detective', domainLabel: 'Memory & Forensic Clues' }
      case 'vocabulary':
        return { title: 'Potion Market Scales', route: '/playroom/potion-scales', domainLabel: 'Vocabulary & Mass Math' }
      default:
        return { title: 'Create a Fairy Tale', route: '/stories/new', domainLabel: 'Comprehension & Story Studio' }
    }
  }, [adventureProgress.cognitiveDomainScores])

  // Check Daily Login Bonus claim state once per day
  useEffect(() => {
    if (selectedProfile?.id && typeof window !== 'undefined' && window.localStorage) {
      const today = new Date().toISOString().slice(0, 10)
      const claimedKey = `orbis_daily_login_claimed_${today}_${selectedProfile.id}`
      const isClaimed = window.localStorage.getItem(claimedKey)
      if (!isClaimed) {
        setIsDailyBonusOpen(true)
      }
    }
  }, [selectedProfile?.id])

  const handleClaimDailyBonus = () => {
    if (selectedProfile?.id && typeof window !== 'undefined' && window.localStorage) {
      const today = new Date().toISOString().slice(0, 10)
      const claimedKey = `orbis_daily_login_claimed_${today}_${selectedProfile.id}`
      window.localStorage.setItem(claimedKey, 'true')
    }
    setIsDailyBonusOpen(false)
  }

  useEffect(() => {
    async function loadStories() {
      if (!user) return

      setIsLoadingStories(true)

      const { data, error } = await storyService.getStoriesForUser(user.id)

      if (!error && data) {
        setStories((data as StoryRecord[]).slice(0, 4))
      } else {
        setStories([])
      }

      setIsLoadingStories(false)
    }

    void loadStories()
  }, [user])

  async function handleSignOut() {
    await signOut()
    navigate('/auth', { replace: true })
  }

  if (!user) {
    return null
  }

  function formatDate(value: string | null | undefined) {
    if (!value) return 'Recently'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return 'Recently'
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <PageContainer
      title={t('workspace_title')}
      intro={t('workspace_intro')}
    >
      <StickyBackButton fallbackTo="/overworld" label="Overworld Map" />

      {/* Ambient Stardust Particles */}
      <ParticleField count={28} particleType="stardust" speed={0.4} color="#8b5cf6" />

      {/* Daily Login Streak Bonus Modal */}
      <DailyLoginModal
        isOpen={isDailyBonusOpen}
        onClaim={handleClaimDailyBonus}
        currentStreak={adventureProgress.currentStreak}
        childName={adventureProgress.childName}
      />

      {/* Persistent Live Top Explorer Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <TopExplorerBar />
      </div>

      {/* Studio & Explorer Command Center Hero */}
      <GlassPanel
        tier="hero"
        style={{
          padding: 'clamp(1.5rem, 3.5vw, 2.25rem)',
          marginBottom: '2rem',
          borderRadius: '28px',
          border: '1.5px solid rgba(139, 92, 246, 0.25)',
          boxShadow: '0 20px 48px rgba(2, 6, 23, 0.6), 0 0 35px rgba(139, 92, 246, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="Quick Actions & Explorer Hub"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                  color: '#1e1b4b',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AnimatedIcon kind="star" size={12} color="#1e1b4b" />
                LEVEL {adventureProgress.level} EXPLORER
              </span>
              <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 700 }}>
                {adventureProgress.explorerTitle}
              </span>
            </div>

            <h2
              style={{
                margin: '0 0 6px',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
              }}
            >
              Welcome back, {adventureProgress.childName}!
            </h2>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              Recommended focus: <strong style={{ color: '#fef08a' }}>{recommendedActivity.domainLabel}</strong>. Jump in to earn stars and level up your cosmic explorer passport!
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '8px 14px',
                borderRadius: '14px',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                textAlign: 'center',
                minWidth: '76px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AnimatedIcon kind="star" size={14} color="#fbbf24" />
                {adventureProgress.stars}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>Stars</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '8px 14px',
                borderRadius: '14px',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                textAlign: 'center',
                minWidth: '76px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AnimatedIcon kind="crystal" size={14} color="#c084fc" />
                {adventureProgress.xp}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>Total XP</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '8px 14px',
                borderRadius: '14px',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                textAlign: 'center',
                minWidth: '76px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AnimatedIcon kind="radiance" size={14} color="#f87171" />
                {adventureProgress.currentStreak}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>Streak</div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <MagicalButton
            variant="cosmic"
            size="md"
            onClick={() => {
              sfxService.play('star_pop')
              HapticsService.medium()
              navigate(recommendedActivity.route)
            }}
          >
            <AnimatedIcon kind="play" size={16} color="#ffffff" />
            <span>Play Next Lesson: {recommendedActivity.title} (+30 XP)</span>
          </MagicalButton>

          <MagicalButton
            variant="secondary"
            size="md"
            onClick={() => {
              sfxService.play('star_pop')
              navigate('/stories/new')
            }}
          >
            <AnimatedIcon kind="wand" size={16} color="#c084fc" />
            <span>{t('create_new_story')}</span>
          </MagicalButton>

          <MagicalButton
            variant="ghost"
            size="md"
            onClick={() => {
              sfxService.play('card_flip')
              navigate('/games')
            }}
          >
            <AnimatedIcon kind="globe" size={16} color="#38bdf8" />
            <span>Playroom Map</span>
          </MagicalButton>

          <MagicalButton
            variant="ghost"
            size="md"
            onClick={() => {
              sfxService.play('star_pop')
              navigate('/')
            }}
          >
            <AnimatedIcon kind="citadel" size={16} color="#fbbf24" />
            <span>Overworld Map</span>
          </MagicalButton>

          <MagicalButton
            variant="ghost"
            size="md"
            onClick={() => {
              sfxService.play('star_pop')
              navigate('/passport')
            }}
          >
            <AnimatedIcon kind="scroll" size={16} color="#34d399" />
            <span>Adventure Passport</span>
          </MagicalButton>

          <button
            type="button"
            onClick={() => navigate('/stories')}
            style={{
              background: 'transparent',
              color: '#cbd5e1',
              border: 'none',
              padding: '0.75rem 1rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AnimatedIcon kind="rune" size={16} color="#cbd5e1" />
            <span>{t('view_all_stories')} ({stories.length})</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            {t('sign_out')}
          </button>
        </div>

        {/* 4 Flagship Playroom Station Quick Launch Portals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '12px',
            marginTop: '0.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '1.25rem',
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              sfxService.play('essence_pickup')
              HapticsService.light()
              navigate('/games/creature-lab')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(236, 72, 153, 0.35)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
              minHeight: '80px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <AnimatedIcon kind="biome" size={24} color="#f472b6" glowColor="#f472b6" animate="sparkle" />
              <span style={{ fontSize: '10px', color: '#f472b6', fontWeight: 800 }}>
                {adventureProgress.stations.creatureLab.completedCount}/24 Species
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#f8fafc' }}>Creature Lab</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Elemental Alchemy</div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              sfxService.play('spring_bounce')
              HapticsService.light()
              navigate('/playroom/magic-machine')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
              minHeight: '80px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <AnimatedIcon kind="circuit" size={24} color="#22d3ee" glowColor="#22d3ee" animate="pulse" />
              <span style={{ fontSize: '10px', color: '#22d3ee', fontWeight: 800 }}>
                {adventureProgress.stations.magicMachine.completedCount}/12 Inventions
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#f8fafc' }}>Magic Machine</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Physics & Gadgets</div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              sfxService.play('detective_lens_scan')
              HapticsService.light()
              navigate('/playroom/mystery-detective')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
              minHeight: '80px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <AnimatedIcon kind="enigma" size={24} color="#c084fc" glowColor="#c084fc" animate="float" />
              <span style={{ fontSize: '10px', color: '#c084fc', fontWeight: 800 }}>
                {adventureProgress.stations.mysteryDetective.completedCount}/12 Cases
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#f8fafc' }}>Mystery Detective</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Clues & Deduction</div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              sfxService.play('potion_bubble')
              HapticsService.light()
              navigate('/playroom/potion-scales')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
              minHeight: '80px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <AnimatedIcon kind="scale" size={24} color="#34d399" glowColor="#34d399" animate="pulse" />
              <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 800 }}>
                {adventureProgress.stations.potionScales.completedCount}/18 Potions
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#f8fafc' }}>Potion Scales</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Balance & Math</div>
          </div>
        </div>
      </GlassPanel>

      {/* Recent Stories Grid */}
      <section className="dashboard-recent" aria-label="Recent Stories">
        <div className="dashboard-section-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.35rem',
                fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
              }}
            >
              {t('recent_stories')}
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {t('continue_reading_sub')}
            </span>
          </div>
          {stories.length > 0 ? (
            <MagicalButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/stories')}
            >
              {t('see_all_stories')}
            </MagicalButton>
          ) : null}
        </div>

        {isLoadingStories ? (
          <div className="loading-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <LoadingSpinner />
            <p style={{ color: '#94a3b8', marginTop: '1rem' }}>{t('loading')}</p>
          </div>
        ) : stories.length > 0 ? (
          <div
            className="dashboard-story-grid"
            role="list"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1rem',
            }}
          >
            {stories.map((story) => (
              <GlassPanel
                key={story.id}
                tier="floating"
                style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
                role="listitem"
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AnimatedIcon kind="scroll" size={24} color="#c084fc" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                          textTransform: 'uppercase',
                        }}
                      >
                        {story.status ?? 'draft'}
                      </span>
                      {story.reading_level ? (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                          }}
                        >
                          {story.reading_level}
                        </span>
                      ) : null}
                    </div>

                    <h4
                      style={{
                        margin: '0 0 4px',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: '#f8fafc',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {story.title}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {story.child_name ? (
                        <span>Hero: {story.child_name}{story.child_age ? ` (${story.child_age} yrs)` : ''}</span>
                      ) : null}
                      <span>Created: {formatDate(story.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <MagicalButton
                    type="button"
                    variant="cosmic"
                    size="sm"
                    style={{ width: '100%' }}
                    onClick={() => {
                      sfxService.play('star_pop')
                      navigate(`/stories/${story.id}`)
                    }}
                    aria-label={`Open story: ${story.title}`}
                  >
                    <AnimatedIcon kind="play" size={14} color="#ffffff" />
                    <span>{t('open_story')}</span>
                  </MagicalButton>
                </div>
              </GlassPanel>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🌟"
            title={t('no_stories_yet')}
            description={t('no_stories_desc')}
            action={
              <MagicalButton
                type="button"
                variant="cosmic"
                size="md"
                onClick={() => navigate('/stories/new')}
              >
                <AnimatedIcon kind="wand" size={16} color="#ffffff" />
                <span>{t('create_first_story')}</span>
              </MagicalButton>
            }
          />
        )}
      </section>
    </PageContainer>
  )
}
