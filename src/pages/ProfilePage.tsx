import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { authService } from '../services/authService'

export function ProfilePage() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    authService.getSession().then(({ data }) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(data.session))
        if (!data.session) {
          navigate('/auth', { replace: true })
        }
      }
    })

    const { data: authListener } = authService.subscribeToAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(session))
        if (!session) {
          navigate('/auth', { replace: true })
        }
      }
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  if (isAuthenticated === false) {
    return null
  }

  return (
    <PageContainer title="Profile" intro="A placeholder profile page for the future app experience.">
      <EmptyState title="Profile coming soon" description="This space will evolve into a user profile and account overview." />
    </PageContainer>
  )
}
