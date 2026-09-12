import React, { useState } from 'react'
import type { AskOrbisResponse } from '../../../types/academy'
import { queryAskOrbisAssistant } from '../../../services/academy/aiAssistantService'
import { GlassPanel, MagicalButton } from '../../ui/design'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface AskOrbisModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AskOrbisModal: React.FC<AskOrbisModalProps> = ({ isOpen, onClose }) => {
  const [queryText, setQueryText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<AskOrbisResponse | null>(null)

  if (!isOpen) return null

  const handleAsk = async () => {
    if (!queryText.trim()) return

    HapticsService.medium()
    sfxService.play('card_flip')
    setIsLoading(true)

    try {
      const res = await queryAskOrbisAssistant({
        childId: 'guest',
        childAgeBand: 'developing',
        questionText: queryText,
      })
      setResponse(res)
      sfxService.play('match_success')
    } catch {
      // Handled
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <GlassPanel
        variant="hero"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#f8fafc' }}>Ask ORBis Tutor</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>
          Have a question about math, science, or words? Ask ORBis for a friendly, playful explanation!
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask e.g. What is a fraction?"
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#ffffff',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <MagicalButton variant="cosmic" size="sm" onClick={handleAsk}>
            {isLoading ? 'Thinking...' : 'Ask 🔮'}
          </MagicalButton>
        </div>

        {response && (
          <div
            style={{
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <strong style={{ color: '#38bdf8', fontSize: '13px' }}>💡 Friendly Explanation:</strong>
              <div style={{ color: '#e2e8f0', fontSize: '14px', marginTop: '2px' }}>
                {response.answer}
              </div>
            </div>

            <div>
              <strong style={{ color: '#fbbf24', fontSize: '13px' }}>✨ Socratic Analogy:</strong>
              <div style={{ color: '#fef08a', fontSize: '14px', marginTop: '2px' }}>
                {response.simplifiedAnalogy}
              </div>
            </div>

            <div>
              <strong style={{ color: '#a855f7', fontSize: '13px' }}>🤔 Question for You:</strong>
              <div style={{ color: '#c084fc', fontSize: '14px', marginTop: '2px' }}>
                {response.socraticQuestion}
              </div>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
