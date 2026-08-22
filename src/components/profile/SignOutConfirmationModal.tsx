import React, { useEffect } from 'react'
import { useI18n } from '../../context/I18nContext'

export interface SignOutConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

export const SignOutConfirmationModal: React.FC<SignOutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  const { t } = useI18n()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  return (
    <div
      className="add-child-modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div
        className="add-child-modal-content signout-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-modal-title"
      >
        <div className="signout-modal-header">
          <span className="signout-modal-icon" aria-hidden="true">
            🚪
          </span>
          <div>
            <h3 id="signout-modal-title" className="signout-modal-title">
              {t('sign_out_title')}
            </h3>
            <p className="signout-modal-subtitle">
              {t('sign_out_desc')}
            </p>
          </div>
        </div>

        <div className="add-child-modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('stay_signed_in')}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('loading') : t('confirm_sign_out')}
          </button>
        </div>
      </div>
    </div>
  )
}

