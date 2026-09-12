import React, { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileBottomNav } from './MobileBottomNav'
import { CosmicAtmosphereBackdrop } from '../ui/design/CosmicAtmosphereBackdrop'
import { useI18n } from '../../context/I18nContext'

type AppShellProps = {
  children: ReactNode
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export function AppShell({ children, theme, toggleTheme }: AppShellProps) {
  const { isRTL, locale } = useI18n()
  const location = useLocation()
  const isOverworld = location.pathname === '/' || location.pathname === '/overworld'

  return (
    <div
      className={`app-shell ${isOverworld ? 'app-shell--overworld' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-locale={locale}
      data-theme={isOverworld ? 'dark' : undefined}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
      }}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Global High-Performance Cosmic Atmosphere Starfield */}
      <CosmicAtmosphereBackdrop />

      <Header theme={isOverworld ? 'dark' : theme} toggleTheme={toggleTheme} />

      <main
        id="main-content"
        className="main-content"
        tabIndex={-1}
        style={{
          position: isOverworld ? 'absolute' : 'relative',
          inset: isOverworld ? 0 : undefined,
          zIndex: 1,
          flex: '1 0 auto',
          width: '100%',
          height: isOverworld ? '100%' : undefined,
          boxSizing: 'border-box',
          padding: 0,
          margin: 0,
        }}
      >
        {children}
      </main>

      {!isOverworld && <Footer />}
      {!isOverworld && <MobileBottomNav />}
    </div>
  )
}
