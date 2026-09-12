import React, { useState } from 'react'

interface CodeBlockManipulativeProps {
  initialTokens?: string[]
  onSequenceChange?: (tokens: string[]) => void
}

export const CodeBlockManipulative: React.FC<CodeBlockManipulativeProps> = ({
  initialTokens = [],
  onSequenceChange,
}) => {
  const [sequence, setSequence] = useState<string[]>(initialTokens)

  const availableCommands = [
    { id: 'FORWARD', label: '⬆️ FORWARD', color: '#38bdf8' },
    { id: 'TURN_LEFT', label: '↺ TURN LEFT', color: '#a855f7' },
    { id: 'TURN_RIGHT', label: '↻ TURN RIGHT', color: '#a855f7' },
    { id: 'JUMP', label: '🦘 JUMP', color: '#10b981' },
    { id: 'LOOP_2X', label: '🔁 LOOP 2X', color: '#f59e0b' },
  ]

  const handleAddCommand = (cmd: string) => {
    const updated = [...sequence, cmd]
    setSequence(updated)
    onSequenceChange?.(updated)
  }

  const handleRemoveCommand = (index: number) => {
    const updated = sequence.filter((_, i) => i !== index)
    setSequence(updated)
    onSequenceChange?.(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '14px 0', width: '100%', maxWidth: '420px' }}>
      {/* Program Sequence Line */}
      <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
        💻 Program Sequence ({sequence.length} instructions):
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '14px',
          minHeight: '60px',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '14px',
          border: '1px dashed rgba(99, 102, 241, 0.5)',
          alignItems: 'center',
        }}
      >
        {sequence.length === 0 && (
          <span style={{ fontSize: '12px', color: '#64748b' }}>Tap commands below to build the algorithm...</span>
        )}
        {sequence.map((cmd, idx) => (
          <div
            key={idx}
            onClick={() => handleRemoveCommand(idx)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(99, 102, 241, 0.35)',
              border: '1px solid #6366f1',
              color: '#f8fafc',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Click to remove"
          >
            <span>{idx + 1}. {cmd}</span>
            <span style={{ color: '#f87171' }}>✕</span>
          </div>
        ))}
      </div>

      {/* Available Commands Palette */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {availableCommands.map((cmd) => (
          <button
            key={cmd.id}
            onClick={() => handleAddCommand(cmd.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${cmd.color}`,
              color: cmd.color,
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            + {cmd.label}
          </button>
        ))}
      </div>
    </div>
  )
}
