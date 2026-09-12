import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import { StoryForm, type StoryFormValues } from '../components/ui/StoryForm'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { storyService } from '../services/storyService'
import { storyOrchestrator } from '../services/StoryOrchestrator'
import { generateStoryBook } from '../services/storybookGenerator'
import { storyAssetCacheService } from '../services/storyAssetCacheService'
import { HapticsService } from '../services/hapticsService'
import type { StoryRecord } from '../types/story'
import {
  StorySearchFilterBar,
  type StoryFilterState,
} from '../components/story/StorySearchFilterBar'
import { StoryBookCard } from '../components/story/StoryBookCard'
import { DeleteStoryModal } from '../components/story/DeleteStoryModal'

const INITIAL_FILTERS: StoryFilterState = {
  searchQuery: '',
  favoritesOnly: false,
  selectedChild: null,
  selectedTheme: null,
  selectedLanguage: null,
}

export function StoryLibraryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'create' ? 'create' : 'library'
  const [activeSubTab, setActiveSubTab] = useState<'library' | 'create'>(initialTab)

  const { user } = useAuth()
  const { t } = useI18n()

  const [stories, setStories] = useState<StoryRecord[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [isCreatingStory, setIsCreatingStory] = useState(false)

  // Filters state
  const [filters, setFilters] = useState<StoryFilterState>(INITIAL_FILTERS)

  // Deletion modal state
  const [storyToDelete, setStoryToDelete] = useState<StoryRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const loadStories = useCallback(async () => {
    if (!user) {
      setErrorMessage(t('auth_intro'))
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const { data, error } = await storyService.getStoriesForUser(user.id)

    if (error) {
      setErrorMessage(t('generic_auth_error'))
      setIsLoading(false)
      return
    }

    setStories((data ?? []) as StoryRecord[])
    setIsLoading(false)
  }, [user, t])

  useEffect(() => {
    void loadStories()
  }, [loadStories])

  // Extract unique dynamic filter options
  const availableChildren = useMemo(() => {
    const names = new Set<string>()
    for (const story of stories) {
      if (story.child_name && story.child_name.trim()) {
        names.add(story.child_name.trim())
      }
    }
    return Array.from(names).sort()
  }, [stories])

  const availableThemes = useMemo(() => {
    const themes = new Set<string>()
    for (const story of stories) {
      if (story.theme && story.theme.trim()) {
        themes.add(story.theme.trim())
      }
    }
    return Array.from(themes).sort()
  }, [stories])

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>()
    for (const story of stories) {
      if (story.language && story.language.trim()) {
        langs.add(story.language.trim())
      }
    }
    return Array.from(langs).sort()
  }, [stories])

  const favoriteCount = useMemo(() => {
    return stories.filter((s) => Boolean(s.is_favorite)).length
  }, [stories])

  // Filtered stories logic
  const filteredStories = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase()

    return stories.filter((story) => {
      // 1. Favorites filter
      if (filters.favoritesOnly && !story.is_favorite) {
        return false
      }

      // 2. Child filter
      if (
        filters.selectedChild &&
        story.child_name?.trim().toLowerCase() !== filters.selectedChild.toLowerCase()
      ) {
        return false
      }

      // 3. Theme filter
      if (
        filters.selectedTheme &&
        story.theme?.trim().toLowerCase() !== filters.selectedTheme.toLowerCase()
      ) {
        return false
      }

      // 4. Language filter
      if (
        filters.selectedLanguage &&
        story.language?.trim().toLowerCase() !== filters.selectedLanguage.toLowerCase()
      ) {
        return false
      }

      // 5. Search query matching
      if (query) {
        const matchTitle = story.title?.toLowerCase().includes(query) ?? false
        const matchChild = story.child_name?.toLowerCase().includes(query) ?? false
        const matchTheme = story.theme?.toLowerCase().includes(query) ?? false
        const matchCharacters = story.characters?.toLowerCase().includes(query) ?? false
        const matchMoral = story.moral?.toLowerCase().includes(query) ?? false
        const matchReadingLevel = story.reading_level?.toLowerCase().includes(query) ?? false

        if (
          !matchTitle &&
          !matchChild &&
          !matchTheme &&
          !matchCharacters &&
          !matchMoral &&
          !matchReadingLevel
        ) {
          return false
        }
      }

      return true
    })
  }, [stories, filters])

  // Optimistic Favorite Toggle
  const handleToggleFavorite = async (storyId: string, currentFavorite: boolean) => {
    if (!user) return
    const nextFavorite = !currentFavorite

    // Optimistic UI update
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, is_favorite: nextFavorite } : s))
    )

    const { error } = await storyService.toggleFavorite(storyId, user.id, nextFavorite)

    if (error) {
      // Rollback on failure
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? { ...s, is_favorite: currentFavorite } : s))
      )
      setErrorMessage(t('generic_auth_error'))
      setTimeout(() => setErrorMessage(null), 3000)
    } else {
      setFeedbackMessage(
        nextFavorite ? `⭐ ${t('favorites')}` : t('unfavorite')
      )
      setTimeout(() => setFeedbackMessage(null), 2500)
    }
  }

  // Safe Deletion Flow
  const handleRequestDelete = (story: StoryRecord) => {
    setStoryToDelete(story)
  }

  const handleConfirmDelete = async () => {
    if (!user || !storyToDelete) return

    setIsDeleting(true)
    const targetId = storyToDelete.id
    const targetTitle = storyToDelete.title

    const { error } = await storyService.deleteStory(targetId, user.id)
    setIsDeleting(false)

    if (error) {
      setErrorMessage(t('generic_auth_error'))
      setStoryToDelete(null)
      return
    }

    // Remove from UI
    setStories((prev) => prev.filter((s) => s.id !== targetId))
    setStoryToDelete(null)
    setFeedbackMessage(`"${targetTitle}" ${t('delete')}`)
    setTimeout(() => setFeedbackMessage(null), 3000)
  }

  const handleFilterUpdate = (updates: Partial<StoryFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
  }

  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.favoritesOnly ||
    filters.selectedChild !== null ||
    filters.selectedTheme !== null ||
    filters.selectedLanguage !== null

  // 1-Click Story Creation Action
  const handleCreateStory = async (values: StoryFormValues) => {
    if (!user) {
      setErrorMessage(t('auth_intro'))
      return
    }

    setIsCreatingStory(true)
    setErrorMessage(null)
    setFeedbackMessage(null)

    const { data: createdStory, error: createErr } = await storyService.createStory(user.id, values)

    if (createErr || !createdStory) {
      setErrorMessage(createErr?.message || 'Unable to create story.')
      setIsCreatingStory(false)
      return
    }

    try {
      let finalizedStory = createdStory
      if (!createdStory.learning_package) {
        try {
          finalizedStory = await storyOrchestrator.generateLearningPackage(createdStory, user.id)
        } catch (orchErr) {
          console.warn('Learning package generation deferred to reader:', orchErr)
        }
      }

      const storyBook = await generateStoryBook(finalizedStory)
      await storyAssetCacheService.saveStoryBook(finalizedStory, user.id, storyBook)

      setIsCreatingStory(false)
      navigate(`/stories/${finalizedStory.id}`)
    } catch (pipelineErr) {
      console.warn('Atomic story pipeline encountered non-fatal error, proceeding to reader:', pipelineErr)
      setIsCreatingStory(false)
      navigate(`/stories/${createdStory.id}`)
    }
  }

  const handleTabSwitch = (tab: 'library' | 'create') => {
    HapticsService.light()
    setActiveSubTab(tab)
    setSearchParams(tab === 'create' ? { tab: 'create' } : {})
  }

  return (
    <PageContainer
      title={activeSubTab === 'create' ? t('story_studio_title') : t('library_title')}
      intro={activeSubTab === 'create' ? t('story_studio_intro') : t('library_intro')}
    >
      <StickyBackButton fallbackTo="/overworld" label="Overworld Map" />

      {/* Workspace Sub-Tabs Navigation */}
      <div
        className="workspace-subtabs-nav"
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          borderBottom: '1.5px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => handleTabSwitch('library')}
          className={`button ${activeSubTab === 'library' ? 'button-primary' : 'button-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>📚 {t('my_stories')}</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px' }}>
            {stories.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch('create')}
          className={`button ${activeSubTab === 'create' ? 'button-primary' : 'button-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>✨ {t('create_story')}</span>
        </button>
      </div>

      {activeSubTab === 'create' ? (
        <div className="workspace-create-view" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <StoryForm
            onSubmit={handleCreateStory}
            isSubmitting={isCreatingStory}
            errorMessage={errorMessage}
            successMessage={feedbackMessage}
          />
        </div>
      ) : (
        <div className="story-library-layout">
          {/* Top Header Bar */}
          <div className="library-top-bar">
            <div className="library-title-summary">
              <span className="library-count-badge">
                📚 {stories.length} {t('my_stories')}
              </span>
              {favoriteCount > 0 && (
                <span className="library-favorites-badge">
                  ⭐ {favoriteCount} {t('favorites')}
                </span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleTabSwitch('create')}
            >
              ✨ {t('create_new_story')}
            </button>
          </div>

        {/* Feedback / Error Banners */}
        {feedbackMessage && (
          <div className="form-status success" role="status">
            ✨ {feedbackMessage}
          </div>
        )}
        {errorMessage && (
          <div className="form-status error" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Search & Filter Toolbar (only when stories exist) */}
        {!isLoading && stories.length > 0 && (
          <StorySearchFilterBar
            filters={filters}
            onFilterChange={handleFilterUpdate}
            onResetFilters={handleResetFilters}
            totalCount={stories.length}
            filteredCount={filteredStories.length}
            favoriteCount={favoriteCount}
            availableChildren={availableChildren}
            availableThemes={availableThemes}
            availableLanguages={availableLanguages}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state" aria-busy="true">
            <LoadingSpinner />
            <p>{t('loading')}</p>
          </div>
        )}

        {/* Empty Library State (No stories generated yet) */}
        {!isLoading && stories.length === 0 && !errorMessage && (
          <EmptyState
            icon="🪐"
            title={t('no_stories_yet')}
            description={t('no_stories_desc')}
            action={
              <Link to="/stories/new" className="btn btn-primary">
                ✨ {t('create_first_story')}
              </Link>
            }
          />
        )}

        {/* Empty Search State */}
        {!isLoading &&
          stories.length > 0 &&
          filteredStories.length === 0 &&
          Boolean(filters.searchQuery.trim()) && (
            <div className="library-empty-filter-card" role="region" aria-label={t('no_filtered_stories')}>
              <span className="empty-filter-icon">🔍</span>
              <h3>{t('no_filtered_stories')}</h3>
              <p>{t('no_filtered_stories_desc')}</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleFilterUpdate({ searchQuery: '' })}
              >
                {t('reset_filters')}
              </button>
            </div>
          )}

        {/* Empty Filter State */}
        {!isLoading &&
          stories.length > 0 &&
          filteredStories.length === 0 &&
          !filters.searchQuery.trim() &&
          hasActiveFilters && (
            <div className="library-empty-filter-card" role="region" aria-label={t('no_filtered_stories')}>
              <span className="empty-filter-icon">✨</span>
              <h3>{t('no_filtered_stories')}</h3>
              <p>{t('no_filtered_stories_desc')}</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetFilters}
              >
                {t('reset_filters')}
              </button>
            </div>
          )}

        {/* Story Grid */}
        {!isLoading && filteredStories.length > 0 && (
          <div className="storybook-grid" role="list" aria-label={t('library_title')}>
            {filteredStories.map((story) => (
              <StoryBookCard
                key={story.id}
                story={story}
                onToggleFavorite={handleToggleFavorite}
                onDeleteRequest={handleRequestDelete}
              />
            ))}
          </div>
        )}
      </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteStoryModal
        isOpen={Boolean(storyToDelete)}
        storyTitle={storyToDelete?.title ?? null}
        onClose={() => setStoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </PageContainer>
  )
}
