import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type { RhythmSpellsChallenge, BeatPad } from '../../../types/games/rhythmSpells'
import {
  generateRhythmSpellsChallenge,
  getInitialRhythmSpellsState,
  evaluateRhythmSpellsAction,
  calculateRhythmSpellsScore,
} from '../../../services/games/rhythmSpellsEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

export interface RhythmSpellsConductorProps {
  story?: StoryRecord | null
  childId?: string | null
  explorerLevel?: number
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

interface NoteParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  symbol: string
  color: string
  size: number
}

interface WaveRipple {
  x: number
  y: number
  radius: number
  maxRadius: number
  life: number
  color: string
}

export const RhythmSpellsConductor: React.FC<RhythmSpellsConductorProps> = ({
  story,
  childId = null,
  explorerLevel = 1,
  onBack,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  // Visual pad squash tracking: padIndex -> scale (e.g. 0.85 -> 1.0)
  const padScalesRef = useRef<number[]>([])
  const noteParticlesRef = useRef<NoteParticle[]>([])
  const waveRipplesRef = useRef<WaveRipple[]>([])
  const audioBarsRef = useRef<number[]>(new Array(16).fill(10))

  // Current challenge
  const currentChallenge: RhythmSpellsChallenge = useMemo(() => {
    return generateRhythmSpellsChallenge(challengeIndex, difficulty, explorerLevel)
  }, [challengeIndex, difficulty, explorerLevel])

  // Engine state reducer
  const [state, dispatch] = useReducer(
    evaluateRhythmSpellsAction,
    currentChallenge,
    (c) => getInitialRhythmSpellsState(c)
  )

  // Sync state when challenge changes
  useEffect(() => {
    dispatch({ type: 'LOAD_CHALLENGE', challenge: currentChallenge })
    setShowCelebration(false)
    padScalesRef.current = new Array(currentChallenge.pads.length).fill(1.0)
    noteParticlesRef.current = []
    waveRipplesRef.current = []
  }, [currentChallenge])

  // Authoritative Reward Economy Hook
  const { completeActivity } = useActivityEconomy({
    childId,
    activityType: 'rhythm_spells',
    activityId: `rhythm_${currentChallenge.id}`,
  })

  // Metronome & Audio Beat Loop
  useEffect(() => {
    if (state.status === 'celebrating' || state.status === 'spell_cast') return

    const beatIntervalMs = (60 / currentChallenge.tempoBpm) * 1000
    const timer = setInterval(() => {
      dispatch({ type: 'BEAT_TICK' })
      sfxService.play('beat_pulse')

      // Add a subtle center pulse wave
      waveRipplesRef.current.push({
        x: 400,
        y: 220,
        radius: 10,
        maxRadius: 180,
        life: 1.0,
        color: 'rgba(45, 212, 191, 0.35)',
      })
    }, beatIntervalMs)

    return () => clearInterval(timer)
  }, [state.status, currentChallenge.tempoBpm])

  // Handle Spell Cast Victory
  useEffect(() => {
    if (state.status === 'spell_cast' && !showCelebration) {
      HapticsService.success()
      sfxService.play('spell_awaken')
      sfxService.play('victory_fanfare')
      setShowCelebration(true)

      const calculated = calculateRhythmSpellsScore(state.telemetry, currentChallenge)
      completeActivity({
        starsAmount: calculated.stars,
        xpAmount: calculated.xp,
      }).catch(() => {
        // Handled gracefully inside hook
      })
    }
  }, [state.status, showCelebration, state.telemetry, currentChallenge, completeActivity])

  // Spawn note particles on hit
  const spawnNoteParticles = useCallback((cx: number, cy: number, color: string) => {
    const symbols = ['♪', '♫', '♬', '♩', '✨']
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 4
      noteParticlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1.0,
        maxLife: 0.6 + Math.random() * 0.4,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color,
        size: 16 + Math.random() * 10,
      })
    }

    // Expanding shockwave ripple
    waveRipplesRef.current.push({
      x: cx,
      y: cy,
      radius: 15,
      maxRadius: 90,
      life: 1.0,
      color,
    })
  }, [])

  // Pad Strike Handler
  const handlePadTap = useCallback(
    async (pad: BeatPad, cx?: number, cy?: number) => {
      if (state.status === 'spell_cast' || state.status === 'celebrating') return

      await sfxService.resumeContext()

      const isAlreadyFound = state.foundRhymeIds.includes(pad.id)
      if (pad.isRhyme && !isAlreadyFound) {
        HapticsService.medium()
        sfxService.playRuneTone(pad.padIndex)
        sfxService.play('rhyme_match')
        if (cx !== undefined && cy !== undefined) {
          spawnNoteParticles(cx, cy, pad.color)
        }
      } else if (!pad.isRhyme) {
        HapticsService.light()
        sfxService.playRuneTone(pad.padIndex)
        sfxService.play('mistake_soft')
      } else {
        HapticsService.light()
        sfxService.playRuneTone(pad.padIndex)
      }

      // Squash animation trigger
      if (padScalesRef.current[pad.padIndex] !== undefined) {
        padScalesRef.current[pad.padIndex] = 0.82
      }

      dispatch({ type: 'TAP_PAD', padId: pad.id })
    },
    [state.status, state.foundRhymeIds, spawnNoteParticles]
  )

  // Next Rhythm Spell
  const handleNextSpell = useCallback(() => {
    HapticsService.medium()
    setChallengeIndex((prev) => prev + 1)
    sfxService.play('card_flip')
  }, [])

  // Canvas 2D Stage Rendering Loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = 440
    let lastTime = performance.now()

    const renderLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      ctx.clearRect(0, 0, W, H)

      // 1. Stage Background with Pulse
      const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, 450)
      bgGrad.addColorStop(0, '#042f2e')
      bgGrad.addColorStop(0.6, '#0f172a')
      bgGrad.addColorStop(1, '#020617')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Stage Spotlights
      const spotGrad = ctx.createLinearGradient(0, 0, 0, H)
      spotGrad.addColorStop(0, 'rgba(45, 212, 191, 0.15)')
      spotGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.05)')
      spotGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = spotGrad
      ctx.fillRect(0, 0, W, H)

      // 2. Audio Spectrum Analyzer Bars along Stage Floor
      ctx.fillStyle = 'rgba(45, 212, 191, 0.25)'
      for (let i = 0; i < 16; i++) {
        const targetH = 15 + Math.sin(now * 0.006 + i * 0.4) * 20 + (state.combo > 0 ? 25 : 5)
        audioBarsRef.current[i] += (targetH - audioBarsRef.current[i]) * 0.15
        const barH = audioBarsRef.current[i]
        const barW = 32
        const barX = W / 2 - 8 * (barW + 8) + i * (barW + 8)
        const barY = H - barH - 10

        const barGrad = ctx.createLinearGradient(barX, barY, barX, H - 10)
        barGrad.addColorStop(0, '#2dd4bf')
        barGrad.addColorStop(1, 'rgba(13, 148, 136, 0.1)')
        ctx.fillStyle = barGrad
        ctx.beginPath()
        ctx.roundRect(barX, barY, barW, barH, 6)
        ctx.fill()
      }

      // 3. Render Concentric Waveform Ripples
      for (let i = waveRipplesRef.current.length - 1; i >= 0; i--) {
        const w = waveRipplesRef.current[i]
        w.radius += 90 * dt
        w.life -= dt / 0.8

        if (w.life <= 0 || w.radius >= w.maxRadius) {
          waveRipplesRef.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, w.life)
        ctx.strokeStyle = w.color
        ctx.lineWidth = 3
        ctx.shadowColor = w.color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // 4. Render 3D Beat Pads
      const padCount = currentChallenge.pads.length
      const padRadius = padCount <= 4 ? 54 : 46
      const spacingX = Math.min(130, (W - 120) / padCount)
      const startX = (W - (padCount - 1) * spacingX) / 2
      const padY = H / 2 - 10

      currentChallenge.pads.forEach((pad, idx) => {
        const cx = startX + idx * spacingX
        const cy = padY

        // Recover squash scale towards 1.0
        if (!padScalesRef.current[idx]) padScalesRef.current[idx] = 1.0
        padScalesRef.current[idx] += (1.0 - padScalesRef.current[idx]) * 0.18
        const scale = padScalesRef.current[idx]

        const isFound = state.foundRhymeIds.includes(pad.id)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scale, scale)

        // 3D Pad Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
        ctx.beginPath()
        ctx.ellipse(0, padRadius + 10, padRadius * 0.9, 12, 0, 0, Math.PI * 2)
        ctx.fill()

        // Pad Outer Metallic Rim
        ctx.fillStyle = isFound ? '#047857' : '#1e293b'
        ctx.strokeStyle = isFound ? '#34d399' : pad.color
        ctx.lineWidth = isFound ? 4 : 2.5
        ctx.shadowColor = isFound ? '#34d399' : pad.glowColor
        ctx.shadowBlur = isFound ? 24 : 12
        ctx.beginPath()
        ctx.arc(0, 0, padRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0

        // Inner Glowing Core
        const innerGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, padRadius - 8)
        innerGrad.addColorStop(0, isFound ? 'rgba(52, 211, 153, 0.4)' : `${pad.color}33`)
        innerGrad.addColorStop(1, '#0f172a')
        ctx.fillStyle = innerGrad
        ctx.beginPath()
        ctx.arc(0, 0, padRadius - 8, 0, Math.PI * 2)
        ctx.fill()

        // Musical Note Label (Top)
        ctx.fillStyle = isFound ? '#34d399' : pad.color
        ctx.font = 'bold 11px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(pad.noteName, 0, -padRadius + 18)

        // Pad Emoji
        ctx.font = `${padCount <= 4 ? 26 : 22}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(pad.emoji, 0, -2)

        // Word Label (Bottom)
        ctx.fillStyle = isFound ? '#fef08a' : '#ffffff'
        ctx.font = `bold ${padCount <= 4 ? 12 : 10}px system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(pad.word, 0, padRadius - 16)

        // Checkmark badge for found rhymes
        if (isFound) {
          ctx.fillStyle = '#10b981'
          ctx.beginPath()
          ctx.arc(padRadius - 12, -padRadius + 12, 12, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 12px sans-serif'
          ctx.fillText('✓', padRadius - 12, -padRadius + 16)
        }

        ctx.restore()
      })

      // 5. Render Musical Notation Note Particles
      for (let i = noteParticlesRef.current.length - 1; i >= 0; i--) {
        const p = noteParticlesRef.current[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= dt / p.maxLife

        if (p.life <= 0) {
          noteParticlesRef.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10
        ctx.font = `bold ${p.size}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.symbol, p.x, p.y)
        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop)
    }

    animationFrameRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [state.foundRhymeIds, state.combo, currentChallenge])

  // Canvas Click / PointerDown Detection
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)

      const rect = canvas.getBoundingClientRect()
      const clickX = (e.clientX - rect.left) * (800 / rect.width)
      const clickY = (e.clientY - rect.top) * (440 / rect.height)

      const padCount = currentChallenge.pads.length
      const padRadius = padCount <= 4 ? 54 : 46
      const spacingX = Math.min(130, (800 - 120) / padCount)
      const startX = (800 - (padCount - 1) * spacingX) / 2
      const padY = 220 - 10

      currentChallenge.pads.forEach((pad, idx) => {
        const cx = startX + idx * spacingX
        const cy = padY

        const dist = Math.hypot(clickX - cx, clickY - cy)
        if (dist <= padRadius + 8) {
          handlePadTap(pad, cx, cy)
        }
      })
    },
    [currentChallenge, handlePadTap]
  )

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Safe release
    }
  }, [])

  return (
    <div
      className="rhythm-spells-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <ActivityShell
        title="3D Rhythm Spells Conductor"
        tagline={story ? `Story Rhythm: ${story.title}` : currentChallenge.title}
        emoji="🎵"
        primaryDomain="phonics"
        difficulty={difficulty}
        variant="hero"
        onDifficultyChange={(newDiff) => {
          setDifficulty(newDiff)
          setChallengeIndex(0)
        }}
        progressInfo={`Harmonic Cadence #${challengeIndex + 1} (${state.foundRhymeIds.length}/${currentChallenge.targetRhymesCount} Rhymes Cast)`}
        headerRight={
          onBack ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                color: '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Exit Conductor
            </button>
          ) : null
        }
        className="rhythm-spells-activity"
      >
        <div
          className="rhythm-spells-workbench"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
            gap: '0.75rem',
            padding: '4px',
            color: '#f8fafc',
            userSelect: 'none',
          }}
        >
          {/* 1. Song & Rhyme Prompt Banner */}
          <section
            className="rhyme-prompt-banner"
            aria-label="Rhythm Spell Song Banner"
            style={{
              background: 'linear-gradient(135deg, rgba(4, 47, 46, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderRadius: '16px',
              border: '1.5px solid #2dd4bf',
              padding: '0.85rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  fontSize: '2.2rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '50%',
                  width: '54px',
                  height: '54px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #2dd4bf',
                  boxShadow: '0 0 16px rgba(45, 212, 191, 0.5)',
                }}
              >
                🎼
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#2dd4bf', fontWeight: 800, textTransform: 'uppercase' }}>
                  Target Word: <span style={{ color: '#fbbf24', fontSize: '1rem' }}>{currentChallenge.song.targetWord}</span> ({currentChallenge.song.rhymeFamily})
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  {currentChallenge.song.leadPrompt}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                padding: '0.45rem 0.9rem',
                borderRadius: '12px',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Tempo / Rhymes</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#2dd4bf', letterSpacing: '0.5px' }}>
                  {currentChallenge.tempoBpm} BPM • {state.foundRhymeIds.length}/{currentChallenge.targetRhymesCount} Cast
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(45, 212, 191, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.4)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  color: '#2dd4bf',
                  fontWeight: 800,
                }}
              >
                <span>🔊</span>
                <span>Active</span>
              </div>
            </div>
          </section>

          {/* First-Turn Animated Hand Tutorial Prompt */}
          {state.telemetry.tapsCount === 0 && (
            <div
              style={{
                alignSelf: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.25) 0%, rgba(251, 191, 36, 0.25) 100%)',
                border: '1.5px solid #2dd4bf',
                borderRadius: '9999px',
                padding: '5px 14px',
                color: '#fef08a',
                fontSize: '13px',
                fontWeight: 800,
                animation: 'bounceGentle 2s infinite',
              }}
            >
              <span style={{ fontSize: '18px' }}>👇</span>
              <span>Tap the glowing rune drum pads that rhyme with &quot;{currentChallenge.song.targetWord}&quot;!</span>
            </div>
          )}

          {/* 2. Interactive 3D Audio Spectrum Stage */}
          <section
            className="rhythm-canvas-stage"
            aria-label="3D Rhythm Spells Conductor Stage"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(45, 212, 191, 0.3)',
              padding: '0.75rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.6), 0 12px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Song Lyrics Display */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                marginBottom: '0.4rem',
                textAlign: 'center',
              }}
            >
              {currentChallenge.song.verseLines.slice(0, 2).map((line, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                  {line}
                </div>
              ))}
            </div>

            {/* 3D Audio Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={440}
              className="rhythm-spells-canvas"
              onPointerDown={handleCanvasPointerDown}
              onPointerUp={handleCanvasPointerUp}
              style={{
                touchAction: 'none',
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '12px',
              }}
            />
          </section>

          {/* 3. Science of Wonder Dossier */}
          {state.status === 'spell_cast' && (
            <div
              className="science-dossier-card card-panel"
              role="region"
              aria-label="Cognitive Science of Rhythm & Rhyme"
              style={{
                background: 'linear-gradient(135deg, #042f2e 0%, #0f172a 100%)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                border: '1.5px solid #2dd4bf',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(45, 212, 191, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🧠</span>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>
                  Phonemic Cadence: {currentChallenge.song.scientificConcept.conceptTitle}
                </h4>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {currentChallenge.song.scientificConcept.kidExplanation}
              </p>
              <div
                style={{
                  backgroundColor: 'rgba(45, 212, 191, 0.12)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.85rem',
                  color: '#fef08a',
                }}
              >
                <strong>💡 Fun Audio Fact:</strong> {currentChallenge.song.scientificConcept.funFact}
              </div>
            </div>
          )}
        </div>

        {/* Victory Celebration Modal */}
        <VictoryCelebrationModal
          isOpen={showCelebration}
          title={`Harmonic Spell Cast: ${currentChallenge.song.title}!`}
          subtitle={`Marvelous tempo & rhyme synchrony! The ${currentChallenge.song.rhymeFamily} melody harmonizes through the cosmos!`}
          badgeEmoji="🎼"
          xpEarned={state.telemetry.xp || 35}
          starsEarned={state.telemetry.stars || 8}
          nextLevelLabel="Next Rhythm Spell ➔"
          onNextLevel={handleNextSpell}
          onExit={onBack}
        />
      </ActivityShell>
    </div>
  )
}
