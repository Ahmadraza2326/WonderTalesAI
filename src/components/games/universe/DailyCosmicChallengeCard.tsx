import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DailyCosmicPackage, DailyStationChallenge } from '../../../services/proceduralChallengeService'
import { sfxService } from '../../../services/audio/sfxService'

interface DailyCosmicChallengeCardProps {
  dailyPackage: DailyCosmicPackage
  onChallengeLaunch?: (challenge: DailyStationChallenge) => void
}

export const DailyCosmicChallengeCard: React.FC<DailyCosmicChallengeCardProps> = ({
  dailyPackage,
  onChallengeLaunch,
}) => {
  const navigate = useNavigate()
  const [selectedConcept, setSelectedConcept] = useState<DailyStationChallenge['scientificConcept'] | null>(null)

  const handleLaunch = (challenge: DailyStationChallenge) => {
    sfxService.play('star_pop')
    if (onChallengeLaunch) {
      onChallengeLaunch(challenge)
    } else {
      navigate(challenge.route)
    }
  }

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(168, 85, 247, 0.15)',
        color: '#ffffff',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Daily Cosmic Challenge Hub"
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 900,
                padding: '4px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              ★ INFINITE DAILY QUESTS
            </span>
            <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>
              {dailyPackage.dateKey}
            </span>
          </div>

          <h2
            style={{
              margin: '0 0 4px',
              fontSize: '24px',
              fontWeight: 900,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
            }}
          >
            {dailyPackage.dayName} 🪐
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#c084fc', fontWeight: 700 }}>
            {dailyPackage.cosmicModifier}
          </p>
        </div>

        {/* Grand Completion Status Capsule */}
        <div
          style={{
            background: 'rgba(30, 27, 75, 0.75)',
            padding: '12px 18px',
            borderRadius: '16px',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>DAILY PROGRESS</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#fbbf24' }}>
              {dailyPackage.completedCount} / {dailyPackage.challenges.length} Done
            </div>
          </div>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            +{dailyPackage.grandBonus.xp} XP Bonus
          </div>
        </div>
      </div>

      {/* 4 Station Challenge Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
        }}
      >
        {dailyPackage.challenges.map((challenge) => (
          <div
            key={challenge.id}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              borderRadius: '16px',
              padding: '16px',
              border: challenge.isCompleted
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              transition: 'all 200ms ease',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{challenge.stationIcon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8' }}>
                    {challenge.stationTitle}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: challenge.isCompleted ? '#10b981' : '#fbbf24',
                    background: challenge.isCompleted
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {challenge.isCompleted ? '✓ DONE' : `${challenge.difficultyLabel} Lvl ${challenge.difficultyLevel}`}
                </span>
              </div>

              <h3
                style={{
                  margin: '0 0 6px',
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#f8fafc',
                }}
              >
                {challenge.challengeTitle}
              </h3>

              <div
                style={{
                  fontSize: '11px',
                  color: '#e2e8f0',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  borderLeft: `3px solid ${challenge.accentColor}`,
                }}
              >
                <strong>Goal:</strong> {challenge.targetGoal}
              </div>

              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                {challenge.challengeDescription}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => {
                  sfxService.play('card_flip')
                  setSelectedConcept(challenge.scientificConcept)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                🔬 Science Fact
              </button>

              <button
                type="button"
                onClick={() => handleLaunch(challenge)}
                style={{
                  background: challenge.isCompleted
                    ? 'rgba(16, 185, 129, 0.2)'
                    : challenge.bannerGradient,
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  minHeight: '36px',
                }}
              >
                {challenge.isCompleted ? 'Play Again ➔' : `Launch (+${challenge.rewardBonusStars}⭐)`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Science Concept Detail Modal */}
      {selectedConcept && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setSelectedConcept(null)}
        >
          <div
            style={{
              background: '#0f172a',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
              border: '2px solid #38bdf8',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                🔬 Science of Wonder Dossier
              </span>
              <button
                type="button"
                onClick={() => setSelectedConcept(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 900, color: '#f8fafc' }}>
              {selectedConcept.title}
            </h3>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
              Field: <strong>{selectedConcept.scienceTopic}</strong>
            </div>

            <div
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                lineHeight: 1.5,
                color: '#e0f2fe',
              }}
            >
              💡 {selectedConcept.kidExplanation}
            </div>

            <button
              type="button"
              onClick={() => setSelectedConcept(null)}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: '#38bdf8',
                color: '#0f172a',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Awesome! Got It!
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
