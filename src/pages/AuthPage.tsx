import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'

type AuthMode = 'signin' | 'signup' | 'forgot_password'

export function AuthPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { t } = useI18n()

  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, navigate])

  const validateForm = (): boolean => {
    setErrorMessage(null)
    setStatusMessage(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage(t('invalid_email'))
      return false
    }

    if (!password || password.length < 6) {
      setErrorMessage(t('password_too_short'))
      return false
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage(t('password_mismatch'))
        return false
      }
    }

    return true
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const { error } = await authService.signInWithGoogle(window.location.origin)
      if (error) {
        setErrorMessage(error.message || t('generic_auth_error'))
        setIsGoogleLoading(false)
      }
    } catch {
      setErrorMessage(t('generic_auth_error'))
      setIsGoogleLoading(false)
    }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      if (mode === 'signin') {
        const { error } = await authService.signInWithEmail(email.trim(), password)
        if (error) {
          setErrorMessage(error.message || t('generic_auth_error'))
          setIsLoading(false)
        }
        // On success, useEffect with session triggers navigate to /dashboard
      } else {
        const { data, error } = await authService.signUpWithEmail(email.trim(), password, window.location.origin)
        if (error) {
          setErrorMessage(error.message || t('generic_auth_error'))
          setIsLoading(false)
          return
        }

        // If session was created immediately, user is logged in
        if (data?.session) {
          // Navigation handled by useEffect
          setIsLoading(false)
        } else {
          // Confirmation email required
          setStatusMessage(t('account_created_confirm'))
          setIsLoading(false)
        }
      }
    } catch {
      setErrorMessage(t('generic_auth_error'))
      setIsLoading(false)
    }
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage(t('invalid_email'))
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      // Intentionally suppressing errors and providing a generic success message
      // to avoid account enumeration (revealing which emails are registered)
      await authService.sendPasswordResetEmail(trimmedEmail)
      setStatusMessage('If an account exists for this email, you will receive a password reset link shortly.')
      setIsLoading(false)
    } catch {
      setStatusMessage('If an account exists for this email, you will receive a password reset link shortly.')
      setIsLoading(false)
    }
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setErrorMessage(null)
    setStatusMessage(null)
  }

  return (
    <PageContainer
      title={t('auth_title')}
      intro={t('auth_intro')}
    >
      <div className="card-panel auth-card-container">
        <div className="auth-header-block">
          <span className="auth-brand-icon" aria-hidden="true">🪐</span>
          <h2>{t('welcome_back')}</h2>
          <p className="auth-subtitle">{t('auth_card_desc')}</p>
        </div>

        {/* Google OAuth Option */}
        <div className="auth-oauth-section">
          <button
            type="button"
            className="button button-primary auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            aria-label={t('continue_with_google')}
          >
            <span className="oauth-icon" aria-hidden="true">🌐</span>
            {isGoogleLoading ? t('loading') : t('continue_with_google')}
          </button>
        </div>

        {/* Separator */}
        <div className="auth-divider" role="separator">
          <span>{t('or')}</span>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot_password' && (
          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => switchMode('signin')}
            >
              {t('sign_in')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              {t('sign_up')}
            </button>
          </div>
        )}

        {mode === 'forgot_password' && (
          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={true}
              className="auth-tab-btn active"
            >
              Reset Password
            </button>
          </div>
        )}

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

        {/* Credentials Form */}
        <form onSubmit={mode === 'forgot_password' ? handlePasswordReset : handleEmailAuth} className="auth-credentials-form" noValidate>
          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">
              {t('email')}
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              autoComplete="email"
              required
              disabled={isLoading || isGoogleLoading || (mode === 'forgot_password' && Boolean(statusMessage))}
            />
          </div>

          {mode !== 'forgot_password' && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="auth-password" className="form-label" style={{ marginBottom: 0 }}>
                  {t('password')}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    className="btn-text-link"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => switchMode('forgot_password')}
                    disabled={isLoading || isGoogleLoading}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="auth-password"
                name="password"
                type="password"
                className="form-input"
                style={{ marginTop: '0.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password" className="form-label">
                {t('confirm_password')}
              </label>
              <input
                id="auth-confirm-password"
                name="confirmPassword"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
          )}

          <div className="auth-form-actions">
            <button
              type="submit"
              className="button button-primary auth-submit-btn"
              disabled={isLoading || isGoogleLoading || (mode === 'forgot_password' && Boolean(statusMessage))}
            >
              {isLoading
                ? (mode === 'signin' ? t('signing_in') : mode === 'signup' ? t('creating_account') : 'Sending...')
                : (mode === 'signin' ? t('sign_in') : mode === 'signup' ? t('create_account') : 'Send Reset Link')
              }
            </button>
          </div>
        </form>

        {/* Alternate Mode Link */}
        <div className="auth-footer-toggle">
          {mode === 'signin' ? (
            <button
              type="button"
              className="btn-text-link"
              onClick={() => switchMode('signup')}
            >
              {t('dont_have_account')}
            </button>
          ) : (
            <button
              type="button"
              className="btn-text-link"
              onClick={() => switchMode('signin')}
            >
              {mode === 'forgot_password' ? 'Back to sign in' : t('already_have_account')}
            </button>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
