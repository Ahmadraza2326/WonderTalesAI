/**
 * ORBIS Parent PIN & Security Service
 * Provides secure 4-digit PIN management, lockout protection, and parent math verification challenges.
 */

export interface ParentPinState {
  isConfigured: boolean
  isLockedOut: boolean
  lockoutRemainingSeconds: number
  failedAttempts: number
}

export interface MathChallenge {
  question: string
  answer: number
}

const PIN_STORAGE_KEY = 'orbis_parent_pin_hash'
const PIN_SALT_KEY = 'orbis_parent_pin_salt'
const PIN_LOCKOUT_KEY = 'orbis_parent_pin_lockout'
const PIN_ATTEMPTS_KEY = 'orbis_parent_pin_attempts'
const PIN_SESSION_KEY = 'orbis_parent_pin_session'

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30 * 1000 // 30 seconds lockout
const SESSION_TTL_MS = 15 * 60 * 1000 // 15 minutes session TTL

/**
 * Fast and lightweight string hash with salt for secure client-side PIN storage.
 */
function hashPin(pin: string, salt: string): string {
  let hash = 0
  const combined = `${salt}:${pin}:${salt}`
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `pin_v1_${Math.abs(hash).toString(36)}_${combined.length}`
}

function getOrCreateSalt(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'orbis_default_salt_2026'
  }
  let salt = localStorage.getItem(PIN_SALT_KEY)
  if (!salt) {
    salt = Math.random().toString(36).substring(2, 15)
    localStorage.setItem(PIN_SALT_KEY, salt)
  }
  return salt
}

function recordFailedAttempt(): number {
  if (typeof window === 'undefined' || !window.localStorage) return 1
  const current = parseInt(localStorage.getItem(PIN_ATTEMPTS_KEY) || '0', 10)
  const next = current + 1
  localStorage.setItem(PIN_ATTEMPTS_KEY, next.toString())
  return next
}

function resetFailedAttempts(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(PIN_ATTEMPTS_KEY)
    localStorage.removeItem(PIN_LOCKOUT_KEY)
  }
}

function triggerLockout(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(PIN_LOCKOUT_KEY, (Date.now() + LOCKOUT_DURATION_MS).toString())
    localStorage.removeItem(PIN_ATTEMPTS_KEY)
  }
}

export const parentPinService = {
  /**
   * Checks if a parent PIN is currently configured.
   */
  isPinSet(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }
    const hash = localStorage.getItem(PIN_STORAGE_KEY)
    return Boolean(hash && hash.trim())
  },

  /**
   * Sets or updates the 4-digit parent PIN.
   */
  setPin(pin: string): { success: boolean; error: string | null } {
    if (!pin || !/^\d{4}$/.test(pin)) {
      return { success: false, error: 'PIN must be exactly 4 numeric digits.' }
    }

    const salt = getOrCreateSalt()
    const hash = hashPin(pin, salt)

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(PIN_STORAGE_KEY, hash)
      localStorage.removeItem(PIN_ATTEMPTS_KEY)
      localStorage.removeItem(PIN_LOCKOUT_KEY)
      this.grantSession()
    }

    return { success: true, error: null }
  },

  /**
   * Verifies the entered 4-digit PIN against the stored hash with lockout protection.
   */
  verifyPin(pin: string): { success: boolean; error: string | null; lockoutRemainingSeconds?: number } {
    const lockout = this.getLockoutRemainingSeconds()
    if (lockout > 0) {
      return {
        success: false,
        error: `Too many failed attempts. Please wait ${lockout}s before trying again.`,
        lockoutRemainingSeconds: lockout,
      }
    }

    if (!pin || !/^\d{4}$/.test(pin)) {
      return { success: false, error: 'PIN must be exactly 4 digits.' }
    }

    // If no PIN has been set yet, any 4-digit PIN can be used to initialize
    if (!this.isPinSet()) {
      this.setPin(pin)
      return { success: true, error: null }
    }

    const salt = getOrCreateSalt()
    const enteredHash = hashPin(pin, salt)
    const storedHash = localStorage.getItem(PIN_STORAGE_KEY)

    if (enteredHash === storedHash) {
      // Successful authentication
      resetFailedAttempts()
      this.grantSession()
      return { success: true, error: null }
    }

    // Failed attempt
    const attempts = recordFailedAttempt()
    const remaining = MAX_FAILED_ATTEMPTS - attempts

    if (remaining <= 0) {
      triggerLockout()
      return {
        success: false,
        error: `Incorrect PIN. Maximum attempts exceeded. Locked for 30 seconds.`,
        lockoutRemainingSeconds: 30,
      }
    }

    return {
      success: false,
      error: `Incorrect PIN. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`,
    }
  },

  /**
   * Generates a parent verification math challenge (e.g. multiplication/addition) for emergency recovery.
   */
  generateMathChallenge(): MathChallenge {
    const operations = ['+', '×', '-']
    const op = operations[Math.floor(Math.random() * operations.length)]
    
    let a = 0
    let b = 0
    let answer = 0

    if (op === '+') {
      a = Math.floor(Math.random() * 40) + 15 // 15 - 54
      b = Math.floor(Math.random() * 40) + 15 // 15 - 54
      answer = a + b
    } else if (op === '×') {
      a = Math.floor(Math.random() * 9) + 4 // 4 - 12
      b = Math.floor(Math.random() * 8) + 3 // 3 - 10
      answer = a * b
    } else {
      a = Math.floor(Math.random() * 50) + 40 // 40 - 89
      b = Math.floor(Math.random() * 30) + 10 // 10 - 39
      answer = a - b
    }

    return {
      question: `${a} ${op} ${b} = ?`,
      answer,
    }
  },

  /**
   * Validates a math challenge response and grants a temporary unlocked session.
   */
  verifyMathChallenge(userAnswer: number | string, expectedAnswer: number): boolean {
    const parsed = typeof userAnswer === 'string' ? parseInt(userAnswer, 10) : userAnswer
    if (parsed === expectedAnswer) {
      resetFailedAttempts()
      this.grantSession()
      return true
    }
    return false
  },

  /**
   * Checks if the parent session is currently unlocked.
   */
  isSessionActive(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }
    const sessionStr = localStorage.getItem(PIN_SESSION_KEY)
    if (!sessionStr) return false

    try {
      const expiresAt = parseInt(sessionStr, 10)
      if (Date.now() < expiresAt) {
        return true
      }
      localStorage.removeItem(PIN_SESSION_KEY)
      return false
    } catch {
      return false
    }
  },

  /**
   * Grants an unlocked parent session.
   */
  grantSession(ttlMs: number = SESSION_TTL_MS): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(PIN_SESSION_KEY, (Date.now() + ttlMs).toString())
    }
  },

  /**
   * Manually locks the parent zone session.
   */
  lockSession(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(PIN_SESSION_KEY)
    }
  },

  /**
   * Returns remaining lockout seconds (0 if not locked out).
   */
  getLockoutRemainingSeconds(): number {
    if (typeof window === 'undefined' || !window.localStorage) return 0
    const lockoutUntilStr = localStorage.getItem(PIN_LOCKOUT_KEY)
    if (!lockoutUntilStr) return 0

    const lockoutUntil = parseInt(lockoutUntilStr, 10)
    const diffMs = lockoutUntil - Date.now()
    if (diffMs > 0) {
      return Math.ceil(diffMs / 1000)
    }
    localStorage.removeItem(PIN_LOCKOUT_KEY)
    return 0
  },

  /**
   * Resets PIN and clear all security settings (for dev/test or verified parents).
   */
  resetPin(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(PIN_STORAGE_KEY)
      localStorage.removeItem(PIN_SALT_KEY)
      localStorage.removeItem(PIN_LOCKOUT_KEY)
      localStorage.removeItem(PIN_ATTEMPTS_KEY)
      localStorage.removeItem(PIN_SESSION_KEY)
    }
  },
}
