import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type {
  InvestigationToolType,
  Suspect,
  Hotspot,
} from '../../../types/games/mysteryDetective'
import {
  INVESTIGATION_TOOLS,
  generateCase,
  getInitialState,
  evaluateAction,
  calculateScore,
} from '../../../services/games/mysteryDetectiveEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

export interface MysteryDetectiveProps {
  story?: StoryRecord | null
  childId?: string | null
  explorerLevel?: number
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

export const MysteryDetective: React.FC<MysteryDetectiveProps> = ({
  story,
  childId = null,
  explorerLevel = 1,
  onBack,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [caseIndex, setCaseIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [innocentAlibi, setInnocentAlibi] = useState<{ suspect: Suspect; text: string } | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [inspectedFeedbackId, setInspectedFeedbackId] = useState<string | null>(null)
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 400, y: 250 })
  const [isPointerOverScene, setIsPointerOverScene] = useState<boolean>(false)
  const [isDraggingTool, setIsDraggingTool] = useState<boolean>(false)

  // Current case generation (curated -> infinite procedural)
  const currentCase = useMemo(() => {
    return generateCase(caseIndex, difficulty, explorerLevel)
  }, [caseIndex, difficulty, explorerLevel])

  // Engine State Reducer
  const [state, dispatch] = useReducer(
    evaluateAction,
    currentCase,
    (c) => getInitialState(c)
  )

  // Sync state when case changes
  useEffect(() => {
    dispatch({ type: 'RESET_CASE' })
    setShowCelebration(false)
    setInnocentAlibi(null)
    setFeedbackMessage(null)
    setInspectedFeedbackId(null)
  }, [currentCase.id])

  // Authoritative Reward Economy Hook
  const { completeActivity } = useActivityEconomy({
    childId,
    activityType: 'mystery_detective',
    activityId: `case_${currentCase.id}`,
  })

  // Timer Tick
  useEffect(() => {
    if (state.status !== 'investigating' && state.status !== 'deducing') return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIME', deltaSeconds: 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status])

  // Keyboard Shortcuts (1-4 for tools, Space to start)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === '1') {
        HapticsService.light()
        dispatch({ type: 'SELECT_TOOL', tool: 'magnifying_glass' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === '2') {
        HapticsService.light()
        dispatch({ type: 'SELECT_TOOL', tool: 'uv_brush' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === '3') {
        HapticsService.light()
        dispatch({ type: 'SELECT_TOOL', tool: 'sound_horn' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === '4') {
        HapticsService.light()
        dispatch({ type: 'SELECT_TOOL', tool: 'decoder_lens' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === ' ' && state.status === 'briefing') {
        e.preventDefault()
        HapticsService.selection()
        dispatch({ type: 'START_INVESTIGATION' })
        sfxService.play('card_flip')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status])

  // Tool Selection
  const handleSelectTool = useCallback((tool: InvestigationToolType) => {
    HapticsService.light()
    sfxService.play('detective_lens_scan')
    dispatch({ type: 'SELECT_TOOL', tool })
  }, [])

  // Hotspot Inspection
  const handleInspectHotspot = useCallback(
    (hotspot: Hotspot) => {
      if (state.discoveredClueIds.includes(hotspot.clueId)) {
        setFeedbackMessage('✨ Clue already documented on your Evidence Board!')
        return
      }

      setInspectedFeedbackId(hotspot.id)

      if (hotspot.requiredTool === state.activeTool) {
        HapticsService.medium()
        sfxService.play('clue_found')
        dispatch({ type: 'INSPECT_HOTSPOT', hotspotId: hotspot.id })
        const clue = currentCase.clues.find((c) => c.id === hotspot.clueId)
        setFeedbackMessage(`🔍 Clue Discovered: "${clue?.textDescription || 'New evidence found!'}"`)
      } else {
        HapticsService.light()
        sfxService.play('mistake_soft')
        const requiredToolMeta = INVESTIGATION_TOOLS[hotspot.requiredTool]
        setFeedbackMessage(
          `💡 Hint: ${hotspot.hintText} (Equip your ${requiredToolMeta.icon} ${requiredToolMeta.name}!)`
        )
      }
    },
    [state.activeTool, state.discoveredClueIds, currentCase.clues]
  )

  // Suspect Elimination Toggle
  const handleToggleEliminate = useCallback(
    (suspectId: string) => {
      HapticsService.light()
      sfxService.play('suspect_eliminate')
      dispatch({ type: 'TOGGLE_ELIMINATE_SUSPECT', suspectId })
    },
    []
  )

  // Suspect Accusation
  const handleAccuse = useCallback(
    async (suspect: Suspect) => {
      if (suspect.id === currentCase.culpritId) {
        HapticsService.success()
        sfxService.play('case_solved')
        dispatch({ type: 'ACCUSE_SUSPECT', suspectId: suspect.id })

        const scoreResult = calculateScore(state.telemetry, currentCase)
        await completeActivity({
          xpAmount: scoreResult.xp,
          starsAmount: scoreResult.stars,
        })
        setShowCelebration(true)
        setInnocentAlibi(null)
      } else {
        HapticsService.warning()
        sfxService.play('suspect_gasp')
        dispatch({ type: 'ACCUSE_SUSPECT', suspectId: suspect.id })
        setInnocentAlibi({
          suspect,
          text:
            suspect.innocentExplanation ||
            `${suspect.name} has a solid alibi and was elsewhere during the incident!`,
        })
        setFeedbackMessage(`❌ ${suspect.name} is innocent! Check the clue traits and try again.`)
      }
    },
    [currentCase, state.telemetry, completeActivity]
  )

  // Difficulty Change
  const handleDifficultyChange = useCallback((newDifficulty: DifficultyTier) => {
    setDifficulty(newDifficulty)
    setCaseIndex(0)
    HapticsService.light()
    sfxService.play('card_flip')
  }, [])

  // Next / Replay Case
  const handleNextCase = useCallback(() => {
    HapticsService.medium()
    setCaseIndex((prev) => prev + 1)
    sfxService.play('card_flip')
  }, [])

  const handleReplayCase = useCallback(() => {
    HapticsService.light()
    dispatch({ type: 'RESET_CASE' })
    setShowCelebration(false)
    setInnocentAlibi(null)
    setFeedbackMessage(null)
    sfxService.play('card_flip')
  }, [])

  // Active Tool Metadata
  const activeToolMeta = INVESTIGATION_TOOLS[state.activeTool]
  const allCluesFound = state.discoveredClueIds.length >= currentCase.clues.length

  // Canvas 2D / 3D Forensic Depth Rendering Loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = 500

    ctx.clearRect(0, 0, W, H)

    // 1. 3D Noir Crime Scene Room Perspective
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 320)
    wallGrad.addColorStop(0, '#090d16')
    wallGrad.addColorStop(0.7, '#1e293b')
    wallGrad.addColorStop(1, '#0f172a')
    ctx.fillStyle = wallGrad
    ctx.fillRect(0, 0, W, 320)

    // Stone / Wood Wainscoting Line
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(0, 320)
    ctx.lineTo(W, 320)
    ctx.stroke()

    // 3D Perspective Wooden Floorboards
    const floorGrad = ctx.createLinearGradient(0, 320, 0, H)
    floorGrad.addColorStop(0, '#1e1b4b')
    floorGrad.addColorStop(1, '#020617')
    ctx.fillStyle = floorGrad
    ctx.fillRect(0, 320, W, H - 320)

    // Floorboard perspective lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)'
    ctx.lineWidth = 1.5
    for (let x = -200; x <= W + 200; x += 100) {
      ctx.beginPath()
      ctx.moveTo(W / 2 + (x - W / 2) * 0.25, 320)
      ctx.lineTo(x, H)
      ctx.stroke()
    }

    // Atmospheric Starlight Window Glow
    ctx.save()
    const windowGrad = ctx.createRadialGradient(400, 100, 10, 400, 100, 260)
    windowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)')
    windowGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.08)')
    windowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = windowGrad
    ctx.fillRect(0, 0, W, H)
    ctx.restore()

    // 2. Render Hotspots & Clue Visuals
    const timeSec = Date.now() / 1000

    currentCase.hotspots.forEach((hotspot) => {
      const isDiscovered = state.discoveredClueIds.includes(hotspot.clueId)
      const clue = currentCase.clues.find((c) => c.id === hotspot.clueId)
      const isInspected = inspectedFeedbackId === hotspot.id

      ctx.save()
      // Pulse animation
      const pulse = (Math.sin(timeSec * 3 + hotspot.x) + 1) * 0.5

      if (isDiscovered) {
        ctx.shadowColor = '#10b981'
        ctx.shadowBlur = 18
        ctx.fillStyle = 'rgba(16, 185, 129, 0.22)'
        ctx.beginPath()
        ctx.arc(hotspot.x, hotspot.y, hotspot.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#10b981'
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.font = '22px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('✅', hotspot.x, hotspot.y)
      } else {
        ctx.shadowColor = isInspected ? '#f59e0b' : '#38bdf8'
        ctx.shadowBlur = 12 + pulse * 8
        ctx.fillStyle = isInspected
          ? 'rgba(245, 158, 11, 0.28)'
          : `rgba(56, 189, 248, ${0.15 + pulse * 0.15})`
        ctx.beginPath()
        ctx.arc(hotspot.x, hotspot.y, hotspot.radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = isInspected ? '#f59e0b' : '#38bdf8'
        ctx.lineWidth = 2.5
        ctx.setLineDash([6, 4])
        ctx.beginPath()
        ctx.arc(hotspot.x, hotspot.y, hotspot.radius + 2, timeSec % (Math.PI * 2), timeSec % (Math.PI * 2) + Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.font = '20px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(clue?.icon || '🔍', hotspot.x, hotspot.y)
      }

      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 12px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(hotspot.label, hotspot.x, hotspot.y + hotspot.radius + 18)
      ctx.restore()
    })

    // 3. Dynamic 3D Forensic Tool Sweep Effects (Following Pointer)
    if (isPointerOverScene || isDraggingTool) {
      const px = pointerPos.x
      const py = pointerPos.y

      ctx.save()
      switch (state.activeTool) {
        case 'uv_brush': {
          // 3D UV Light Brush: Fluorescent illumination lens & glowing footprint dust
          const uvGrad = ctx.createRadialGradient(px, py, 10, px, py, 110)
          uvGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)')
          uvGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.25)')
          uvGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = uvGrad
          ctx.beginPath()
          ctx.arc(px, py, 110, 0, Math.PI * 2)
          ctx.fill()

          // UV Beam Outer Ring
          ctx.strokeStyle = '#c084fc'
          ctx.lineWidth = 2
          ctx.setLineDash([4, 4])
          ctx.beginPath()
          ctx.arc(px, py, 110, 0, Math.PI * 2)
          ctx.stroke()

          // Glowing Sparkle Dust
          ctx.fillStyle = '#e9d5ff'
          for (let i = 0; i < 6; i++) {
            const angle = (timeSec * 2 + (i * Math.PI) / 3)
            const sx = px + Math.cos(angle) * (20 + i * 12)
            const sy = py + Math.sin(angle) * (20 + i * 12)
            ctx.beginPath()
            ctx.arc(sx, sy, 2.5, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        }

        case 'magnifying_glass': {
          // 3D Magnifying Lens: Refraction rim & focal highlight
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.arc(px, py, 80, 0, Math.PI * 2)
          ctx.stroke()

          ctx.fillStyle = 'rgba(251, 191, 36, 0.15)'
          ctx.beginPath()
          ctx.arc(px, py, 80, 0, Math.PI * 2)
          ctx.fill()

          // Glass Glare Arc
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(px, py, 74, -Math.PI * 0.75, -Math.PI * 0.25)
          ctx.stroke()

          // Precision Crosshair
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(px - 20, py)
          ctx.lineTo(px + 20, py)
          ctx.moveTo(px, py - 20)
          ctx.lineTo(px, py + 20)
          ctx.stroke()
          break
        }

        case 'sound_horn': {
          // 3D Listening Horn: Directional acoustic pulse wave arcs
          ctx.strokeStyle = '#06b6d4'
          for (let r = 30; r <= 90; r += 20) {
            const waveOffset = ((timeSec * 60) % 20)
            const curR = r + waveOffset
            ctx.lineWidth = 3 - (curR / 120) * 2
            ctx.beginPath()
            ctx.arc(px, py, curR, -Math.PI * 0.4, Math.PI * 0.4)
            ctx.stroke()
          }

          // Sound note emoji
          ctx.font = '24px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('🎵', px - 20, py - 20)
          break
        }

        case 'decoder_lens': {
          // 3D Rune Decoder: Spectral runic overlay circle & glyphs
          ctx.strokeStyle = '#ec4899'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.arc(px, py, 85, 0, Math.PI * 2)
          ctx.stroke()

          ctx.fillStyle = 'rgba(236, 72, 153, 0.18)'
          ctx.beginPath()
          ctx.arc(px, py, 85, 0, Math.PI * 2)
          ctx.fill()

          // Rotating Runic Wheel
          const runes = ['ᚠ', 'ᚱ', 'ᚦ', 'ᛋ', 'ᛏ', '✨']
          ctx.font = '16px serif'
          ctx.fillStyle = '#f472b6'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          for (let i = 0; i < runes.length; i++) {
            const a = (i * Math.PI * 2) / runes.length + timeSec * 0.5
            const rx = px + Math.cos(a) * 65
            const ry = py + Math.sin(a) * 65
            ctx.fillText(runes[i], rx, ry)
          }
          break
        }
      }
      ctx.restore()
    }
  }, [currentCase, state.discoveredClueIds, inspectedFeedbackId, state.activeTool, pointerPos, isPointerOverScene, isDraggingTool])

  // PointerCapture Sweep Handler
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)
      setIsDraggingTool(true)
      setIsPointerOverScene(true)

      const rect = canvas.getBoundingClientRect()
      const clickX = (e.clientX - rect.left) * (800 / rect.width)
      const clickY = (e.clientY - rect.top) * (500 / rect.height)
      setPointerPos({ x: clickX, y: clickY })

      // Check if clicked directly on a hotspot
      const hit = currentCase.hotspots.find((h) => {
        const dist = Math.hypot(clickX - h.x, clickY - h.y)
        return dist <= h.radius + 15
      })

      if (hit) {
        handleInspectHotspot(hit)
      }
    },
    [currentCase.hotspots, handleInspectHotspot]
  )

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const curX = (e.clientX - rect.left) * (800 / rect.width)
    const curY = (e.clientY - rect.top) * (500 / rect.height)
    setPointerPos({ x: curX, y: curY })
  }, [])

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      setIsDraggingTool(false)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Safe release
      }
    },
    []
  )

  return (
    <div
      className="mystery-detective-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <ActivityShell
        title="3D Midnight Noir Detective"
        emoji="🔍"
        tagline="Inspect crime scenes with 3D forensic tools, gather evidence, and deduce the culprit!"
        primaryDomain="logic"
        secondaryDomains={['comprehension', 'vocabulary']}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        supportsDifficulty={true}
        progressInfo={`Case File #${caseIndex + 1}`}
        className="mystery-detective-shell"
        headerRight={
          onBack ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.65rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid var(--border, #e2e8f0)',
                color: 'var(--text-heading, #1e1b4b)',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              ⬅️ Exit Lab
            </button>
          ) : undefined
        }
      >
        <div
          className="mystery-detective-root"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
            gap: '1rem',
            padding: '4px',
          }}
        >
          {/* Screen Reader Live Announcements */}
          <div className="sr-only" role="status" aria-live="polite">
            {feedbackMessage ||
              `Active tool: ${activeToolMeta.name}. ${state.discoveredClueIds.length} of ${currentCase.clues.length} clues discovered.`}
          </div>

          {/* 1. Mystery Briefing Header Banner */}
          <section
            className="detective-case-header card-panel"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
              color: '#ffffff',
              borderRadius: '1.25rem',
              padding: '1rem 1.25rem',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.45)',
              border: '1.5px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#fbbf24',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>⭐ Case File #{caseIndex + 1}</span>
                  {story ? (
                    <>
                      <span>•</span>
                      <span>📖 {story.title}</span>
                    </>
                  ) : null}
                  <span>•</span>
                  <span>
                    {currentCase.locationEmoji} {currentCase.locationName}
                  </span>
                </div>
                <h2
                  style={{
                    margin: '0.2rem 0',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  {currentCase.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.88rem',
                    color: '#cbd5e1',
                    lineHeight: 1.4,
                  }}
                >
                  {currentCase.narrativeIntro}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleReplayCase}
                  className="button button-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                >
                  🔄 Reset
                </button>
                <button
                  type="button"
                  onClick={handleNextCase}
                  className="button button-primary"
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                >
                  Next Case ➔
                </button>
              </div>
            </div>
          </section>

          {/* First-Turn Animated Hand Hint */}
          {state.discoveredClueIds.length === 0 && (
            <div
              style={{
                alignSelf: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)',
                border: '1.5px solid #fbbf24',
                borderRadius: '9999px',
                padding: '6px 16px',
                color: '#fef08a',
                fontSize: '13px',
                fontWeight: 800,
                animation: 'bounceGentle 2s infinite',
              }}
            >
              <span style={{ fontSize: '18px' }}>👇</span>
              <span>Sweep your forensic tool across the crime scene below and tap glowing hotspots!</span>
            </div>
          )}

          {/* 2. Interactive 3D Depth Crime Scene Canvas Stage */}
          <section
            className="crime-scene-stage card-panel"
            style={{
              position: 'relative',
              borderRadius: '1.25rem',
              background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
              border: '2px solid #334155',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Active Forensic Tool Indicator Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                zIndex: 1,
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '999px',
                  border: `1.5px solid ${activeToolMeta.accentColor}`,
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <span>Equipped Tool:</span>
                <span style={{ color: activeToolMeta.accentColor }}>
                  {activeToolMeta.icon} {activeToolMeta.name}
                </span>
              </div>

              {feedbackMessage && (
                <div
                  style={{
                    backgroundColor: '#fef08a',
                    color: '#854d0e',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {feedbackMessage}
                </div>
              )}
            </div>

            {/* 3D Crime Scene Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="crime-scene-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerEnter={() => setIsPointerOverScene(true)}
              onPointerLeave={() => setIsPointerOverScene(false)}
              tabIndex={0}
              aria-label="3D Crime Scene Investigation Canvas. Sweep forensic tools to uncover evidence."
              style={{
                touchAction: 'none',
                maxWidth: '100%',
                maxHeight: '320px',
                borderRadius: '16px',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                cursor: 'crosshair',
              }}
            />

            {/* 3. Forensic Tool Belt */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.6rem',
                flexWrap: 'wrap',
                zIndex: 1,
                marginTop: '0.75rem',
              }}
            >
              {(Object.keys(INVESTIGATION_TOOLS) as InvestigationToolType[]).map((toolKey, idx) => {
                const tool = INVESTIGATION_TOOLS[toolKey]
                const isSelected = state.activeTool === toolKey

                const tooltipsMap: Record<InvestigationToolType, string> = {
                  uv_brush: 'UV Sparkle Brush: Reveals fluorescent pawprints and hidden traces',
                  sound_horn: 'Listening Horn: Amplifies whispers and mechanical clock ticks',
                  decoder_lens: 'Rune Decoder Lens: Translates encrypted glyphs & ciphers',
                  magnifying_glass: 'Magnifying Glass: Spot microscopic fibers and feather dust',
                }

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTool(tool.id)}
                    aria-pressed={isSelected}
                    title={`${tool.name} - ${tooltipsMap[toolKey] || tool.description}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '0.9rem',
                      backgroundColor: isSelected ? tool.accentColor : 'rgba(30, 41, 59, 0.9)',
                      color: '#ffffff',
                      border: `2px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'}`,
                      boxShadow: isSelected
                        ? `0 0 16px ${tool.accentColor}`
                        : '0 4px 10px rgba(0,0,0,0.2)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      minHeight: '44px',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{tool.icon}</span>
                    <span>{tool.name}</span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                      }}
                    >
                      [{idx + 1}]
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 4. Evidence Pinboard & Dark Slate Glassmorphic Suspect Lineup */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Left Column: Discovered Clues Board */}
            <section
              className="evidence-corkboard card-panel"
              style={{
                backgroundColor: '#fef3c7',
                backgroundImage: 'radial-gradient(#d97706 0.75px, transparent 0.75px)',
                backgroundSize: '16px 16px',
                borderRadius: '1.25rem',
                padding: '1.1rem',
                border: '3px solid #78350f',
                boxShadow: '0 8px 20px rgba(120, 53, 15, 0.15)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  borderBottom: '2px dashed #b45309',
                  paddingBottom: '0.4rem',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>📌</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>
                  Evidence Pinboard ({state.discoveredClueIds.length} / {currentCase.clues.length})
                </h3>
              </div>

              {state.discoveredClueIds.length === 0 ? (
                <div
                  style={{
                    padding: '1.2rem',
                    textAlign: 'center',
                    color: '#92400e',
                    fontSize: '0.88rem',
                    fontStyle: 'italic',
                  }}
                >
                  No clues discovered yet! Sweep the crime scene hotspots above with your forensic tools.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  {currentCase.clues.map((clue, idx) => {
                    const isFound = state.discoveredClueIds.includes(clue.id)
                    if (!isFound) return null

                    const toolMeta = INVESTIGATION_TOOLS[clue.discoveryTool]

                    return (
                      <div
                        key={clue.id}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '0.75rem',
                          padding: '0.75rem 0.9rem',
                          border: '1px solid #fde68a',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                          display: 'flex',
                          gap: '0.65rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>{clue.icon || '🔍'}</span>
                        <div>
                          <div
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: '#b45309',
                              textTransform: 'uppercase',
                            }}
                          >
                            Clue #{idx + 1} • {toolMeta.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              color: '#1e293b',
                              marginTop: '2px',
                            }}
                          >
                            {clue.textDescription}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Right Column: Dark Slate Glassmorphic Suspect Lineup */}
            <section
              className="suspect-lineup card-panel"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.96) 100%)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1.25rem',
                padding: '1.1rem',
                border: '1.5px solid rgba(168, 85, 247, 0.35)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
                color: '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>🕵️</span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#f8fafc',
                    }}
                  >
                    Suspect Lineup ({currentCase.suspectPool.length})
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: allCluesFound ? '#ffffff' : '#fbbf24',
                    backgroundColor: allCluesFound ? '#16a34a' : 'rgba(245, 158, 11, 0.25)',
                    border: `1px solid ${allCluesFound ? '#22c55e' : 'rgba(245, 158, 11, 0.5)'}`,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}
                >
                  {allCluesFound ? '⭐ Ready to Deduce!' : 'Gather More Clues'}
                </span>
              </div>

              {/* Innocent Alibi Popup Banner */}
              {innocentAlibi && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #f87171',
                    borderRadius: '0.75rem',
                    padding: '0.65rem 0.8rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{innocentAlibi.suspect.avatar}</span>
                  <div>
                    <strong style={{ color: '#fca5a5', fontSize: '0.85rem' }}>
                      {innocentAlibi.suspect.name}'s Alibi:
                    </strong>
                    <div style={{ color: '#ffffff', fontSize: '0.82rem' }}>
                      "{innocentAlibi.text}"
                    </div>
                  </div>
                </div>
              )}

              {/* Suspect Cards Grid */}
              <div style={{ display: 'grid', gap: '0.65rem' }}>
                {currentCase.suspectPool.map((suspect) => {
                  const isEliminated = state.eliminatedSuspectIds.includes(suspect.id)

                  return (
                    <div
                      key={suspect.id}
                      style={{
                        backgroundColor: isEliminated
                          ? 'rgba(30, 41, 59, 0.45)'
                          : 'rgba(30, 41, 59, 0.85)',
                        borderRadius: '0.85rem',
                        padding: '0.75rem 0.9rem',
                        border: `1px solid ${isEliminated ? 'rgba(255, 255, 255, 0.08)' : 'rgba(168, 85, 247, 0.25)'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem',
                        opacity: isEliminated ? 0.55 : 1,
                        transform: isEliminated ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.75rem' }}>{suspect.avatar}</span>
                        <div>
                          <div
                            style={{
                              fontSize: '0.95rem',
                              fontWeight: 800,
                              color: isEliminated ? '#94a3b8' : '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <span>{suspect.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#a855f7' }}>
                              ({suspect.species})
                            </span>
                            <span style={{ fontSize: '0.85rem' }}>
                              {isEliminated ? '😇' : allCluesFound ? '🤐' : '👀'}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              gap: '0.35rem',
                              flexWrap: 'wrap',
                              marginTop: '3px',
                            }}
                          >
                            <span className="trait-tag" style={traitTagStyle}>
                              {suspect.traits.height}
                            </span>
                            <span className="trait-tag" style={traitTagStyle}>
                              {suspect.traits.furOrFeathers} fur
                            </span>
                            <span className="trait-tag" style={traitTagStyle}>
                              {suspect.traits.footprint} prints
                            </span>
                            <span className="trait-tag" style={traitTagStyle}>
                              {suspect.traits.accessory}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleToggleEliminate(suspect.id)}
                          title={isEliminated ? 'Restore suspect' : 'Eliminate suspect'}
                          style={{
                            padding: '0.35rem 0.6rem',
                            borderRadius: '0.5rem',
                            backgroundColor: isEliminated ? '#475569' : 'rgba(239, 68, 68, 0.2)',
                            color: isEliminated ? '#cbd5e1' : '#fca5a5',
                            border: `1px solid ${isEliminated ? '#64748b' : 'rgba(239, 68, 68, 0.4)'}`,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            minHeight: '38px',
                          }}
                        >
                          {isEliminated ? 'Undo' : 'Rule Out'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAccuse(suspect)}
                          disabled={isEliminated}
                          title={`Accuse ${suspect.name}`}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.5rem',
                            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            cursor: isEliminated ? 'not-allowed' : 'pointer',
                            opacity: isEliminated ? 0.4 : 1,
                            boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                            minHeight: '38px',
                          }}
                        >
                          ⚖️ Accuse!
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* 5. Science of Wonder Dossier */}
          {state.status === 'solved' && (
            <div
              className="science-dossier-card card-panel"
              role="region"
              aria-label="Science of Wonder Discovery"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                border: '1.5px solid #38bdf8',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(56, 189, 248, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔬</span>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                  Science of Wonder: {currentCase.scientificConcept.title}
                </h4>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {currentCase.scientificConcept.description}
              </p>
              <div
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.85rem',
                  color: '#bae6fd',
                }}
              >
                <strong>💡 Fun Science Fact:</strong> {currentCase.scientificConcept.funFact}
              </div>
            </div>
          )}
        </div>

        {/* Victory Celebration Modal */}
        <VictoryCelebrationModal
          isOpen={showCelebration}
          title="Case Closed! Mystery Solved!"
          subtitle={`You gathered all forensic clues and deduced that ${
            currentCase.suspectPool.find((s) => s.id === currentCase.culpritId)?.name || 'the culprit'
          } borrowed ${currentCase.missingItem}!`}
          badgeEmoji="🕵️"
          xpEarned={state.telemetry.xp || 35}
          starsEarned={state.telemetry.stars || 8}
          nextLevelLabel="Next Case File ➔"
          onNextLevel={handleNextCase}
          onExit={onBack}
        />
      </ActivityShell>
    </div>
  )
}

const traitTagStyle: React.CSSProperties = {
  fontSize: '0.68rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#e2e8f0',
  padding: '0.1rem 0.4rem',
  borderRadius: '4px',
  textTransform: 'capitalize',
}
