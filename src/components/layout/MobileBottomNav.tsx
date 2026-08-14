import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function MobileBottomNav() {
  const { user } = useAuth()

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label="Home"
      >
        <span className="mobile-nav-icon" aria-hidden="true">🏰</span>
        <span className="mobile-nav-label">Home</span>
      </NavLink>

      <NavLink
        to="/stories/new"
        className={({ isActive }) =>
          `mobile-nav-item mobile-nav-item--create ${isActive ? 'active' : ''}`
        }
        aria-label="Create Story"
      >
        <span className="mobile-nav-icon" aria-hidden="true">✨</span>
        <span className="mobile-nav-label">Create</span>
      </NavLink>

      <NavLink
        to="/stories"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label="My Stories"
      >
        <span className="mobile-nav-icon" aria-hidden="true">📚</span>
        <span className="mobile-nav-label">Stories</span>
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label="Dashboard"
      >
        <span className="mobile-nav-icon" aria-hidden="true">🧭</span>
        <span className="mobile-nav-label">Workspace</span>
      </NavLink>

      <NavLink
        to={user ? '/profile' : '/auth'}
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label={user ? 'Profile' : 'Sign In'}
      >
        <span className="mobile-nav-icon" aria-hidden="true">
          {user ? '👤' : '🔑'}
        </span>
        <span className="mobile-nav-label">{user ? 'Profile' : 'Sign In'}</span>
      </NavLink>
    </nav>
  )
}
