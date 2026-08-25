import React, { useState } from 'react'
import { certificateGenerator } from '../../services/certificateGenerator'
import type {
  CertificateTheme,
  CertificateOptions,
} from '../../services/certificateGenerator'
import type { ChildAdventureProgress } from '../../services/progressionService'
import { sfxService } from '../../services/audio/sfxService'

interface DiplomaCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  childProgress: ChildAdventureProgress
}

export const DiplomaCertificateModal: React.FC<DiplomaCertificateModalProps> = ({
  isOpen,
  onClose,
  childProgress,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CertificateTheme>('cosmic_master')
  const [customMessage, setCustomMessage] = useState<string>(
    'For outstanding courage, creative imagination, and scientific inquiry across the ORBis Universe.'
  )

  if (!isOpen) return null

  const certificateOptions: CertificateOptions = {
    ...certificateGenerator.fromProgress(childProgress, selectedTheme),
    customMessage,
  }

  const svgContent = certificateGenerator.generateCertificateSvg(certificateOptions)

  const handleThemeChange = (theme: CertificateTheme) => {
    sfxService.play('star_pop')
    setSelectedTheme(theme)
  }

  const handleDownload = () => {
    sfxService.play('victory_fanfare')
    certificateGenerator.downloadCertificateSvg(certificateOptions)
  }

  const handlePrint = () => {
    sfxService.play('card_flip')
    certificateGenerator.printCertificate(certificateOptions)
  }

  return (
    <div
      className="diploma-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diploma-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(14px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div
        className="diploma-modal-card"
        style={{
          background: 'var(--surface-card, #191a35)',
          color: 'var(--text-heading, #f8f7ff)',
          borderRadius: '28px',
          padding: '28px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(251, 191, 36, 0.25)',
          border: '2px solid var(--border, rgba(157, 141, 253, 0.25))',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '16px',
          }}
        >
          <div>
            <h2 id="diploma-modal-title" style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px' }}>
              🎓 Official ORBis Diploma of Achievement
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Export a clean, vector SVG or print a physical graduation diploma for {childProgress.childName}.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Diploma Modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '6px 12px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Theme Selector Pill Bar */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            SELECT DIPLOMA THEME
          </label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {[
              { id: 'cosmic_master', label: '🪐 Cosmic Grandmaster', color: '#fbbf24' },
              { id: 'alchemist', label: '🧪 Master Alchemist', color: '#34d399' },
              { id: 'scientist', label: '🔬 Junior Scientist', color: '#38bdf8' },
              { id: 'story_weaver', label: '📜 Story Weaver', color: '#f472b6' },
            ].map((th) => {
              const isSelected = selectedTheme === th.id
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleThemeChange(th.id as CertificateTheme)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? th.color : 'var(--text-muted)',
                    border: isSelected ? `2px solid ${th.color}` : '1px solid var(--border)',
                    boxShadow: isSelected ? `0 0 16px ${th.color}40` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {th.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Live SVG Render Preview Container */}
        <div
          style={{
            background: '#0a0b16',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '440px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{ width: '100%', maxWidth: '780px', height: 'auto' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>

        {/* Custom Message Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
            PERSONAL DEDICATION MESSAGE
          </label>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter custom praise note from parents..."
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'inherit',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--border)',
            paddingTop: '16px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="button button-secondary"
            style={{ padding: '12px 20px', fontWeight: 700 }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="button button-secondary"
            style={{ padding: '12px 20px', fontWeight: 700 }}
          >
            🖨️ Print Diploma / PDF
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="button button-primary"
            style={{
              padding: '12px 24px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#1e1b4b',
              border: 'none',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
            }}
          >
            💾 Download Vector SVG
          </button>
        </div>
      </div>
    </div>
  )
}
