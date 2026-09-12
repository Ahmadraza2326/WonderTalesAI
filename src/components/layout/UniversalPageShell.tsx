import React, { type ReactNode } from 'react'
import { CosmicAtmosphereBackdrop } from '../ui/design/CosmicAtmosphereBackdrop'
import { useI18n } from '../../context/I18nContext'

export type PageShellVariant = 'standard' | 'immersive' | 'theater' | 'dialog'

export interface UniversalPageShellProps {
  children: ReactNode
  variant?: PageShellVariant
  realmColor?: string
  showCosmicBackdrop?: boolean
  particleCount?: number
  particleType?: 'stardust' | 'embers' | 'runes' | 'bubbles'
  topBar?: ReactNode
  bottomDock?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
  skipToContentId?: string
  contentMaxWidth?: string | number
  padded?: boolean
}

export const UniversalPageShell: React.FC<UniversalPageShellProps> = ({
  children,
  variant = 'standard',
  realmColor = '#8b5cf6',
  showCosmicBackdrop = true,
  particleCount = 35,
  particleType = 'stardust',
  topBar,
  bottomDock,
  header,
  footer,
  className = '',
  style,
  ariaLabel = 'ORBis Cosmic Page',
  skipToContentId = 'main-stage-content',
  contentMaxWidth = '1280px',
  padded = true,
}) => {
  const { isRTL, locale } = useI18n()
  const isImmersive = variant === 'immersive' || variant === 'theater'

  const computedMaxWidth = typeof contentMaxWidth === 'number' ? `${contentMaxWidth}px` : contentMaxWidth

  return (
    <div
      className={`orbis-universal-shell orbis-universal-shell--${variant} ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-locale={locale}
      data-shell-variant={variant}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#020617',
        color: '#f8fafc',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        ...style,
      }}
    >
      {/* Accessibility Skip-to-Content Link */}
      <a
        href={`#${skipToContentId}`}
        className="skip-link"
        style={{
          position: 'absolute',
          left: '1rem',
          top: '-4rem',
          zIndex: 9999,
          padding: '0.75rem 1.25rem',
          background: realmColor,
          color: '#ffffff',
          fontWeight: 800,
          borderRadius: '12px',
          textDecoration: 'none',
          transition: 'top 0.2s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = '1rem'
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-4rem'
        }}
      >
        Skip to main content
      </a>

      {/* Shared High-Performance Cosmic Ambient Starfield Layer */}
      {showCosmicBackdrop && (
        <CosmicAtmosphereBackdrop
          accentColor={realmColor}
          particleCount={particleCount}
          particleType={particleType}
        />
      )}

      {/* Top Header / Status Bar Layer */}
      {topBar && (
        <header
          className="orbis-shell-topbar"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 80,
            paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {topBar}
        </header>
      )}

      {header && !topBar && (
        <header
          className="orbis-shell-header"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 80,
            paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {header}
        </header>
      )}

      {/* Primary Stage Content Vessel */}
      <main
        id={skipToContentId}
        className={`orbis-primary-stage-vessel ${isImmersive ? 'orbis-stage--immersive' : ''}`}
        tabIndex={-1}
        role="main"
        aria-label={ariaLabel}
        style={{
          position: 'relative',
          zIndex: 1,
          flex: '1 0 auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: isImmersive ? '100%' : computedMaxWidth,
          margin: isImmersive ? 0 : '0 auto',
          paddingTop: isImmersive || !padded ? 0 : 'clamp(12px, 2.5vw, 24px)',
          paddingBottom: isImmersive || !padded ? 0 : 'clamp(64px, 8vw, 96px)',
          paddingLeft: isImmersive || !padded ? 0 : 'max(clamp(12px, 3vw, 24px), env(safe-area-inset-left, 0px))',
          paddingRight: isImmersive || !padded ? 0 : 'max(clamp(12px, 3vw, 24px), env(safe-area-inset-right, 0px))',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>

      {/* Footer Layer (if present in standard mode) */}
      {footer && !isImmersive && (
        <footer
          className="orbis-shell-footer"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
          }}
        >
          {footer}
        </footer>
      )}

      {/* Floating Bottom Explorer Dock (Standard Navigation Mode) */}
      {bottomDock && !isImmersive && (
        <nav
          className="orbis-shell-bottom-dock"
          style={{
            position: 'sticky',
            bottom: 0,
            zIndex: 90,
            width: '100%',
            paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))',
            paddingLeft: 'max(0.5rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(0.5rem, env(safe-area-inset-right, 0px))',
            boxSizing: 'border-box',
          }}
        >
          {bottomDock}
        </nav>
      )}
    </div>
  )
}
