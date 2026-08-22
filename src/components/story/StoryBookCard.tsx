import React from 'react'
import { Link } from 'react-router-dom'
import type { StoryRecord } from '../../types/story'
import { useI18n } from '../../context/I18nContext'

export interface StoryBookCardProps {
  story: StoryRecord
  onToggleFavorite: (storyId: string, currentFavorite: boolean) => void
  onDeleteRequest: (story: StoryRecord) => void
}

function getThemeIcon(theme: string | null | undefined): string {
  if (!theme) return '📖'
  const lower = theme.toLowerCase()
  if (lower.includes('space') || lower.includes('galaxy') || lower.includes('star')) return '🚀'
  if (lower.includes('magic') || lower.includes('wizard') || lower.includes('fairy')) return '✨'
  if (lower.includes('animal') || lower.includes('jungle') || lower.includes('forest')) return '🦁'
  if (lower.includes('ocean') || lower.includes('sea') || lower.includes('underwater')) return '🐬'
  if (lower.includes('dinosaur') || lower.includes('prehistoric')) return '🦖'
  if (lower.includes('adventure') || lower.includes('treasure')) return '🗺️'
  if (lower.includes('bedtime') || lower.includes('sleep') || lower.includes('dream')) return '🌙'
  if (lower.includes('superhero') || lower.includes('hero')) return '⚡'
  return '📖'
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Recently'
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return 'Recently'
  return parsedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const StoryBookCard: React.FC<StoryBookCardProps> = ({
  story,
  onToggleFavorite,
  onDeleteRequest,
}) => {
  const { t } = useI18n()
  const isFavorite = Boolean(story.is_favorite)
  const themeIcon = getThemeIcon(story.theme)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(story.id, isFavorite)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDeleteRequest(story)
  }

  return (
    <article className="storybook-card" role="listitem" aria-labelledby={`story-title-${story.id}`}>
      {/* Visual Book Cover Top Banner */}
      <div className="storybook-cover-banner">
        <span className="storybook-cover-icon" aria-hidden="true">
          {themeIcon}
        </span>
        <button
          type="button"
          className={`storybook-favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? t('unfavorite') : t('favorite')}
          aria-pressed={isFavorite}
          title={isFavorite ? t('favorites') : t('favorite')}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      <div className="storybook-body">
        {/* Badges / Metadata Row */}
        <div className="storybook-pills-row">
          {story.child_name && (
            <span className="storybook-pill hero-pill">
              👶 {story.child_name} {story.child_age ? `(${story.child_age}y)` : ''}
            </span>
          )}
          {story.reading_level && (
            <span className="storybook-pill level-pill">
              {story.reading_level}
            </span>
          )}
          {story.theme && (
            <span className="storybook-pill theme-pill">
              {story.theme}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 id={`story-title-${story.id}`} className="storybook-title">
          <Link to={`/stories/${story.id}`} className="storybook-title-link">
            {story.title}
          </Link>
        </h3>

        {/* Story details summary */}
        <div className="storybook-meta-row">
          <span className="storybook-meta-item">
            🌐 {story.language || 'English'}
          </span>
          <span className="storybook-meta-item">
            🗓️ {formatDate(story.created_at)}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="storybook-footer">
        <Link
          to={`/stories/${story.id}`}
          className="btn btn-primary btn-sm storybook-read-btn"
          aria-label={`${t('open_story')}: ${story.title}`}
        >
          {t('open_story')} →
        </Link>
        <button
          type="button"
          className="btn-icon-delete"
          onClick={handleDeleteClick}
          aria-label={`${t('delete_story')}: ${story.title}`}
          title={t('delete_story')}
        >
          🗑️
        </button>
      </div>
    </article>
  )
}
