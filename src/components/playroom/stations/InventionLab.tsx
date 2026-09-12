import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type {
  StructuralMaterialType,
  InventionLabChallenge,
} from '../../../types/games/inventionLab'
import {
  MASTER_MATERIALS,
  generateInventionChallenge,
  getInitialInventionState,
  evaluateInventionAction,
  calculateBeamStresses,
  hasContinuousDeckPath,
} from '../../../services/games/inventionLabEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

export interface InventionLabProps {
  story?: StoryRecord | null
  childId?: string | null
  explorerLevel?: number
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

export const InventionLab: React.FC<InventionLabProps> = ({
  childId = null,
  explorerLevel = 1,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  // Current challenge
  const currentChallenge: InventionLabChallenge = useMemo(() => {
    return generateInventionChallenge(challengeIndex, difficulty, explorerLevel)
  }, [challengeIndex, difficulty, explorerLevel])

  // Engine state reducer
  const [state, dispatch] = useReducer(
    evaluateInventionAction,
    currentChallenge,
    (c) => getInitialInventionState(c)
  )

  // Sync state when challenge changes
  useEffect(() => {
    dispatch({ type: 'LOAD_CHALLENGE', challenge: currentChallenge })
    setShowCelebration(false)
  }, [currentChallenge])

  // Authoritative Reward Economy Hook
  const { completeActivity } = useActivityEconomy({
    childId,
    activityType: 'invention_lab',
    activityId: `invention_${currentChallenge.id}`,
  })

  // Material Selection Handler
  const handleSelectMaterial = useCallback((mat: StructuralMaterialType) => {
    HapticsService.light()
    sfxService.play('component_pickup')
    dispatch({ type: 'SELECT_MATERIAL', material: mat })
  }, [])

  // Node Click Handler
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      sfxService.resumeContext().catch(() => {})
      HapticsService.light()
      if (state.activeStartNodeId && state.activeStartNodeId !== nodeId) {
        sfxService.play('component_place')
      } else {
        sfxService.play('card_flip')
      }
      dispatch({ type: 'CLICK_NODE', nodeId })
    },
    [state.activeStartNodeId]
  )

  // Start Stress Test Handler
  const handleStartTest = useCallback(async () => {
    await sfxService.resumeContext()
    const hasPath = hasContinuousDeckPath(
      state.placedBeams,
      currentChallenge.startNodeId,
      currentChallenge.targetNodeId
    )

    if (!hasPath) {
      HapticsService.heavy()
      sfxService.play('machine_fail')
      dispatch({ type: 'START_STRESS_TEST' })
      return
    }

    HapticsService.medium()
    sfxService.play('machine_start')
    dispatch({ type: 'START_STRESS_TEST' })
  }, [state.placedBeams, currentChallenge.startNodeId, currentChallenge.targetNodeId])

  // Reset to Draft
  const handleResetToDraft = useCallback(() => {
    HapticsService.light()
    sfxService.play('card_flip')
    dispatch({ type: 'RESET_TO_DRAFT' })
  }, [])

  // Clear All Beams
  const handleClearBeams = useCallback(() => {
    HapticsService.medium()
    sfxService.play('mistake_soft')
    dispatch({ type: 'CLEAR_BEAMS' })
  }, [])

  // Next Challenge
  const handleNextChallenge = useCallback(() => {
    HapticsService.medium()
    setChallengeIndex((prev) => prev + 1)
    sfxService.play('card_flip')
  }, [])

  // Handle Victory Celebration Trigger
  useEffect(() => {
    if (state.status === 'success' && !showCelebration) {
      HapticsService.success()
      sfxService.play('victory_fanfare')
      setShowCelebration(true)
      completeActivity({
        starsAmount: state.telemetry.stars || 4,
        xpAmount: state.telemetry.xp || 40,
      }).catch(() => {})
    }
  }, [state.status, showCelebration, state.telemetry, completeActivity])

  // 60fps Canvas Simulation Loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const vehicleProgressRef = useRef<number>(0)

  useEffect(() => {
    if (state.status !== 'simulating') {
      vehicleProgressRef.current = 0
      return
    }

    let lastTime = performance.now()
    const simDurationSec = 3.5

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      vehicleProgressRef.current += dt / simDurationSec
      const prog = Math.min(1.0, vehicleProgressRef.current)

      // Calculate stresses
      const { stresses, hasBroken } = calculateBeamStresses(
        state.placedBeams,
        currentChallenge.nodes,
        prog,
        currentChallenge.vehicleWeightKg
      )

      if (hasBroken) {
        HapticsService.heavy()
        sfxService.play('machine_fail')
      }

      dispatch({
        type: 'UPDATE_SIMULATION_FRAME',
        progress: prog,
        vehicleY: 260,
        beamStresses: stresses,
        hasBroken,
      })

      if (!hasBroken && prog < 1.0) {
        animFrameRef.current = requestAnimationFrame(loop)
      }
    }

    animFrameRef.current = requestAnimationFrame(loop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [state.status, state.placedBeams, currentChallenge])

  // Canvas Drawing Routine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = 420

    ctx.clearRect(0, 0, W, H)

    // 1. Blueprint Grid Background
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 440)
    bgGrad.addColorStop(0, '#0c1a2e')
    bgGrad.addColorStop(0.6, '#060d1a')
    bgGrad.addColorStop(1, '#02060d')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)

    // Blueprint grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }

    // 2. Chasm Cliffs & Starry Abyss
    const startNode = currentChallenge.nodes.find((n) => n.id === currentChallenge.startNodeId) || currentChallenge.nodes[0]
    const targetNode = currentChallenge.nodes.find((n) => n.id === currentChallenge.targetNodeId) || currentChallenge.nodes[currentChallenge.nodes.length - 1]

    // Left Cliff
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.moveTo(0, startNode.y + 10)
    ctx.lineTo(startNode.x + 10, startNode.y + 10)
    ctx.lineTo(startNode.x - 20, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 3
    ctx.stroke()

    // Right Cliff
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.moveTo(targetNode.x - 10, targetNode.y + 10)
    ctx.lineTo(W, targetNode.y + 10)
    ctx.lineTo(W, H)
    ctx.lineTo(targetNode.x + 20, H)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 3
    ctx.stroke()

    // Star Gate Destination Indicator
    ctx.save()
    ctx.translate(targetNode.x, targetNode.y - 30)
    ctx.fillStyle = '#38bdf8'
    ctx.shadowColor = '#38bdf8'
    ctx.shadowBlur = 18
    ctx.font = '28px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🌟', 0, 0)
    ctx.restore()

    // 3. Draw Placed Beams
    const nodeMap = new Map(currentChallenge.nodes.map((n) => [n.id, n]))

    state.placedBeams.forEach((beam) => {
      const from = nodeMap.get(beam.fromNodeId)
      const to = nodeMap.get(beam.toNodeId)
      if (!from || !to) return

      const mat = MASTER_MATERIALS[beam.material]
      const stress = beam.currentStress || 0

      ctx.save()
      if (beam.isBroken) {
        // Broken snapped beam
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = mat.strokeWidth
        ctx.setLineDash([8, 8])
      } else if (stress > 0.8) {
        // High stress glowing red
        ctx.strokeStyle = '#f87171'
        ctx.lineWidth = mat.strokeWidth + 2
        ctx.shadowColor = '#ef4444'
        ctx.shadowBlur = 12
      } else if (stress > 0.5) {
        // Medium stress amber
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = mat.strokeWidth
      } else {
        // Normal material color
        ctx.strokeStyle = mat.color
        ctx.lineWidth = mat.strokeWidth
      }

      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
      ctx.restore()

      // Stress percentage badge if simulating
      if (state.status === 'simulating' && stress > 0.1) {
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2
        ctx.fillStyle = stress > 0.8 ? '#ef4444' : '#fbbf24'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${Math.round(stress * 100)}%`, midX, midY - 6)
      }
    })

    // Active Beam Drafting Line
    if (state.activeStartNodeId) {
      const activeNode = nodeMap.get(state.activeStartNodeId)
      if (activeNode) {
        ctx.save()
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 6])
        ctx.beginPath()
        ctx.arc(activeNode.x, activeNode.y, 16, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }
    }

    // 4. Draw Blueprint Nodes
    currentChallenge.nodes.forEach((node) => {
      const isSelected = state.activeStartNodeId === node.id

      ctx.save()
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.isAnchor ? 10 : 8, 0, Math.PI * 2)

      if (node.isAnchor) {
        ctx.fillStyle = '#0284c7'
        ctx.strokeStyle = '#38bdf8'
      } else {
        ctx.fillStyle = isSelected ? '#f59e0b' : '#334155'
        ctx.strokeStyle = isSelected ? '#fef08a' : '#64748b'
      }

      ctx.lineWidth = 2.5
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    })

    // 5. Draw Starling Rover Vehicle during Simulation
    if (state.status === 'simulating' || state.status === 'success' || state.status === 'structural_failure') {
      const startX = startNode.x
      const targetX = targetNode.x
      const vx = startX + (targetX - startX) * state.vehicleProgress
      const vy = state.vehicleY - 14

      ctx.save()
      ctx.translate(vx, vy)
      ctx.font = '28px sans-serif'
      ctx.textAlign = 'center'
      ctx.shadowColor = '#f59e0b'
      ctx.shadowBlur = 10
      ctx.fillText(state.status === 'structural_failure' ? '💥' : '🚀', 0, 0)
      ctx.restore()
    }
  }, [state, currentChallenge])

  return (
    <ActivityShell
      title="Invention Lab"
      emoji="🏗️"
      tagline="Design load-bearing bridges & test physical truss mechanics!"
      primaryDomain="logic"
      secondaryDomains={['creativity']}
      difficulty={difficulty}
      onDifficultyChange={(d) => setDifficulty(d as DifficultyTier)}
      supportsDifficulty={true}
      difficultyDisabled={state.status === 'simulating'}
      progressInfo={`Challenge ${challengeIndex + 1}: ${currentChallenge.title}`}
    >
      <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
        {/* Top HUD: Budget Scrap Tokens & Vehicle Specs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1.25rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.4rem' }}>💰</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                Scrap Budget Remaining
              </div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: state.budgetRemaining > 20 ? '#38bdf8' : '#f59e0b',
                }}
              >
                {state.budgetRemaining} / {currentChallenge.budget} tokens
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <div>
              <span className="text-slate-400">Payload: </span>
              <span className="text-sky-300 font-bold">{currentChallenge.vehicleWeightKg}kg</span>
            </div>
            <div>
              <span className="text-slate-400">Span: </span>
              <span className="text-sky-300 font-bold">{currentChallenge.chasmWidthMeters}m</span>
            </div>
            <div>
              <span className="text-slate-400">Beams: </span>
              <span className="text-sky-300 font-bold">{state.placedBeams.length}</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Blueprint Canvas */}
        <div
          style={{
            position: 'relative',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 8px 32px rgba(2, 132, 199, 0.2)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={420}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              cursor: 'crosshair',
            }}
          />

          {/* Interactive HTML Node Overlay Targets */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: state.status === 'simulating' ? 'none' : 'auto',
            }}
          >
            {currentChallenge.nodes.map((node) => {
              const pctX = (node.x / 800) * 100
              const pctY = (node.y / 420) * 100
              const isSelected = state.activeStartNodeId === node.id

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleNodeClick(node.id)}
                  aria-label={`Node at ${Math.round(pctX)}% ${Math.round(pctY)}%`}
                  style={{
                    position: 'absolute',
                    left: `${pctX}%`,
                    top: `${pctY}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  title={
                    node.isAnchor
                      ? 'Anchor Node (Fixed to bedrock)'
                      : isSelected
                      ? 'Active Node (Click another node to connect beam)'
                      : 'Truss Node (Click to connect)'
                  }
                />
              )
            })}
          </div>
        </div>

        {/* Structural Material Toolbar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {(Object.keys(MASTER_MATERIALS) as StructuralMaterialType[]).map((mKey) => {
            const mat = MASTER_MATERIALS[mKey]
            const isSelected = state.selectedMaterial === mKey
            const canAfford = state.budgetRemaining >= mat.cost

            return (
              <button
                key={mKey}
                type="button"
                onClick={() => handleSelectMaterial(mKey)}
                disabled={!canAfford}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.85rem',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(14, 165, 233, 0.15) 100%)'
                    : 'rgba(15, 23, 42, 0.7)',
                  border: isSelected
                    ? `2px solid ${mat.color}`
                    : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.35rem',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  opacity: canAfford ? 1 : 0.45,
                  transition: 'all 150ms ease',
                  boxShadow: isSelected ? `0 0 16px ${mat.color}40` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#fff' : '#cbd5e1' }}>
                    {mat.name}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
                    {mat.cost} 🪙
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Max Load: {mat.maxTensionLoad}kg
                </div>
              </button>
            )
          })}
        </div>

        {/* Action Controls & Simulation Status */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div className="flex gap-2">
            <button
              type="button"
              className="button button-outline"
              onClick={handleClearBeams}
              disabled={state.status === 'simulating' || state.placedBeams.length === 0}
              style={{ minHeight: '44px' }}
            >
              🔄 Clear All
            </button>
            {state.status === 'structural_failure' ? (
              <button
                type="button"
                className="button button-outline"
                onClick={handleResetToDraft}
                style={{ minHeight: '44px', borderColor: '#ef4444', color: '#ef4444' }}
              >
                🔧 Redesign Truss
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={handleStartTest}
            disabled={state.status === 'simulating' || state.placedBeams.length === 0}
            style={{
              padding: '0.75rem 1.75rem',
              fontWeight: 800,
              fontSize: '1rem',
              minHeight: '48px',
              boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)',
            }}
          >
            ⚡ Test Load & Launch Starling Rover
          </button>
        </div>

        {/* Science of Wonder Pedagogical Dossier */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
          }}
        >
          <h4 style={{ margin: '0 0 0.4rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.95rem' }}>
            🔬 Science of Wonder: {currentChallenge.scientificConcept.title}
          </h4>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {currentChallenge.scientificConcept.concept}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
            💡 Fun Fact: {currentChallenge.scientificConcept.funFact}
          </p>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {showCelebration && (
        <VictoryCelebrationModal
          isOpen={showCelebration}
          title="Bridge Master Engineer!"
          subtitle={`Your ${currentChallenge.title} held against all physical loads!`}
          starsEarned={state.telemetry.stars || 4}
          xpEarned={state.telemetry.xp || 40}
          onNextLevel={handleNextChallenge}
          nextLevelLabel="Next Blueprint ➔"
        />
      )}
    </ActivityShell>
  )
}
