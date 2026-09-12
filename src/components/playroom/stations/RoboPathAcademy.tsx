import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { DifficultyTier } from '../../../types/experience'
import type {
  RoboToken,
  RoboPathChallenge,
  RobotState,
  ProgramStepResult,
} from '../../../types/games/roboPath'
import {
  generateProceduralRoboPathChallenge,
  executeRoboProgram,
  TOKEN_CATALOG,
  DIRECTION_DELTAS,
} from '../../../services/games/roboPathEngine'
import { sfxService } from '../../../services/audio/sfxService'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

interface RoboPathAcademyProps {
  initialDifficulty?: DifficultyTier
  childId?: string
  onComplete?: (stars: number, xp: number) => void
  onBack?: () => void
}

export const RoboPathAcademy: React.FC<RoboPathAcademyProps> = ({
  initialDifficulty = 'easy',
  childId = 'guest',
  onComplete,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [challenge, setChallenge] = useState<RoboPathChallenge>(() =>
    generateProceduralRoboPathChallenge(`robo_${Date.now()}`, initialDifficulty)
  )

  const [programTape, setProgramTape] = useState<RoboToken[]>([])
  const [robotState, setRobotState] = useState<RobotState>({
    x: challenge.startPos.x,
    y: challenge.startPos.y,
    direction: challenge.startDirection,
    energy: 100,
    maxEnergy: 100,
    crystalsCollected: 0,
    isAlive: true,
    isGoalReached: false,
    statusMessage: 'Ready to program BEEP-0!',
  })

  const [isRunning, setIsRunning] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)
  const [executionSpeed, setExecutionSpeed] = useState<number>(400) // ms per step
  const [showScienceDossier, setShowScienceDossier] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [attempts, setAttempts] = useState(1)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Universal Activity Economy integration
  const { completeActivity } = useActivityEconomy({
    activityType: 'robopath_academy',
    activityId: `robopath_${challenge.id}`,
    childId,
  })

  // Load new challenge on difficulty switch
  const handleDifficultyChange = (newDiff: DifficultyTier) => {
    setDifficulty(newDiff)
    const newChallenge = generateProceduralRoboPathChallenge(`robo_${Date.now()}`, newDiff)
    setChallenge(newChallenge)
    setProgramTape([])
    setRobotState({
      x: newChallenge.startPos.x,
      y: newChallenge.startPos.y,
      direction: newChallenge.startDirection,
      energy: 100,
      maxEnergy: 100,
      crystalsCollected: 0,
      isAlive: true,
      isGoalReached: false,
      statusMessage: 'Ready to program BEEP-0!',
    })
    setActiveStepIndex(null)
    setIsRunning(false)
    setShowScienceDossier(false)
    setAttempts(1)
  }

  // Token Tape Actions
  const handleAddToken = (token: RoboToken) => {
    if (isRunning) return
    if (programTape.length >= challenge.maxTokens) {
      sfxService.play('mistake_soft')
      return
    }
    sfxService.resumeContext().catch(() => {})
    sfxService.play('card_flip')
    setProgramTape((prev) => [...prev, token])
  }

  const handleRemoveToken = (index: number) => {
    if (isRunning) return
    sfxService.resumeContext().catch(() => {})
    sfxService.play('card_flip')
    setProgramTape((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClearTape = () => {
    if (isRunning) return
    sfxService.resumeContext().catch(() => {})
    sfxService.play('card_flip')
    setProgramTape([])
    handleResetRobot()
  }

  const handleResetRobot = useCallback(() => {
    setIsRunning(false)
    setActiveStepIndex(null)
    setRobotState({
      x: challenge.startPos.x,
      y: challenge.startPos.y,
      direction: challenge.startDirection,
      energy: 100,
      maxEnergy: 100,
      crystalsCollected: 0,
      isAlive: true,
      isGoalReached: false,
      statusMessage: 'BEEP-0 reset to start coordinates.',
    })
  }, [challenge])

  // Run Program Execution
  const handleRunProgram = async () => {
    if (programTape.length === 0 || isRunning) return

    sfxService.resumeContext().catch(() => {})
    setIsRunning(true)
    handleResetRobot()

    const trace = executeRoboProgram(challenge, programTape)

    for (let i = 0; i < trace.steps.length; i++) {
      const step: ProgramStepResult = trace.steps[i]
      setActiveStepIndex(step.tokenIndex)
      setRobotState(step.nextState)

      if (step.sfxCue === 'step') sfxService.play('card_flip')
      else if (step.sfxCue === 'turn') sfxService.play('card_flip')
      else if (step.sfxCue === 'jump') sfxService.play('star_pop')
      else if (step.sfxCue === 'crystal') sfxService.play('match_success')
      else if (step.sfxCue === 'beacon') sfxService.play('victory_fanfare')
      else if (step.sfxCue === 'bump' || step.sfxCue === 'laser') sfxService.play('mistake_soft')

      await new Promise((resolve) => setTimeout(resolve, executionSpeed))
    }

    setIsRunning(false)
    setActiveStepIndex(null)

    if (trace.success) {
      sfxService.play('victory_fanfare')
      setShowScienceDossier(true)
      await completeActivity({ starsAmount: challenge.rewardStars, xpAmount: challenge.rewardXP })
      setShowCelebration(true)
      if (onComplete) onComplete(challenge.rewardStars, challenge.rewardXP)
    } else {
      sfxService.play('mistake_soft')
      setAttempts((prev) => prev + 1)
    }
  }

  // 60 FPS 3D-Depth Isometric Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particleTick = 0

    const renderLoop = () => {
      particleTick++
      const width = canvas.width
      const height = canvas.height

      // Clear with deep cosmic grid background
      ctx.fillStyle = '#0b0f19'
      ctx.fillRect(0, 0, width, height)

      // Ambient radial glow behind the arena
      const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 1.5)
      bgGlow.addColorStop(0, 'rgba(56, 189, 248, 0.12)')
      bgGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)')
      bgGlow.addColorStop(1, 'rgba(11, 15, 25, 0)')
      ctx.fillStyle = bgGlow
      ctx.fillRect(0, 0, width, height)

      const tileWidth = 64
      const tileHeight = 36
      const originX = width / 2
      const originY = 80 + (7 - challenge.gridHeight) * 15

      // Draw Grid Tiles (Isometric projection)
      for (let y = 0; y < challenge.gridHeight; y++) {
        for (let x = 0; x < challenge.gridWidth; x++) {
          const tile = challenge.tiles[y][x]
          const isoX = originX + (x - y) * (tileWidth / 2)
          const isoY = originY + (x + y) * (tileHeight / 2)

          // Draw Tile Base
          ctx.beginPath()
          ctx.moveTo(isoX, isoY)
          ctx.lineTo(isoX + tileWidth / 2, isoY + tileHeight / 2)
          ctx.lineTo(isoX, isoY + tileHeight)
          ctx.lineTo(isoX - tileWidth / 2, isoY + tileHeight / 2)
          ctx.closePath()

          if (tile.type === 'battery_beacon') {
            const beaconGlow = Math.sin(particleTick * 0.08) * 0.2 + 0.8
            ctx.fillStyle = `rgba(251, 191, 36, ${beaconGlow})`
            ctx.strokeStyle = '#f59e0b'
          } else if (tile.type === 'wall') {
            ctx.fillStyle = '#1e293b'
            ctx.strokeStyle = '#475569'
          } else if (tile.type === 'water') {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
            ctx.strokeStyle = '#0891b2'
          } else if (tile.hasCrystal) {
            ctx.fillStyle = '#1e1b4b'
            ctx.strokeStyle = '#818cf8'
          } else if (tile.isVisited) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.25)'
            ctx.strokeStyle = '#0284c7'
          } else {
            ctx.fillStyle = '#111827'
            ctx.strokeStyle = '#374151'
          }

          ctx.lineWidth = 1.5
          ctx.fill()
          ctx.stroke()

          // Draw 3D Walls
          if (tile.type === 'wall') {
            const wallH = 24
            ctx.fillStyle = '#334155'
            ctx.beginPath()
            ctx.moveTo(isoX - tileWidth / 2, isoY + tileHeight / 2)
            ctx.lineTo(isoX, isoY + tileHeight)
            ctx.lineTo(isoX, isoY + tileHeight - wallH)
            ctx.lineTo(isoX - tileWidth / 2, isoY + tileHeight / 2 - wallH)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = '#475569'
            ctx.beginPath()
            ctx.moveTo(isoX, isoY + tileHeight)
            ctx.lineTo(isoX + tileWidth / 2, isoY + tileHeight / 2)
            ctx.lineTo(isoX + tileWidth / 2, isoY + tileHeight / 2 - wallH)
            ctx.lineTo(isoX, isoY + tileHeight - wallH)
            ctx.closePath()
            ctx.fill()
          }

          // Draw Floating Energy Crystal
          if (tile.hasCrystal) {
            const floatOffset = Math.sin(particleTick * 0.1 + (x + y)) * 6
            const gemX = isoX
            const gemY = isoY + tileHeight / 2 - 12 + floatOffset

            ctx.save()
            ctx.shadowColor = '#fbbf24'
            ctx.shadowBlur = 12
            ctx.fillStyle = '#fef08a'
            ctx.beginPath()
            ctx.moveTo(gemX, gemY - 10)
            ctx.lineTo(gemX + 8, gemY)
            ctx.lineTo(gemX, gemY + 10)
            ctx.lineTo(gemX - 8, gemY)
            ctx.closePath()
            ctx.fill()
            ctx.restore()
          }

          // Draw Battery Beacon Tower
          if (tile.type === 'battery_beacon') {
            const beaconH = 28
            ctx.save()
            ctx.shadowColor = '#f59e0b'
            ctx.shadowBlur = 16
            ctx.fillStyle = '#fbbf24'
            ctx.fillRect(isoX - 4, isoY + tileHeight / 2 - beaconH, 8, beaconH)

            // Beacon energy light bulb
            ctx.beginPath()
            ctx.arc(isoX, isoY + tileHeight / 2 - beaconH - 6, 8, 0, Math.PI * 2)
            ctx.fillStyle = '#fffbeb'
            ctx.fill()
            ctx.restore()
          }
        }
      }

      // Draw Robot Avatar (BEEP-0)
      const robotIsoX = originX + (robotState.x - robotState.y) * (tileWidth / 2)
      const robotIsoY = originY + (robotState.x + robotState.y) * (tileHeight / 2) + tileHeight / 2 - 16

      ctx.save()
      ctx.translate(robotIsoX, robotIsoY)

      // Robot Shadow
      ctx.beginPath()
      ctx.ellipse(0, 16, 18, 9, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fill()

      // Robot Body (Metallic Cyan Pod)
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 14
      ctx.fillStyle = '#0284c7'
      ctx.beginPath()
      ctx.roundRect(-16, -16, 32, 28, 8)
      ctx.fill()

      // Robot LED Visor Screen
      ctx.fillStyle = '#0f172a'
      ctx.beginPath()
      ctx.roundRect(-12, -12, 24, 14, 4)
      ctx.fill()

      // Glowing Cyan Visor Eyes
      const eyeBlink = Math.sin(particleTick * 0.05) > 0.95 ? 1 : 4
      ctx.fillStyle = '#38bdf8'
      ctx.beginPath()
      ctx.arc(-5, -5, eyeBlink, 0, Math.PI * 2)
      ctx.arc(5, -5, eyeBlink, 0, Math.PI * 2)
      ctx.fill()

      // Directional Heading Indicator
      const headingDelta = DIRECTION_DELTAS[robotState.direction]
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(headingDelta.dx * 16, headingDelta.dy * 12)
      ctx.stroke()

      // Thruster Sparks when running
      if (isRunning) {
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.arc(Math.sin(particleTick) * 6, 14, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      animationFrameRef.current = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [challenge, robotState, isRunning])

  return (
    <ActivityShell
      title="Robo-Path Academy"
      emoji="🤖"
      tagline="Computational Coding Logic & Algorithmic Sequencing"
      primaryDomain="logic"
      difficulty={difficulty}
      variant="hero"
      onDifficultyChange={(newDiff) => handleDifficultyChange(newDiff as DifficultyTier)}
    >
      <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto p-4 select-none">
        {/* Left Column: 3D Isometric Viewport */}
        <div className="flex-1 flex flex-col items-center bg-slate-900/80 backdrop-blur-md rounded-2xl border border-sky-500/30 p-4 shadow-2xl relative overflow-hidden">
          {/* Header Stats Bar */}
          <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 mb-3 text-sm font-medium">
            <div className="flex items-center gap-3">
              <span className="text-sky-400 font-bold tracking-wide">⚡ Energy: {robotState.energy}%</span>
              <span className="text-amber-400 font-bold">
                💎 Crystals: {robotState.crystalsCollected}/{challenge.totalCrystals}
              </span>
              <span className="text-xs text-slate-400">Run: #{attempts}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tokens:</span>
              <span className={`font-bold ${programTape.length > challenge.parMoves ? 'text-amber-400' : 'text-emerald-400'}`}>
                {programTape.length} / {challenge.maxTokens} (Par: {challenge.parMoves})
              </span>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative w-full aspect-[4/3] max-h-[460px] flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <canvas ref={canvasRef} width={640} height={460} className="w-full h-full object-contain" />

            {/* Status Overlay Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="font-semibold text-sky-300">{robotState.statusMessage}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Facing:</span>
                <span className="font-bold text-amber-300">{robotState.direction}</span>
              </div>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunProgram}
                disabled={isRunning || programTape.length === 0}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>▶️</span>
                <span>Run Program</span>
              </button>

              <button
                type="button"
                onClick={handleResetRobot}
                disabled={isRunning}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>🔄</span>
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleClearTape}
                disabled={isRunning || programTape.length === 0}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-semibold rounded-xl border border-slate-700 active:scale-95 transition-all"
              >
                🧹 Clear
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span>Speed:</span>
              <button
                type="button"
                onClick={() => setExecutionSpeed(400)}
                className={`px-2 py-0.5 rounded ${executionSpeed === 400 ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setExecutionSpeed(200)}
                className={`px-2 py-0.5 rounded ${executionSpeed === 200 ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
              >
                2x
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Program Tape & Token Dock */}
        <div className="w-full xl:w-[440px] flex flex-col gap-4">
          {/* Program Sequence Tape */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>📼</span> Program Code Tape
              </span>
              <span className="text-xs font-mono text-slate-400">
                {programTape.length}/{challenge.maxTokens} instructions
              </span>
            </div>

            {/* Instruction Slot Tape */}
            <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-2 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-wrap gap-2 content-start">
              {programTape.length === 0 ? (
                <div className="w-full h-28 flex flex-col items-center justify-center text-slate-500 text-xs text-center gap-1">
                  <span>No instructions queued.</span>
                  <span>Tap commands below to program BEEP-0!</span>
                </div>
              ) : (
                programTape.map((token, idx) => {
                  const meta = TOKEN_CATALOG[token]
                  const isActive = activeStepIndex === idx
                  return (
                    <button
                      key={`${token}_${idx}`}
                      type="button"
                      onClick={() => handleRemoveToken(idx)}
                      disabled={isRunning}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        isActive
                          ? 'ring-2 ring-amber-400 scale-105 shadow-amber-400/40 bg-amber-500 text-slate-950'
                          : 'bg-slate-800/90 text-slate-200 hover:bg-rose-900/50 hover:text-rose-200 border border-slate-700'
                      }`}
                    >
                      <span>{meta.symbol}</span>
                      <span>{meta.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1">✕</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Token Toolbox Dock */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>🧰</span> Command Toolbox
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {challenge.allowedTokens.map((token) => {
                const meta = TOKEN_CATALOG[token]
                return (
                  <button
                    key={token}
                    type="button"
                    onClick={() => handleAddToken(token)}
                    disabled={isRunning || programTape.length >= challenge.maxTokens}
                    className="p-3 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 disabled:opacity-40 rounded-xl border border-slate-700/80 flex flex-col gap-1 text-left transition-all shadow-lg group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl group-hover:scale-110 transition-transform">{meta.symbol}</span>
                      <span className="text-[10px] font-mono text-sky-400 font-bold">{meta.energyCost}⚡</span>
                    </div>
                    <span className="text-xs font-bold text-slate-100">{meta.name}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{meta.description}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Science of Wonder Codex Overlay */}
      {showScienceDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                🔬 Science of Wonder Dossier
              </span>
              <button
                type="button"
                onClick={() => setShowScienceDossier(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{challenge.scientificConcept.conceptTitle}</h3>
                <p className="text-xs text-amber-300 font-medium">{challenge.scientificConcept.scienceTopic}</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              {challenge.scientificConcept.kidExplanation}
            </p>

            <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-2xl flex items-start gap-2.5">
              <span className="text-lg">💡</span>
              <div className="text-xs text-amber-200 leading-relaxed">
                <span className="font-bold">Fun Fact: </span>
                {challenge.scientificConcept.funFact}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowScienceDossier(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 transition-all text-sm"
            >
              Continue Adventure 🚀
            </button>
          </div>
        </div>
      )}

      {/* Universal Activity Reward Celebration */}
      <VictoryCelebrationModal
        isOpen={showCelebration}
        title={`Circuit Activated: ${challenge.title}!`}
        subtitle={`BEEP-0 completed the algorithmic sequence with ${robotState.crystalsCollected} crystals collected!`}
        badgeEmoji="🤖"
        xpEarned={challenge.rewardXP}
        starsEarned={challenge.rewardStars}
        nextLevelLabel="Next Circuit ➔"
        onNextLevel={() => handleDifficultyChange(difficulty)}
        onExit={onBack}
      />
    </ActivityShell>
  )
}
