import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authService } from '../services/authService'

export function ProtectedRoute() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    authService.getSession().then(({ data }) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(data.session))
      }
    })

    const { data: authListener } = authService.subscribeToAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(session))
      }
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (isAuthenticated === null) {
    return null
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace state={{ from: location }} />
}
