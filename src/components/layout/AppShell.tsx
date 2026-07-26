import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

type AppShellProps = {
  children: ReactNode
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export function AppShell({ children, theme, toggleTheme }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content" className="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
