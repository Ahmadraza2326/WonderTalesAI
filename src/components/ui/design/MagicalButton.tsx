import React, { useState } from 'react'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { AnimatedIcon, type IconKind } from './AnimatedIcon'
import type { AcademicRealm } from '../../../types/learningUniverse'
import { REALM_STYLE_CONFIGS } from '../../../styles/academyTokens'

export type MagicalButtonVariant =
  | 'primary'
  | 'secondary'
  | 'cosmic'
  | 'gold'
  | 'emerald'
  | 'ghost'
  | 'danger'
  | 'realm'

export type MagicalButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface MagicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: MagicalButtonVariant
  size?: MagicalButtonSize
  realm?: AcademicRealm
  icon?: IconKind
  iconPosition?: 'left' | 'right'
  glow?: boolean
  fullWidth?: boolean
  soundCue?: string
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none'
  isLoading?: boolean
  isSuccess?: boolean
  isGuidance?: boolean
}

export const MagicalButton: React.FC<MagicalButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  realm,
  icon,
  iconPosition = 'left',
  glow = false,
  fullWidth = false,
  soundCue = 'card_flip',
  hapticFeedback = 'light',
  isLoading = false,
  isSuccess = false,
  isGuidance = false,
  disabled = false,
  onClick,
  className = '',
  style,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const realmConfig = realm ? REALM_STYLE_CONFIGS[realm] : undefined

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          minHeight: '40px',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          borderRadius: 'var(--radius-card, 16px)',
          gap: '6px',
        }
      case 'lg':
        return {
          minHeight: '56px',
          padding: '0.875rem 1.75rem',
          fontSize: '1.125rem',
          borderRadius: 'var(--radius-panel, 24px)',
          gap: '10px',
        }
      case 'xl':
        return {
          minHeight: '64px',
          padding: '1rem 2.25rem',
          fontSize: '1.25rem',
          borderRadius: 'var(--radius-portal, 32px)',
          gap: '12px',
        }
      case 'md':
      default:
        return {
          minHeight: '48px',
          padding: '0.75rem 1.35rem',
          fontSize: '1rem',
          borderRadius: 'var(--radius-card, 16px)',
          gap: '8px',
        }
    }
  }

  const getVariantStyles = (): React.CSSProperties => {
    if (isSuccess) {
      return {
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: '#ffffff',
        border: '1.5px solid rgba(52, 211, 153, 0.6)',
        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      }
    }

    if (isGuidance) {
      return {
        background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        color: '#ffffff',
        border: '1.5px solid rgba(251, 191, 36, 0.7)',
        boxShadow: '0 8px 24px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      }
    }

    if (variant === 'realm' && realmConfig) {
      return {
        background: realmConfig.gradient,
        color: '#ffffff',
        border: `1.5px solid ${realmConfig.borderAura}`,
        boxShadow: isHovered
          ? `0 12px 30px ${realmConfig.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`
          : `0 4px 16px ${realmConfig.glowColor}`,
      }
    }

    switch (variant) {
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow: isHovered
            ? '0 10px 28px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            : '0 4px 14px rgba(245, 158, 11, 0.35)',
        }
      case 'cosmic':
        return {
          background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(168, 85, 247, 0.4)',
          boxShadow: isHovered
            ? '0 10px 28px rgba(124, 58, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            : '0 4px 14px rgba(124, 58, 237, 0.35)',
        }
      case 'emerald':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(52, 211, 153, 0.4)',
          boxShadow: isHovered
            ? '0 10px 28px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            : '0 4px 14px rgba(16, 185, 129, 0.35)',
        }
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(248, 113, 113, 0.4)',
          boxShadow: isHovered
            ? '0 10px 28px rgba(239, 68, 68, 0.5)'
            : '0 4px 14px rgba(239, 68, 68, 0.35)',
        }
      case 'secondary':
        return {
          background: 'rgba(30, 41, 59, 0.75)',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isHovered
            ? '0 8px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            : '0 2px 8px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(12px)',
        }
      case 'ghost':
        return {
          background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          color: isHovered ? '#ffffff' : '#e2e8f0',
          border: '1px solid transparent',
          boxShadow: 'none',
        }
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(255, 255, 255, 0.35)',
          boxShadow: isHovered
            ? '0 10px 28px rgba(56, 189, 248, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            : '0 4px 14px rgba(56, 189, 248, 0.35)',
        }
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return

    if (soundCue) {
      sfxService.play(soundCue as any)
    }

    if (hapticFeedback === 'light') HapticsService.light()
    else if (hapticFeedback === 'medium') HapticsService.medium()
    else if (hapticFeedback === 'heavy') HapticsService.heavy()

    onClick?.(e)
  }

  const baseScale = isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.03)' : 'scale(1)'
  const baseTranslate = isPressed ? 'translateY(1px)' : isHovered ? 'translateY(-2px)' : 'translateY(0)'

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false)
        setIsPressed(false)
      }}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      className={`orbis-magical-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
        fontWeight: 'var(--font-weight-bold, 700)',
        letterSpacing: '0.02em',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        width: fullWidth ? '100%' : 'auto',
        outline: isFocused ? '3px solid var(--orbis-state-focus, #38bdf8)' : 'none',
        outlineOffset: '2px',
        transform: `${baseTranslate} ${baseScale}`,
        transition: 'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 180ms ease, background 180ms ease, opacity 180ms ease',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style,
      }}
    >
      {/* Specular gleam effect */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22), transparent)',
          pointerEvents: 'none',
        }}
      />

      {isLoading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <AnimatedIcon kind="sparkle" size={20} animate="spin" />
          <span>{children}</span>
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <AnimatedIcon kind={icon} size={size === 'xl' ? 26 : size === 'lg' ? 22 : 18} />
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <AnimatedIcon kind={icon} size={size === 'xl' ? 26 : size === 'lg' ? 22 : 18} />
          )}
        </>
      )}
    </button>
  )
}
