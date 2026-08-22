import React, { useState, useEffect, useCallback } from 'react'
import { quotaService, type QuotaStatus } from '../../services/quotaService'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export const QuotaStatusCard: React.FC = () => {
  const { user } = useAuth()
  const [quota, setQuota] = useState<QuotaStatus | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0)

  const [isResetting, setIsResetting] = useState<boolean>(false)
  const [devDiagnostic, setDevDiagnostic] = useState<{
    userId?: string
    beforeUsed?: number
    afterUsed?: number
    success?: boolean
    message?: string
    error?: string
    timestamp?: string
  } | null>(null)

  const fetchQuota = useCallback(async () => {
    setIsLoading(true)
    const status = await quotaService.getQuotaStatus()
    setQuota(status)
    setCooldownSeconds(status.cooldown_remaining || 0)
    setIsLoading(false)
    return status
  }, [])

  const handleDevReset = async () => {
    if (!import.meta.env.DEV) return
    setIsResetting(true)
    const beforeUsed = quota?.used ?? 0
    try {
      const res = await quotaService.devResetAuthenticatedQuota()
      const afterStatus = await fetchQuota()

      setDevDiagnostic({
        userId: user?.id || 'unauthenticated',
        beforeUsed,
        afterUsed: afterStatus.used,
        success: res.success,
        message: res.message,
        error: res.error,
        timestamp: new Date().toLocaleTimeString(),
      })
    } catch (err: any) {
      setDevDiagnostic({
        userId: user?.id || 'unauthenticated',
        beforeUsed,
        afterUsed: quota?.used,
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toLocaleTimeString(),
      })
    } finally {
      setIsResetting(false)
    }
  }

  useEffect(() => {
    fetchQuota()
  }, [fetchQuota])

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldownSeconds])

  if (isLoading && !quota) {
    return (
      <div className="quota-card loading" aria-busy="true">
        <LoadingSpinner />
        <span>Loading daily story quota...</span>
      </div>
    )
  }

  const used = quota?.used ?? 0
  const limit = quota?.daily_limit ?? 10
  const remaining = quota?.remaining ?? Math.max(0, limit - used)
  const percentUsed = Math.min(100, Math.round((used / limit) * 100))

  return (
    <div className="quota-card" role="region" aria-labelledby="quota-card-title">
      <div className="quota-card-header">
        <div className="quota-title-group">
          <span className="quota-icon" aria-hidden="true">
            ⚡
          </span>
          <div>
            <h3 id="quota-card-title" className="quota-title">
              Daily Story Generations
            </h3>
            <p className="quota-subtitle">
              {remaining > 0 ? (
                <span>
                  <strong>{remaining}</strong> of {limit} tales remaining today
                </span>
              ) : (
                <span className="quota-limit-warning">Daily limit reached for today</span>
              )}
            </p>
          </div>
        </div>

        <div className="quota-actions-group" style={{ display: 'flex', gap: '0.5rem' }}>
          {import.meta.env.DEV ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm quota-dev-reset-btn"
              onClick={handleDevReset}
              disabled={isLoading || isResetting}
              aria-label="Reset quota (Dev only)"
              title="Development only: Reset quota to 0/10 in Supabase"
            >
              {isResetting ? '...' : '⚡ Reset (Dev)'}
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-secondary btn-sm quota-refresh-btn"
            onClick={fetchQuota}
            disabled={isLoading || isResetting}
            aria-label="Refresh quota status"
          >
            {isLoading ? '...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="quota-progress-container">
        <div
          className="quota-progress-bar"
          role="progressbar"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-label={`${used} of ${limit} daily stories used`}
        >
          <div
            className={`quota-progress-fill ${
              percentUsed >= 90 ? 'danger' : percentUsed >= 60 ? 'warning' : 'normal'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        <div className="quota-progress-labels">
          <span>{used} Used</span>
          <span>{limit} Daily Limit</span>
        </div>
      </div>

      {/* Cooldown Active Warning */}
      {cooldownSeconds > 0 && (
        <div className="quota-cooldown-badge" role="status" aria-live="polite">
          <span className="cooldown-spinner" aria-hidden="true">
            ⏳
          </span>
          <span>
            Storyteller resting... Next tale ready in <strong>{cooldownSeconds}s</strong>
          </span>
        </div>
      )}

      {/* Development-Only Diagnostic Telemetry Panel */}
      {import.meta.env.DEV && devDiagnostic && (
        <div
          className="quota-dev-diagnostic"
          style={{
            marginTop: '0.75rem',
            padding: '0.625rem 0.875rem',
            borderRadius: '8px',
            backgroundColor: devDiagnostic.success ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${devDiagnostic.success ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
            fontSize: '0.8125rem',
            color: '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <strong>🛠️ Dev Quota Reset Telemetry [{devDiagnostic.timestamp}]</strong>
            <span style={{ color: devDiagnostic.success ? '#4ade80' : '#f87171', fontWeight: 600 }}>
              {devDiagnostic.success ? '✅ SUCCESS' : '❌ FAILED'}
            </span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: '1.4' }}>
            <div>User ID: {devDiagnostic.userId}</div>
            <div>Before: {devDiagnostic.beforeUsed} / 10 Used ➔ After: {devDiagnostic.afterUsed} / 10 Used</div>
            {devDiagnostic.message && <div style={{ color: '#86efac' }}>Message: {devDiagnostic.message}</div>}
            {devDiagnostic.error && <div style={{ color: '#fca5a5' }}>Error: {devDiagnostic.error}</div>}
          </div>
        </div>
      )}

      <p className="quota-footnote">
        💡 Free daily stories are refreshed every 24 hours. Stories already in your library can be read, narrated, and explored anytime without using your quota.
      </p>
    </div>
  )
}
