import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { authService } from '../services/authService'

export function DashboardPage() {
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

  async function handleSignOut() {
    await authService.signOut()
    navigate('/auth', { replace: true })
  }

  if (isAuthenticated === false) {
    return null
  }

  return (
    <PageContainer title="Dashboard" intro="Your story workspace will appear here in a future milestone.">
      <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2>Welcome to your workspace</h2>
          <p>You are signed in and can now access your protected dashboard area.</p>
        </div>
        <div className="dashboard-actions">
          <button type="button" className="button button-primary" onClick={() => navigate('/stories/new')}>
            Create Story
          </button>
          <button type="button" className="button button-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
      <EmptyState title="No stories yet" description="Create your first story experience once the next milestone is ready." />
    </PageContainer>
  )
}
