import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'

type HeaderProps = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/auth', label: 'Auth' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/stories/new', label: 'Create Story' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
]

export function Header({ theme, toggleTheme }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand-block">
        <NavLink to="/" className="brand-link">
          WonderTalesAI
        </NavLink>
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Button variant="secondary" onClick={toggleTheme} ariaLabel={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </Button>
    </header>
  )
}
