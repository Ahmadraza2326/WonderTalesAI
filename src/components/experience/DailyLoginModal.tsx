import React, { useEffect } from 'react'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export interface DailyLoginModalProps {
  isOpen: boolean
  onClaim: () => void
  currentStreak: number
  childName?: string
}

export const DailyLoginModal: React.FC<DailyLoginModalProps> = ({
  isOpen,
  onClaim,
  currentStreak,
  childName = 'Explorer',
}) => {
  useEffect(() => {
    if (isOpen) {
      sfxService.play('victory_fanfare')
      HapticsService.success()
    }
  }, [isOpen])

  if (!isOpen) return null

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const activeDayIndex = (currentStreak - 1) % 7

  return (
    <div
      className="daily-login-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-bonus-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        className="daily-login-card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 50%, #4c1d95 100%)',
          borderRadius: '28px',
          padding: '32px 24px',
          maxWidth: '460px',
          width: '100%',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(168, 85, 247, 0.35)',
          border: '2px solid rgba(251, 191, 36, 0.5)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Sparkle Header Icon */}
        <div
          className="animate-bounce"
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '26px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            margin: '0 auto 16px',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.5)',
            border: '3px solid #ffffff',
          }}
        >
          🎁
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(251, 191, 36, 0.2)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(251, 191, 36, 0.4)', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px' }}>🔥</span>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.04em' }}>
            {currentStreak}-DAY COSMIC STREAK!
          </span>
        </div>

        <h2 id="daily-bonus-title" style={{ fontSize: '1.75rem', fontWeight: 900, margin: '6px 0', color: '#f8fafc' }}>
          Daily Cosmic Bonus!
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', margin: '0 0 20px', lineHeight: 1.4 }}>
          Great job exploring today, <strong style={{ color: '#fef08a' }}>{childName}</strong>! Claim your daily celestial energy to keep your streak burning bright.
        </p>

        {/* 7-Day Streak Road */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.65)',
            padding: '12px 8px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '20px',
          }}
        >
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx < activeDayIndex
            const isToday = idx === activeDayIndex
            return (
              <div
                key={day}
                style={{
                  background: isToday
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.25)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isToday
                    ? '2px solid #fef08a'
                    : isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '8px 2px',
                  color: isToday ? '#ffffff' : isCompleted ? '#34d399' : '#94a3b8',
                  boxShadow: isToday ? '0 0 14px rgba(245, 158, 11, 0.5)' : 'none',
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 800 }}>{day}</div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  {isToday ? '⭐' : isCompleted ? '✅' : '🔒'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Rewards Breakdown Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1.5px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '14px',
              padding: '10px 16px',
              flex: 1,
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#fbbf24' }}>+15 ⭐</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>Starlight Coins</div>
          </div>

          <div
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '14px',
              padding: '10px 16px',
              flex: 1,
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#38bdf8' }}>🛡️ FREEZE</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>Streak Protected</div>
          </div>
        </div>

        {/* Big Claim Action Button */}
        <button
          type="button"
          onClick={() => {
            sfxService.play('star_pop')
            HapticsService.medium()
            onClaim()
          }}
          className="button button-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1.15rem',
            fontWeight: 900,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: '2px solid #a7f3d0',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          🌟 CLAIM DAILY BONUS!
        </button>
      </div>
    </div>
  )
}
