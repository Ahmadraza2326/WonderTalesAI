import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from './ui/LoadingSpinner'

export function ProtectedRoute() {
  const location = useLocation()
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        className="auth-loading-state"
        role="status"
        aria-live="polite"
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '60vh',
          gap: '1rem',
          padding: '2rem',
          color: 'var(--text-muted, #64748b)',
        }}
      >
        <LoadingSpinner />
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>
          Verifying your ORBIS session…
        </p>
      </div>
    )
  }

  return session ? <Outlet /> : <Navigate to="/auth" replace state={{ from: location }} />
}
