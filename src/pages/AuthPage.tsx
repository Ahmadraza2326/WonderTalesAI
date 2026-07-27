import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { authService } from '../services/authService'

export function AuthPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    authService.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        navigate('/dashboard', { replace: true })
      }
    })

    const { data: authListener } = authService.subscribeToAuthStateChange((_event, session) => {
      if (isMounted && session) {
        navigate('/dashboard', { replace: true })
      }
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await authService.signInWithGoogle(window.location.origin)

    if (error) {
      setErrorMessage(error.message)
    }

    setIsLoading(false)
  }

  return (
    <PageContainer title="Authentication" intro="Sign in to continue to your dashboard and protected experience.">
      <div className="card-panel">
        <h2>Welcome back</h2>
        <p>Use Google to sign in securely and continue to your personal workspace.</p>

        <button type="button" className="button button-primary" onClick={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? 'Connecting…' : 'Continue with Google'}
        </button>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      </div>
    </PageContainer>
  )
}
