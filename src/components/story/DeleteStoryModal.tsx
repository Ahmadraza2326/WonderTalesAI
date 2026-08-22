import React, { useEffect } from 'react'
import { useI18n } from '../../context/I18nContext'

export interface DeleteStoryModalProps {
  isOpen: boolean
  storyTitle: string | null
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export const DeleteStoryModal: React.FC<DeleteStoryModalProps> = ({
  isOpen,
  storyTitle,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const { t } = useI18n()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isDeleting, onClose])

  if (!isOpen) return null

  return (
    <div
      className="add-child-modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <div
        className="add-child-modal-content delete-story-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-story-dialog-title"
      >
        <div className="delete-story-header">
          <span className="delete-story-icon" aria-hidden="true">
            🗑️
          </span>
          <div>
            <h3 id="delete-story-dialog-title" className="delete-story-title">
              {t('delete_story_confirm_title')}
            </h3>
            <p className="delete-story-subtitle">
              {t('delete_story_confirm_desc')}
            </p>
          </div>
        </div>

        {storyTitle && (
          <div className="delete-story-preview" role="region" aria-label={t('delete_story')}>
            <blockquote className="delete-story-preview-title">"{storyTitle}"</blockquote>
          </div>
        )}

        <div className="add-child-modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            aria-label={t('delete_story')}
          >
            {isDeleting ? t('deleting') : t('delete_story')}
          </button>
        </div>
      </div>
    </div>
  )
}
