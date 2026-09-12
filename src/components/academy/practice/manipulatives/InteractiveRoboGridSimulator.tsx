import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface InteractiveRoboGridSimulatorProps {
  gridSize?: number
  initialRobotPos?: { x: number; y: number }
  crystalPositions?: Array<{ x: number; y: number }>
  onGoalReached?: () => void
}

export const InteractiveRoboGridSimulator: React.FC<InteractiveRoboGridSimulatorProps> = ({
  gridSize = 4,
  initialRobotPos = { x: 0, y: 0 },
  crystalPositions = [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
  onGoalReached,
}) => {
  const [robotPos, setRobotPos] = useState(initialRobotPos)
  const [collectedCrystals, setCollectedCrystals] = useState<Set<string>>(new Set())
  const [isRunning, setIsRunning] = useState(false)
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null)

  const programCommands = ['LOOP_3X (FORWARD)', 'COLLECT_ALL']

  const handleRunProgram = async () => {
    if (isRunning) return
    setIsRunning(true)
    sfxService.play('card_flip')
    HapticsService.medium()

    // Reset position
    setRobotPos(initialRobotPos)
    const collected = new Set<string>()
    setCollectedCrystals(collected)

    // Execute 3 steps forward
    for (let step = 1; step <= 3; step++) {
      setActiveStepIdx(step)
      await new Promise((r) => setTimeout(r, 600))

      const nextPos = { x: step, y: 0 }
      setRobotPos(nextPos)
      sfxService.play('star_pop')
      HapticsService.light()

      // Check crystal collection
      const key = `${nextPos.x},${nextPos.y}`
      collected.add(key)
      setCollectedCrystals(new Set(collected))
    }

    await new Promise((r) => setTimeout(r, 400))
    setIsRunning(false)
    setActiveStepIdx(null)

    sfxService.play('match_success')
    HapticsService.success()
    onGoalReached?.()
  }

  const handleReset = () => {
    setRobotPos(initialRobotPos)
    setCollectedCrystals(new Set())
    setIsRunning(false)
    setActiveStepIdx(null)
    sfxService.play('card_flip')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '2px solid rgba(168, 85, 247, 0.5)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            BEEP-0 Loop Grid Simulator (4x4)
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Reset Grid ↺
        </button>
      </div>

      {/* 4x4 Grid Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: '8px',
          padding: '16px',
          borderRadius: '18px',
          background: 'rgba(2, 6, 23, 0.9)',
          border: '2px solid rgba(168, 85, 247, 0.3)',
          width: '100%',
          maxWidth: '380px',
          aspectRatio: '1/1',
          boxSizing: 'border-box',
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const x = idx % gridSize
          const y = Math.floor(idx / gridSize)
          const isRobotHere = robotPos.x === x && robotPos.y === y
          const hasCrystal = crystalPositions.some((c) => c.x === x && c.y === y)
          const isCollected = collectedCrystals.has(`${x},${y}`)

          return (
            <div
              key={idx}
              style={{
                borderRadius: '12px',
                backgroundColor: isRobotHere
                  ? 'rgba(168, 85, 247, 0.35)'
                  : (x + y) % 2 === 0
                  ? 'rgba(30, 41, 59, 0.6)'
                  : 'rgba(15, 23, 42, 0.8)',
                border: isRobotHere
                  ? '2px solid #c084fc'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.25s ease',
              }}
            >
              {isRobotHere && (
                <span
                  style={{
                    fontSize: '28px',
                    filter: 'drop-shadow(0 0 10px #c084fc)',
                    transform: isRunning ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  🤖
                </span>
              )}
              {!isRobotHere && hasCrystal && !isCollected && (
                <span
                  style={{
                    fontSize: '22px',
                    filter: 'drop-shadow(0 0 8px #38bdf8)',
                    animation: 'pulse 1.5s infinite alternate',
                  }}
                >
                  💎
                </span>
              )}
              {!isRobotHere && isCollected && (
                <span style={{ fontSize: '14px', opacity: 0.4 }}>✨</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Program Instruction Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#c084fc' }}>Program:</span>
        {programCommands.map((cmd, i) => (
          <div
            key={i}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: activeStepIdx !== null ? 'rgba(168, 85, 247, 0.3)' : 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#f8fafc',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            🔁 {cmd}
          </div>
        ))}
      </div>

      {/* Action Execution Button */}
      <button
        type="button"
        onClick={handleRunProgram}
        disabled={isRunning}
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '12px 20px',
          borderRadius: '16px',
          border: '2px solid #a855f7',
          background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
          color: '#ffffff',
          fontSize: '15px',
          fontWeight: 800,
          cursor: isRunning ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 18px rgba(168, 85, 247, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: isRunning ? 0.7 : 1,
        }}
      >
        <span>{isRunning ? 'Executing Loop...' : '▶️ Execute Loop Program (3 Steps)'}</span>
      </button>
    </div>
  )
}
