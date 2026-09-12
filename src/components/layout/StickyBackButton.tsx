import React from 'react'
import { useNavigate } from 'react-router-dom'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export interface StickyBackButtonProps {
  fallbackTo?: string
  label?: string
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
}

export const StickyBackButton: React.FC<StickyBackButtonProps> = ({
  fallbackTo = '/',
  label = 'Back',
  ariaLabel,
  className = '',
  style = {},
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    HapticsService.light()
    sfxService.play('card_flip')

    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate(fallbackTo)
    }
  }

  return (
    <div
      className={`sticky-back-container ${className}`.trim()}
      style={{
        position: 'sticky',
        top: '12px',
        zIndex: 40,
        marginBottom: '1rem',
        display: 'inline-flex',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label={ariaLabel || `Go back to ${label}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.45rem 1rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          color: '#f8fafc',
          fontSize: '0.88rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
          minHeight: '44px',
          minWidth: '44px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.borderColor = '#a855f7'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
        }}
      >
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>←</span>
        <span>{label}</span>
      </button>
    </div>
  )
}
