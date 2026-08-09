import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const location = useLocation()
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  return session ? <Outlet /> : <Navigate to="/auth" replace state={{ from: location }} />
}
