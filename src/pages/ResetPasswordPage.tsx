import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { t } = useI18n()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  // Redirect to Auth if no session. In a recovery flow, Supabase establishes a session 
  // with the recovery token before rendering the page.
  useEffect(() => {
    if (!session) {
      navigate('/auth', { replace: true })
    }
  }, [session, navigate])

  const validateForm = (): boolean => {
    setErrorMessage(null)
    setStatusMessage(null)

    if (!password || password.length < 6) {
      setErrorMessage(t('password_too_short'))
      return false
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('password_mismatch'))
      return false
    }

    return true
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const { error } = await authService.updateUserPassword(password)
      
      if (error) {
        setErrorMessage(error.message || t('generic_auth_error'))
        setIsLoading(false)
        return
      }

      setStatusMessage('Your password has been successfully updated.')
      
      // Navigate to dashboard after brief delay to show success
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 2000)
    } catch {
      setErrorMessage(t('generic_auth_error'))
      setIsLoading(false)
    }
  }

  return (
    <PageContainer
      title="Reset Password"
      intro="Enter your new password below."
    >
      <div className="card-panel auth-card-container">
        <div className="auth-header-block">
          <span className="auth-brand-icon" aria-hidden="true">🔒</span>
          <h2>Reset Password</h2>
          <p className="auth-subtitle">Choose a strong, secure new password.</p>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="form-error auth-feedback-banner" role="alert" aria-live="assertive">
            ⚠️ {errorMessage}
          </div>
        )}

        {statusMessage && (
          <div className="form-status success auth-feedback-banner" role="status" aria-live="polite">
            ✨ {statusMessage}
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleResetPassword} className="auth-credentials-form" noValidate>
          <div className="form-group">
            <label htmlFor="reset-password" className="form-label">
              New {t('password')}
            </label>
            <input
              id="reset-password"
              name="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isLoading || Boolean(statusMessage)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reset-confirm-password" className="form-label">
              {t('confirm_password')}
            </label>
            <input
              id="reset-confirm-password"
              name="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isLoading || Boolean(statusMessage)}
            />
          </div>

          <div className="auth-form-actions">
            <button
              type="submit"
              className="button button-primary auth-submit-btn"
              disabled={isLoading || Boolean(statusMessage)}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
