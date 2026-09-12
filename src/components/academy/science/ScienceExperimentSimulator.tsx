import React, { useState } from 'react'
import { GlassPanel, MagicalButton } from '../../ui/design'
import { GuideCompanionAvatar } from '../guide/GuideCompanionAvatar'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface ScienceExperimentSimulatorProps {
  onExperimentSuccess?: (xp: number, stars: number) => void
}

export const ScienceExperimentSimulator: React.FC<ScienceExperimentSimulatorProps> = ({
  onExperimentSuccess,
}) => {
  const [sunlightLevel, setSunlightLevel] = useState(50)
  const [waterLevel, setWaterLevel] = useState(50)
  const [hypothesis, setHypothesis] = useState<'grow_fast' | 'wilt' | 'normal'>('normal')
  const [isSimulated, setIsSimulated] = useState(false)

  // Photosynthesis formula simulation
  const plantHealth = Math.round((sunlightLevel * 0.5 + waterLevel * 0.5) * (1 - Math.abs(sunlightLevel - waterLevel) / 200))
  const isHealthy = plantHealth >= 70

  const handleRunSimulation = () => {
    setIsSimulated(true)
    if (isHealthy) {
      HapticsService.success()
      sfxService.play('match_success')
      onExperimentSuccess?.(35, 3)
    } else {
      HapticsService.error()
      sfxService.play('mistake_soft')
    }
  }

  return (
    <GlassPanel
      variant="hero"
      style={{
        padding: '28px',
        maxWidth: '740px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
            🔬 Science Lab • Predict & Experiment
          </span>
          <h2 style={{ margin: '4px 0 0', fontSize: '22px', color: '#f8fafc' }}>
            Photosynthesis & Sunlight Laboratory
          </h2>
        </div>
        <GuideCompanionAvatar guideId="newton" emotion={isSimulated && isHealthy ? 'celebrating' : 'curious'} size={52} />
      </div>

      {/* Step 1: Predict Hypothesis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#94a3b8' }}>
          Step 1: Form Your Hypothesis (What do you predict will happen?)
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { id: 'grow_fast', label: '🌱 Grow Fast & Strong' },
            { id: 'normal', label: '🌿 Normal Slow Growth' },
            { id: 'wilt', label: '🥀 Wilt & Turn Yellow' },
          ].map((hypo) => (
            <button
              key={hypo.id}
              onClick={() => setHypothesis(hypo.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                backgroundColor: hypothesis === hypo.id ? 'rgba(16, 185, 129, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                border: hypothesis === hypo.id ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {hypo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Controls Sliders */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          padding: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        {/* Sunlight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#f8fafc' }}>
            <span>☀️ Sunlight Intensity:</span>
            <span style={{ fontWeight: 800, color: '#fbbf24' }}>{sunlightLevel}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sunlightLevel}
            onChange={(e) => setSunlightLevel(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }}
          />
        </div>

        {/* Water */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#f8fafc' }}>
            <span>💧 Water Hydration:</span>
            <span style={{ fontWeight: 800, color: '#38bdf8' }}>{waterLevel}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={waterLevel}
            onChange={(e) => setWaterLevel(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Simulation Trigger */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MagicalButton variant="cosmic" size="md" onClick={handleRunSimulation}>
          Run Experiment Simulation 🔬
        </MagicalButton>
      </div>

      {/* Observation & Output State */}
      {isSimulated && (
        <div
          style={{
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: isHealthy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: isHealthy ? '1px solid #10b981' : '1px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '42px' }}>{isHealthy ? '🌻' : '🥀'}</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
              {isHealthy ? '🌟 Thriving Plant Growth! (Health: ' + plantHealth + '%)' : '⚠️ Sub-optimal Growth (Health: ' + plantHealth + '%)'}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4 }}>
              {isHealthy
                ? 'Balanced sunlight and moisture allowed optimal chlorophyll energy production.'
                : 'Plants require both balanced light and water. Too much or too little of either causes imbalance.'}
            </p>
          </div>
        </div>
      )}
    </GlassPanel>
  )
}
