import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../context/I18nContext'

type HeaderProps = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export function Header({ theme, toggleTheme }: HeaderProps) {
  const { user } = useAuth()
  const { t } = useI18n()

  const desktopLinks = [
    { to: '/', label: t('home'), end: true },
    { to: '/overworld', label: '🗺️ Map' },
    { to: '/games', label: '🪐 Games' },
    { to: '/sanctuary', label: '🐾 Sanctuary' },
    { to: '/passport', label: '🧭 Passport' },
    { to: '/stories/new', label: t('create_story') },
    { to: '/stories', label: t('my_stories') },
    { to: '/parent-zone', label: '👨‍👩‍👧 Parent Zone' },
    { to: '/dashboard', label: t('workspace') },
    { to: '/profile', label: t('profile') },
    { to: '/settings', label: t('settings') },
  ]

  return (
    <header className="site-header">
      <div className="brand-block">
        <NavLink to="/" className="brand-link" aria-label="ORBIS Home">
          <span className="brand-icon" aria-hidden="true">🪐</span>
          <span className="brand-text">
            ORBIS<span className="brand-text-ai">AI</span>
          </span>
        </NavLink>
      </div>

      <nav className="site-nav site-nav--desktop" aria-label="Primary navigation">
        {desktopLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <Button
          variant="secondary"
          onClick={toggleTheme}
          ariaLabel={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          className="theme-toggle-btn"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>

        {!user ? (
          <NavLink to="/auth" className="button button-primary header-auth-link">
            {t('sign_in')}
          </NavLink>
        ) : null}
      </div>
    </header>
  )
}
