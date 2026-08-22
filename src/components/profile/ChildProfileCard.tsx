import React from 'react'
import type { ChildProfile } from '../../types/childProfile'
import { useI18n } from '../../context/I18nContext'

export interface ChildProfileCardProps {
  profile: ChildProfile
  isSelected?: boolean
  onSelect?: (profile: ChildProfile) => void
  onEdit?: (profile: ChildProfile) => void
  onDelete?: (profile: ChildProfile) => void
  compact?: boolean
}

export const ChildProfileCard: React.FC<ChildProfileCardProps> = ({
  profile,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const { t } = useI18n()

  const handleClick = () => {
    onSelect?.(profile)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(profile)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${profile.name}, ${profile.age}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`child-profile-card ${isSelected ? 'selected' : ''} ${
        compact ? 'compact' : ''
      }`}
    >
      <div className="child-profile-avatar-container">
        <span className="child-profile-avatar" aria-hidden="true">
          {profile.avatar || '🌟'}
        </span>
        {isSelected && (
          <span className="child-profile-check-badge" aria-hidden="true">
            ✓
          </span>
        )}
      </div>

      <div className="child-profile-details">
        <div className="child-profile-header-row">
          <h4 className="child-profile-name">{profile.name}</h4>
          <span className="child-profile-age-pill">{profile.age}y</span>
        </div>

        <div className="child-profile-meta-row">
          <span className="child-profile-reading-level">
            📖 {profile.reading_level.charAt(0).toUpperCase() + profile.reading_level.slice(1)}
          </span>
          {profile.preferred_language && (
            <span className="child-profile-lang-pill">🌐 {profile.preferred_language}</span>
          )}
        </div>

        {!compact && profile.interests && profile.interests.length > 0 && (
          <div className="child-profile-interests-list">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="child-profile-interest-tag">
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="child-profile-interest-tag more">
                +{profile.interests.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {(onEdit || onDelete) && !compact && (
        <div className="child-profile-actions" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button
              type="button"
              className="child-profile-action-btn edit"
              onClick={() => onEdit(profile)}
              aria-label={`${t('edit')}: ${profile.name}`}
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="child-profile-action-btn delete"
              onClick={() => onDelete(profile)}
              aria-label={`${t('delete')}: ${profile.name}`}
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  )
}
