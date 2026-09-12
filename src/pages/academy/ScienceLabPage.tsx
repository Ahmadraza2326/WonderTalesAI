import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ScienceExperimentSimulator } from '../../components/academy/science/ScienceExperimentSimulator'
import { ParticleField } from '../../components/ui/design'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const ScienceLabPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
        color: '#ffffff',
        padding: '28px 16px 64px',
        boxSizing: 'border-box',
      }}
    >
      <ParticleField count={35} particleType="stardust" speed={0.4} color="#10b981" />

      <div style={{ maxWidth: '740px', width: '100%', marginBottom: '16px', zIndex: 1 }}>
        <button
          onClick={() => {
            HapticsService.light()
            sfxService.play('card_flip')
            navigate('/academy')
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back to Academy Home
        </button>
      </div>

      <div style={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ScienceExperimentSimulator />
      </div>
    </div>
  )
}
