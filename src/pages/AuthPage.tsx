import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export function AuthPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, navigate])

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await authService.signInWithGoogle(window.location.origin)

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
    }
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
