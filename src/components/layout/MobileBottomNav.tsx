import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../context/I18nContext'

export function MobileBottomNav() {
  const { user } = useAuth()
  const { t } = useI18n()

  const profileOrAuthLabel = user ? t('profile') : t('sign_in')

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label={t('home')}
      >
        <span className="mobile-nav-icon" aria-hidden="true">🏰</span>
        <span className="mobile-nav-label">{t('home')}</span>
      </NavLink>

      <NavLink
        to="/stories/new"
        className={({ isActive }) =>
          `mobile-nav-item mobile-nav-item--create ${isActive ? 'active' : ''}`
        }
        aria-label={t('create_story')}
      >
        <span className="mobile-nav-icon" aria-hidden="true">✨</span>
        <span className="mobile-nav-label">{t('create')}</span>
      </NavLink>

      <NavLink
        to="/stories"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label={t('my_stories')}
      >
        <span className="mobile-nav-icon" aria-hidden="true">📚</span>
        <span className="mobile-nav-label">{t('my_stories')}</span>
      </NavLink>


      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label={t('workspace')}
      >
        <span className="mobile-nav-icon" aria-hidden="true">🧭</span>
        <span className="mobile-nav-label">{t('workspace')}</span>
      </NavLink>

      <NavLink
        to={user ? '/profile' : '/auth'}
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
        aria-label={profileOrAuthLabel}
      >
        <span className="mobile-nav-icon" aria-hidden="true">
          {user ? '👤' : '🔑'}
        </span>
        <span className="mobile-nav-label">{profileOrAuthLabel}</span>
      </NavLink>
    </nav>
  )
}
