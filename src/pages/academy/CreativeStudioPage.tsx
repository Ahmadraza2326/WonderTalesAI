import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreativeCanvas } from '../../components/academy/creative/CreativeCanvas'
import { GuideCompanionAvatar } from '../../components/academy/guide/GuideCompanionAvatar'
import { GlassPanel, ParticleField, MagicalButton } from '../../components/ui/design'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const CreativeStudioPage: React.FC = () => {
  const navigate = useNavigate()
  const [savedArtwork, setSavedArtwork] = useState<string | null>(null)
  const [storyNarrative, setStoryNarrative] = useState<string>('')

  const handleSaveCreation = (dataUrl: string) => {
    setSavedArtwork(dataUrl)
    setStoryNarrative('Once upon a time in the cosmic expanse, a courageous space explorer built a sparkling rocket...')
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
        color: '#ffffff',
        padding: '28px 16px 64px',
        boxSizing: 'border-box',
      }}
    >
      <ParticleField count={40} particleType="stardust" speed={0.4} color="#f97316" />

      {/* Header Capsule */}
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto 20px', zIndex: 1 }}>
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
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back to Academy Home
        </button>

        <GlassPanel
          variant="hero"
          style={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#f97316', textTransform: 'uppercase' }}>
              🎨 Creative Studio • Wonder Workshop
            </span>
            <h1 style={{ margin: '4px 0 0', fontSize: '26px', color: '#f8fafc' }}>
              Create, Draw & Tell Stories
            </h1>
          </div>
          <GuideCompanionAvatar guideId="davinci" emotion="curious" size={56} />
        </GlassPanel>
      </div>

      {/* Canvas Toolset */}
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', zIndex: 1 }}>
        <CreativeCanvas onSave={handleSaveCreation} />

        {/* Story Generation Synthesis Loop (CREATE -> LEARN -> TELL) */}
        {savedArtwork && (
          <div style={{ marginTop: '24px' }}>
            <GlassPanel
              variant="elevated"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                🌟 Step 2: Your Creation is Now a Living Story!
              </span>
              <p style={{ margin: 0, fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6 }}>
                {storyNarrative}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <MagicalButton
                  variant="cosmic"
                  size="sm"
                  onClick={() => {
                    HapticsService.medium()
                    sfxService.play('star_pop')
                    navigate('/stories')
                  }}
                >
                  📖 Open in Story Orchestrator
                </MagicalButton>
                <MagicalButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    HapticsService.medium()
                    sfxService.play('card_flip')
                    navigate('/playroom/constellations')
                  }}
                >
                  🪐 Launch Cosmic Constellations Game
                </MagicalButton>
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  )
}
