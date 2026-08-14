import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

type HeaderProps = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const desktopLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/stories/new', label: 'Create Story' },
  { to: '/stories', label: 'My Stories' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
]

export function Header({ theme, toggleTheme }: HeaderProps) {
  const { user } = useAuth()

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
            Sign In
          </NavLink>
        ) : null}
      </div>
    </header>
  )
}
