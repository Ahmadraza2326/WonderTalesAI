import { supabase } from '../lib/supabase'
import { withTimeout } from '../utils/asyncUtils'

export type OrbisAIHealthStatus =
  | 'SUCCESS'
  | 'AUTH_REQUIRED'
  | 'FUNCTION_NOT_FOUND'
  | 'NETWORK_FAILURE'
  | 'COOLDOWN_ACTIVE'
  | 'DAILY_LIMIT_REACHED'
  | 'UPSTREAM_AI_FAILURE'
  | 'EDGE_FUNCTION_FAILURE'

export interface OrbisAIHealthReport {
  status: OrbisAIHealthStatus
  message: string
  details?: string
  latencyMs?: number
}

let lastDiagnosticTestTime = 0
const DIAGNOSTIC_COOLDOWN_MS = 3000 // 3 seconds debounce for diagnostic test

/**
 * Verifies ORBIS AI connection health via the server boundary.
 * Classifies exact health state (SUCCESS, AUTH_REQUIRED, FUNCTION_NOT_FOUND, NETWORK_FAILURE, etc.).
 * Never requires client-side API keys or bundles secrets in frontend code.
 */
export async function testOrbisAIConnectionDetailed(): Promise<OrbisAIHealthReport> {
  const startTime = Date.now()
  const now = Date.now()
  if (now - lastDiagnosticTestTime < DIAGNOSTIC_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((DIAGNOSTIC_COOLDOWN_MS - (now - lastDiagnosticTestTime)) / 1000)
    return {
      status: 'COOLDOWN_ACTIVE',
      message: `Diagnostic test is on cooldown. Please wait ${waitSeconds}s.`,
      latencyMs: 0,
    }
  }
  lastDiagnosticTestTime = now

  try {
    const invokePromise = supabase.functions.invoke('generate-story-package', {
      body: { prompt: 'Reply with exactly: ORBIS AI connection verified.' },
    })

    const { data, error } = await withTimeout(
      invokePromise,
      15000,
      'ORBIS AI connection test timed out after 15s.'
    )

    const latencyMs = Date.now() - startTime

    if (error) {
      const errorObj = error as {
        context?: {
          status?: number
          json?: () => Promise<{ code?: string; error?: string; message?: string }>
        }
      }

      const status = errorObj.context?.status
      const rawMessage = error.message || ''

      const parsedJson = errorObj.context?.json
        ? await errorObj.context.json().catch(() => null)
        : null

      const code = parsedJson?.code || ''
      const details = parsedJson?.error || parsedJson?.message || rawMessage

      if (
        status === 401 ||
        code === 'UNAUTHENTICATED' ||
        code === 'UNAUTHORIZED_NO_AUTH_HEADER' ||
        rawMessage.includes('authorization') ||
        rawMessage.includes('UNAUTHENTICATED')
      ) {
        return {
          status: 'AUTH_REQUIRED',
          message: 'ORBIS AI requires an active parent session. Please sign in to generate stories.',
          details,
          latencyMs,
        }
      }

      if (status === 404 || code === 'NOT_FOUND' || rawMessage.includes('404')) {
        return {
          status: 'FUNCTION_NOT_FOUND',
          message: 'Edge Function "generate-story-package" was not found on the remote project.',
          details,
          latencyMs,
        }
      }

      if (code === 'COOLDOWN_ACTIVE') {
        return {
          status: 'COOLDOWN_ACTIVE',
          message: 'ORBIS AI story cooldown is currently active. Please wait a moment.',
          details,
          latencyMs,
        }
      }

      if (code === 'DAILY_LIMIT_REACHED') {
        return {
          status: 'DAILY_LIMIT_REACHED',
          message: 'Daily story generation quota reached for today.',
          details,
          latencyMs,
        }
      }

      if (
        rawMessage.includes('Failed to send a request') ||
        rawMessage.includes('FunctionsFetchError') ||
        rawMessage.includes('network') ||
        rawMessage.includes('Failed to fetch')
      ) {
        return {
          status: 'NETWORK_FAILURE',
          message: 'ORBIS AI server boundary is unreachable. Please check your network connection.',
          details: rawMessage,
          latencyMs,
        }
      }

      if (status === 502 || code === 'UPSTREAM_AI_FAILURE') {
        return {
          status: 'UPSTREAM_AI_FAILURE',
          message: 'Upstream AI provider error occurred.',
          details,
          latencyMs,
        }
      }

      return {
        status: 'EDGE_FUNCTION_FAILURE',
        message: `ORBIS AI function error (${status || 'Unknown'}): ${details || 'Server error'}`,
        details,
        latencyMs,
      }
    }

    return {
      status: 'SUCCESS',
      message: data?.text?.trim() || 'ORBIS AI server boundary verified and operational.',
      latencyMs,
    }
  } catch (err) {
    const latencyMs = Date.now() - startTime
    const message = err instanceof Error ? err.message : String(err)

    if (message.includes('timed out')) {
      return {
        status: 'NETWORK_FAILURE',
        message: 'ORBIS AI diagnostic request timed out after 15s.',
        details: message,
        latencyMs,
      }
    }

    return {
      status: 'EDGE_FUNCTION_FAILURE',
      message: `Diagnostic check error: ${message}`,
      details: message,
      latencyMs,
    }
  }
}

/**
 * Legacy string return function for backward-compatibility.
 */
export async function testOrbisAIConnection(): Promise<string> {
  const report = await testOrbisAIConnectionDetailed()
  if (report.status === 'SUCCESS') {
    return report.message
  }
  throw new Error(`ORBIS AI [${report.status}]: ${report.message}`)
}

// Backward-compatible internal aliases
export const testGeminiConnection = testOrbisAIConnection
