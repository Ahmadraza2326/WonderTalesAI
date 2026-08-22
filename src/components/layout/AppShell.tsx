import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileBottomNav } from './MobileBottomNav'
import { useI18n } from '../../context/I18nContext'

type AppShellProps = {
  children: ReactNode
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export function AppShell({ children, theme, toggleTheme }: AppShellProps) {
  const { isRTL, locale } = useI18n()

  return (
    <div className="app-shell" dir={isRTL ? 'rtl' : 'ltr'} data-locale={locale}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content" className="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
