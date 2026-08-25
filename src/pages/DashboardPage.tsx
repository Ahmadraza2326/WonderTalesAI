import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { storyService } from '../services/storyService'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { useChildProfiles } from '../hooks/useChildProfiles'
import { calculateAdventureProgress } from '../services/progressionService'
import { sfxService } from '../services/audio/sfxService'
import type { StoryRecord } from '../types/story'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useI18n()
  const { selectedProfile } = useChildProfiles()
  const [stories, setStories] = useState<StoryRecord[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)

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
      {/* Studio & Explorer Command Center Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          color: '#ffffff',
          boxShadow: '0 16px 36px rgba(30, 27, 75, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="Quick Actions & Explorer Hub"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: '#fbbf24',
                  color: '#1e1b4b',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                }}
              >
                ★ LEVEL {adventureProgress.level} EXPLORER
              </span>
              <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 700 }}>
                {adventureProgress.explorerTitle}
              </span>
            </div>

            <h2 style={{ margin: '0 0 6px', fontSize: '1.85rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Welcome back, {adventureProgress.childName}! ✨
            </h2>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              Ready for your next learning quest? Create new magical stories or jump into the Playroom stations to earn stars and unlock real science discoveries.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#fbbf24' }}>⭐ {adventureProgress.stars}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Stars</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#c084fc' }}>⚡ {adventureProgress.xp}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Total XP</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#f87171' }}>🔥 {adventureProgress.currentStreak}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Streak</div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              sfxService.play('star_pop')
              navigate('/stories/new')
            }}
            style={{
              padding: '0.85rem 1.6rem',
              fontSize: '1rem',
              fontWeight: 800,
              borderRadius: '0.85rem',
              boxShadow: '0 4px 16px rgba(108, 92, 231, 0.4)',
            }}
          >
            ✨ {t('create_new_story')}
          </button>

          <button
            type="button"
            onClick={() => {
              sfxService.play('card_flip')
              navigate('/games')
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '0.85rem 1.4rem',
              borderRadius: '0.85rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🪐 Playroom Map</span>
            <span style={{ fontSize: '11px', background: '#ec4899', padding: '2px 6px', borderRadius: '9999px' }}>4 Stations</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfxService.play('star_pop')
              navigate('/overworld')
            }}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem 1.4rem',
              borderRadius: '0.85rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)',
            }}
          >
            <span>🗺️ Overworld Map</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfxService.play('star_pop')
              navigate('/passport')
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '0.85rem 1.4rem',
              borderRadius: '0.85rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🧭 Adventure Passport</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/stories')}
            style={{
              background: 'transparent',
              color: '#cbd5e1',
              border: 'none',
              padding: '0.85rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📚 {t('view_all_stories')} ({stories.length})
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🚪 {t('sign_out')}
          </button>
        </div>

        {/* 4 Flagship Playroom Station Quick Launch Portals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
              navigate('/games/creature-lab')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>🧪</span>
              <span style={{ fontSize: '10px', color: '#f472b6', fontWeight: 800 }}>
                {adventureProgress.stations.creatureLab.completedCount}/24 Species
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>Creature Lab</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Elemental Alchemy</div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              sfxService.play('spring_bounce')
              navigate('/playroom/magic-machine')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <span style={{ fontSize: '10px', color: '#22d3ee', fontWeight: 800 }}>
                {adventureProgress.stations.magicMachine.completedCount}/12 Inventions
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>Magic Machine</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Physics & Gadgets</div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              sfxService.play('detective_lens_scan')
              navigate('/playroom/mystery-detective')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>🔍</span>
              <span style={{ fontSize: '10px', color: '#c084fc', fontWeight: 800 }}>
                {adventureProgress.stations.mysteryDetective.completedCount}/12 Cases
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>Mystery Detective</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Clues & Deduction</div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              sfxService.play('potion_bubble')
              navigate('/playroom/potion-scales')
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>⚖️</span>
              <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 800 }}>
                {adventureProgress.stations.potionScales.completedCount}/18 Potions
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>Potion Scales</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Balance & Math</div>
          </div>
        </div>
      </section>

      {/* Recent Stories Grid */}
      <section className="dashboard-recent" aria-label="Recent Stories">
        <div className="dashboard-section-header">
          <div className="dashboard-section-header__title">
            <h3>{t('recent_stories')}</h3>
            <span className="dashboard-section-header__sub">
              {t('continue_reading_sub')}
            </span>
          </div>
          {stories.length > 0 ? (
            <button
              type="button"
              className="button button-secondary dashboard-view-all-btn"
              onClick={() => navigate('/stories')}
            >
              {t('see_all_stories')}
            </button>
          ) : null}
        </div>

        {isLoadingStories ? (
          <div className="loading-state">
            <LoadingSpinner />
            <p>{t('loading')}</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="dashboard-story-grid" role="list">
            {stories.map((story) => (
              <article key={story.id} className="dashboard-story-card card-panel" role="listitem">
                <div className="dashboard-story-card__icon" aria-hidden="true">
                  📖
                </div>

                <div className="dashboard-story-card__body">
                  <div className="dashboard-story-card__tags">
                    <span className="card-pill">{story.status ?? 'draft'}</span>
                    {story.reading_level ? (
                      <span className="card-pill card-pill--level">{story.reading_level}</span>
                    ) : null}
                  </div>

                  <h4 className="dashboard-story-card__title">{story.title}</h4>

                  <div className="dashboard-story-card__meta">
                    {story.child_name ? (
                      <span>👤 {story.child_name}{story.child_age ? ` (${story.child_age} yrs)` : ''}</span>
                    ) : null}
                    <span>📅 {formatDate(story.created_at)}</span>
                  </div>
                </div>

                <div className="dashboard-story-card__actions">
                  <button
                    type="button"
                    className="button button-primary dashboard-story-card__open-btn"
                    onClick={() => navigate(`/stories/${story.id}`)}
                    aria-label={`Open story: ${story.title}`}
                  >
                    {t('open_story')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🌟"
            title={t('no_stories_yet')}
            description={t('no_stories_desc')}
            action={
              <button
                type="button"
                className="button button-primary"
                onClick={() => navigate('/stories/new')}
              >
                ✨ {t('create_first_story')}
              </button>
            }
          />
        )}
      </section>
    </PageContainer>
  )
}
