import React, { useState, useEffect, useCallback } from 'react'
import { parentPinService } from '../../services/parentPinService'
import type { MathChallenge } from '../../services/parentPinService'
import { sfxService } from '../../services/audio/sfxService'

interface ParentPinModalProps {
  isOpen: boolean
  onSuccess: () => void
  onClose: () => void
  initialMode?: 'verify' | 'setup'
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  initialMode = 'verify',
}) => {
  const [pin, setPin] = useState<string>('')
  const [confirmPin, setConfirmPin] = useState<string>('')
  const [mode, setMode] = useState<'verify' | 'setup' | 'confirm' | 'math'>(
    parentPinService.isPinSet() ? initialMode : 'setup'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState<boolean>(false)
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() =>
    parentPinService.getLockoutRemainingSeconds()
  )
  const [mathChallenge, setMathChallenge] = useState<MathChallenge | null>(null)
  const [mathAnswer, setMathAnswer] = useState<string>('')

  // Sync mode and reset state on open
  useEffect(() => {
    if (isOpen) {
      const isSet = parentPinService.isPinSet()
      setMode(isSet ? initialMode : 'setup')
      setPin('')
      setConfirmPin('')
      setErrorMessage(null)
      setLockoutSeconds(parentPinService.getLockoutRemainingSeconds())
      setMathChallenge(null)
      setMathAnswer('')
    }
  }, [isOpen, initialMode])

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return

    const timer = setInterval(() => {
      const remaining = parentPinService.getLockoutRemainingSeconds()
      setLockoutSeconds(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
        setErrorMessage(null)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockoutSeconds])

  const triggerShake = () => {
    setIsShaking(true)
    sfxService.play('mistake_soft')
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleDigitPress = (digit: string) => {
    if (lockoutSeconds > 0) return
    if (pin.length < 4) {
      sfxService.play('star_pop')
      const newPin = pin + digit
      setPin(newPin)

      if (newPin.length === 4) {
        // Evaluate on 4th digit
        handlePinComplete(newPin)
      }
    }
  }

  const handlePinComplete = (enteredPin: string) => {
    if (mode === 'setup') {
      setConfirmPin(enteredPin)
      setPin('')
      setMode('confirm')
      setErrorMessage(null)
    } else if (mode === 'confirm') {
      if (enteredPin === confirmPin) {
        sfxService.play('victory_fanfare')
        parentPinService.setPin(enteredPin)
        onSuccess()
      } else {
        triggerShake()
        setErrorMessage('PINs do not match. Please try again.')
        setPin('')
        setConfirmPin('')
        setMode('setup')
      }
    } else if (mode === 'verify') {
      const result = parentPinService.verifyPin(enteredPin)
      if (result.success) {
        sfxService.play('victory_fanfare')
        onSuccess()
      } else {
        triggerShake()
        setErrorMessage(result.error)
        setPin('')
        if (result.lockoutRemainingSeconds) {
          setLockoutSeconds(result.lockoutRemainingSeconds)
        }
      }
    }
  }

  const handleBackspace = () => {
    sfxService.play('component_pickup')
    setPin((prev) => prev.slice(0, -1))
    setErrorMessage(null)
  }

  const handleClear = () => {
    sfxService.play('component_place')
    setPin('')
    setErrorMessage(null)
  }

  const handleStartMathChallenge = () => {
    const challenge = parentPinService.generateMathChallenge()
    setMathChallenge(challenge)
    setMathAnswer('')
    setMode('math')
    setErrorMessage(null)
  }

  const handleVerifyMathChallenge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mathChallenge) return

    const isCorrect = parentPinService.verifyMathChallenge(
      mathAnswer,
      mathChallenge.answer
    )

    if (isCorrect) {
      sfxService.play('victory_fanfare')
      onSuccess()
    } else {
      triggerShake()
      setErrorMessage('Incorrect answer. Please solve the math verification challenge.')
      const nextChallenge = parentPinService.generateMathChallenge()
      setMathChallenge(nextChallenge)
      setMathAnswer('')
    }
  }

  // Handle physical keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      if (mode === 'math') {
        if (e.key === 'Escape') onClose()
        return
      }

      if (/^[0-9]$/.test(e.key)) {
        handleDigitPress(e.key)
      } else if (e.key === 'Backspace') {
        handleBackspace()
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [isOpen, mode, pin, lockoutSeconds, onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="parent-pin-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className={`parent-pin-modal-card ${isShaking ? 'shake' : ''}`}
        style={{
          background: 'var(--surface-card, #191a35)',
          color: 'var(--text-heading, #f8f7ff)',
          borderRadius: '28px',
          padding: '32px 24px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(108, 92, 231, 0.25)',
          border: '2px solid var(--border, rgba(157, 141, 253, 0.2))',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Parent Gate"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted, #9d9bb8)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>

        {/* Lock / Security Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 8px 24px rgba(108, 92, 231, 0.4)',
          }}
        >
          🛡️
        </div>

        {mode === 'math' ? (
          <div>
            <h2 id="pin-modal-title" style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px' }}>
              Parent Verification
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px' }}>
              Solve this math challenge to unlock the Parent Intelligence Hub.
            </p>

            {mathChallenge && (
              <form onSubmit={handleVerifyMathChallenge}>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: 'var(--magic-star, #fbbf24)',
                    background: 'rgba(251, 191, 36, 0.12)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    marginBottom: '20px',
                    letterSpacing: '2px',
                  }}
                >
                  {mathChallenge.question}
                </div>

                <input
                  type="number"
                  autoFocus
                  placeholder="Enter answer"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '2px solid var(--accent, #6c5ce7)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'inherit',
                    fontSize: '20px',
                    textAlign: 'center',
                    fontWeight: 700,
                    marginBottom: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {errorMessage && (
                  <p style={{ color: '#f87171', fontSize: '13px', margin: '0 0 16px', fontWeight: 600 }}>
                    {errorMessage}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(parentPinService.isPinSet() ? 'verify' : 'setup')
                      setErrorMessage(null)
                    }}
                    className="button button-secondary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    Back to PIN
                  </button>
                  <button
                    type="submit"
                    className="button button-primary"
                    style={{ flex: 1, padding: '12px' }}
                    disabled={!mathAnswer.trim()}
                  >
                    Unlock Hub
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div>
            <h2 id="pin-modal-title" style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>
              {mode === 'setup'
                ? 'Create Parent PIN'
                : mode === 'confirm'
                ? 'Confirm Parent PIN'
                : 'Parent Zone Gate'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.4 }}>
              {mode === 'setup'
                ? 'Enter a 4-digit code to protect parental controls.'
                : mode === 'confirm'
                ? 'Re-enter your 4-digit PIN to confirm.'
                : 'Adults only! Enter your 4-digit PIN to continue.'}
            </p>

            {/* PIN Bubble Indicators */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index
                return (
                  <div
                    key={index}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isFilled
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'rgba(255, 255, 255, 0.15)',
                      border: isFilled
                        ? '2px solid #fef08a'
                        : '2px solid var(--border, rgba(255, 255, 255, 0.2))',
                      boxShadow: isFilled ? '0 0 16px rgba(251, 191, 36, 0.6)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                )
              })}
            </div>

            {/* Error or Lockout Message */}
            {lockoutSeconds > 0 ? (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  marginBottom: '18px',
                }}
              >
                🔒 Locked out. Try again in {lockoutSeconds}s
              </div>
            ) : errorMessage ? (
              <div
                style={{
                  color: '#f87171',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                {errorMessage}
              </div>
            ) : null}

            {/* Numeric Keypad Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                maxWidth: '280px',
                margin: '0 auto 20px',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitPress(digit)}
                  disabled={lockoutSeconds > 0}
                  style={{
                    height: '56px',
                    borderRadius: '18px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
                    color: 'inherit',
                    fontSize: '22px',
                    fontWeight: 800,
                    cursor: lockoutSeconds > 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    opacity: lockoutSeconds > 0 ? 0.4 : 1,
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {digit}
                </button>
              ))}

              {/* Clear button */}
              <button
                type="button"
                onClick={handleClear}
                disabled={pin.length === 0 || lockoutSeconds > 0}
                style={{
                  height: '56px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: pin.length === 0 || lockoutSeconds > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pin.length === 0 || lockoutSeconds > 0 ? 0.3 : 1,
                }}
              >
                Clear
              </button>

              {/* Digit 0 */}
              <button
                type="button"
                onClick={() => handleDigitPress('0')}
                disabled={lockoutSeconds > 0}
                style={{
                  height: '56px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
                  color: 'inherit',
                  fontSize: '22px',
                  fontWeight: 800,
                  cursor: lockoutSeconds > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  opacity: lockoutSeconds > 0 ? 0.4 : 1,
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                0
              </button>

              {/* Backspace button */}
              <button
                type="button"
                onClick={handleBackspace}
                disabled={pin.length === 0 || lockoutSeconds > 0}
                aria-label="Delete last digit"
                style={{
                  height: '56px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                  color: 'var(--text-muted)',
                  fontSize: '20px',
                  fontWeight: 700,
                  cursor: pin.length === 0 || lockoutSeconds > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pin.length === 0 || lockoutSeconds > 0 ? 0.3 : 1,
                }}
              >
                ⌫
              </button>
            </div>

            {/* Forgot PIN / Parent Math Challenge */}
            <div style={{ marginTop: '12px' }}>
              <button
                type="button"
                onClick={handleStartMathChallenge}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent, #9d8dfd)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '6px 10px',
                }}
              >
                Forgot PIN? Solve Parent Math Challenge 🧠
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
