import React from 'react'
import { useI18n } from '../../context/I18nContext'

export interface StoryFilterState {
  searchQuery: string
  favoritesOnly: boolean
  selectedChild: string | null
  selectedTheme: string | null
  selectedLanguage: string | null
}

export interface StorySearchFilterBarProps {
  filters: StoryFilterState
  onFilterChange: (updates: Partial<StoryFilterState>) => void
  onResetFilters: () => void
  totalCount: number
  filteredCount: number
  favoriteCount: number
  availableChildren: string[]
  availableThemes: string[]
  availableLanguages: string[]
}

export const StorySearchFilterBar: React.FC<StorySearchFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
  favoriteCount,
  availableChildren,
  availableThemes,
  availableLanguages,
}) => {
  const { t } = useI18n()

  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.favoritesOnly ||
    filters.selectedChild !== null ||
    filters.selectedTheme !== null ||
    filters.selectedLanguage !== null

  return (
    <div className="story-filter-bar" role="search" aria-label={t('library_title')}>
      {/* 1. Instant Search Input */}
      <div className="story-search-input-wrapper">
        <span className="story-search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          className="story-search-input"
          placeholder={t('search_stories_placeholder')}
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          aria-label={t('search_stories_placeholder')}
        />
        {filters.searchQuery && (
          <button
            type="button"
            className="story-search-clear-btn"
            onClick={() => onFilterChange({ searchQuery: '' })}
            aria-label={t('reset_filters')}
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Main Preset Filter Pills */}
      <div className="story-filter-pills-row" role="toolbar" aria-label={t('library_title')}>
        <button
          type="button"
          className={`filter-pill-btn ${!filters.favoritesOnly ? 'active' : ''}`}
          onClick={() => onFilterChange({ favoritesOnly: false })}
          aria-pressed={!filters.favoritesOnly}
        >
          📚 {t('all_stories')} ({totalCount})
        </button>

        <button
          type="button"
          className={`filter-pill-btn ${filters.favoritesOnly ? 'active' : ''}`}
          onClick={() => onFilterChange({ favoritesOnly: !filters.favoritesOnly })}
          aria-pressed={filters.favoritesOnly}
        >
          ⭐ {t('favorites')} ({favoriteCount})
        </button>

        {/* Dynamic Child Filter dropdown */}
        {availableChildren.length > 1 && (
          <div className="filter-select-wrapper">
            <select
              className={`filter-select ${filters.selectedChild ? 'has-value' : ''}`}
              value={filters.selectedChild ?? ''}
              onChange={(e) =>
                onFilterChange({ selectedChild: e.target.value ? e.target.value : null })
              }
              aria-label={t('all_heroes')}
            >
              <option value="">👶 {t('all_heroes')}</option>
              {availableChildren.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Theme Filter */}
        {availableThemes.length > 1 && (
          <div className="filter-select-wrapper">
            <select
              className={`filter-select ${filters.selectedTheme ? 'has-value' : ''}`}
              value={filters.selectedTheme ?? ''}
              onChange={(e) =>
                onFilterChange({ selectedTheme: e.target.value ? e.target.value : null })
              }
              aria-label={t('all_themes')}
            >
              <option value="">🎨 {t('all_themes')}</option>
              {availableThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Language Filter */}
        {availableLanguages.length > 1 && (
          <div className="filter-select-wrapper">
            <select
              className={`filter-select ${filters.selectedLanguage ? 'has-value' : ''}`}
              value={filters.selectedLanguage ?? ''}
              onChange={(e) =>
                onFilterChange({ selectedLanguage: e.target.value ? e.target.value : null })
              }
              aria-label={t('all_languages')}
            >
              <option value="">🌐 {t('all_languages')}</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset All Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={onResetFilters}
            aria-label={t('reset_filters')}
          >
            ✕ {t('reset_filters')} ({filteredCount})
          </button>
        )}
      </div>
    </div>
  )
}
