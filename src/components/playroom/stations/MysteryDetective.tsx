import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type {
  InvestigationToolType,
  Suspect,
  Hotspot,
} from '../../../types/games/mysteryDetective'
import {
  INVESTIGATION_TOOLS,
  CURATED_DETECTIVE_CASES,
  getInitialState,
  evaluateAction,
  calculateScore,
} from '../../../services/games/mysteryDetectiveEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { ActivityShell } from '../../experience/ActivityShell'
import { CelebrationParticles } from '../../experience/CelebrationParticles'

export interface MysteryDetectiveProps {
  story?: StoryRecord | null
  childId?: string | null
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

export const MysteryDetective: React.FC<MysteryDetectiveProps> = ({
  story,
  childId = null,
  onBack,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [caseIndex, setCaseIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [innocentAlibi, setInnocentAlibi] = useState<{ suspect: Suspect; text: string } | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [inspectedFeedbackId, setInspectedFeedbackId] = useState<string | null>(null)

  // Filter available curated cases by difficulty
  const availableCases = useMemo(() => {
    return CURATED_DETECTIVE_CASES.filter((c) => c.difficulty === difficulty)
  }, [difficulty])

  const currentCase = useMemo(() => {
    return availableCases[caseIndex % availableCases.length] || CURATED_DETECTIVE_CASES[0]
  }, [availableCases, caseIndex])

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
        dispatch({ type: 'SELECT_TOOL', tool: 'magnifying_glass' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === '2') {
        dispatch({ type: 'SELECT_TOOL', tool: 'uv_brush' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === '3') {
        dispatch({ type: 'SELECT_TOOL', tool: 'sound_horn' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === '4') {
        dispatch({ type: 'SELECT_TOOL', tool: 'decoder_lens' })
        sfxService.play('detective_lens_scan')
      } else if (e.key === ' ' && state.status === 'briefing') {
        e.preventDefault()
        dispatch({ type: 'START_INVESTIGATION' })
        sfxService.play('card_flip')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status])

  // Tool Selection
  const handleSelectTool = useCallback((tool: InvestigationToolType) => {
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
        sfxService.play('clue_found')
        dispatch({ type: 'INSPECT_HOTSPOT', hotspotId: hotspot.id })
        const clue = currentCase.clues.find((c) => c.id === hotspot.clueId)
        setFeedbackMessage(`🔍 Clue Discovered: "${clue?.textDescription || 'New evidence found!'}"`)
      } else {
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
      sfxService.play('suspect_eliminate')
      dispatch({ type: 'TOGGLE_ELIMINATE_SUSPECT', suspectId })
    },
    []
  )

  // Suspect Accusation
  const handleAccuse = useCallback(
    async (suspect: Suspect) => {
      if (suspect.id === currentCase.culpritId) {
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
    sfxService.play('card_flip')
  }, [])

  // Next / Replay Case
  const handleNextCase = useCallback(() => {
    setCaseIndex((prev) => (prev + 1) % availableCases.length)
    sfxService.play('card_flip')
  }, [availableCases.length])

  const handleReplayCase = useCallback(() => {
    dispatch({ type: 'RESET_CASE' })
    setShowCelebration(false)
    setInnocentAlibi(null)
    setFeedbackMessage(null)
    sfxService.play('card_flip')
  }, [])

  // Active Tool Metadata
  const activeToolMeta = INVESTIGATION_TOOLS[state.activeTool]
  const allCluesFound = state.discoveredClueIds.length >= currentCase.clues.length

  return (
    <ActivityShell
      title="Mystery Detective"
      emoji="🔍"
      tagline="Inspect crime scenes, gather forensic clues, and deduce the playful culprit!"
      primaryDomain="logic"
      secondaryDomains={['comprehension', 'vocabulary']}
      difficulty={difficulty}
      onDifficultyChange={handleDifficultyChange}
      supportsDifficulty={true}
      progressInfo={`Case ${caseIndex + 1} of ${availableCases.length}`}
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
      <div className="mystery-detective-root" style={{ display: 'grid', gap: '1.25rem' }}>
        {/* Screen Reader Live Announcements */}
        <div className="sr-only" role="status" aria-live="polite">
          {feedbackMessage ||
            `Active tool: ${activeToolMeta.name}. ${state.discoveredClueIds.length} of ${currentCase.clues.length} clues discovered.`}
        </div>

        {/* 1. Mystery Briefing Header Banner */}
        <section
          className="detective-case-header card-panel"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
            color: '#ffffff',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 8px 24px rgba(30, 27, 75, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
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
                  margin: '0.3rem 0',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {currentCase.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  maxWidth: '720px',
                  lineHeight: 1.4,
                }}
              >
                {currentCase.narrativeIntro}
              </p>
            </div>

            {/* Case Stats & Target Item */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                padding: '0.75rem 1.25rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem' }}>{currentCase.missingItemEmoji}</div>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>
                  {currentCase.missingItem}
                </div>
              </div>
              <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                  Clues Found
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  {state.discoveredClueIds.length} / {currentCase.clues.length}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Crime Scene Stage */}
        <section
          className="crime-scene-stage card-panel"
          style={{
            position: 'relative',
            minHeight: '380px',
            borderRadius: '1.25rem',
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
            border: '2px solid #334155',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
          }}
        >
          {/* Crime Scene Atmospheric Background Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.15,
              backgroundImage:
                'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #0f172a 1px)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px',
              pointerEvents: 'none',
            }}
          />

          {/* Active Forensic Cursor / Tool Indicator */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 1,
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                border: `1px solid ${activeToolMeta.accentColor}`,
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

            {feedbackMessage ? (
              <div
                style={{
                  backgroundColor: '#fef08a',
                  color: '#854d0e',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  animation: 'pulse 1.5s infinite',
                }}
              >
                {feedbackMessage}
              </div>
            ) : null}
          </div>

          {/* Crime Scene Hotspots Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              margin: '1rem 0',
            }}
          >
            {currentCase.hotspots.map((hotspot) => {
              const isDiscovered = state.discoveredClueIds.includes(hotspot.clueId)
              const clue = currentCase.clues.find((c) => c.id === hotspot.clueId)
              const isInspected = inspectedFeedbackId === hotspot.id

              // Position relative percentages
              const posX = (hotspot.x / 800) * 100
              const posY = (hotspot.y / 500) * 100

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => handleInspectHotspot(hotspot)}
                  aria-label={`Inspect ${hotspot.label}`}
                  style={{
                    position: 'absolute',
                    left: `${posX}%`,
                    top: `${posY}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: isDiscovered
                      ? 'rgba(16, 185, 129, 0.25)'
                      : isInspected
                        ? 'rgba(245, 158, 11, 0.4)'
                        : 'rgba(245, 158, 11, 0.2)',
                    border: `2px solid ${isDiscovered ? '#10b981' : isInspected ? '#f59e0b' : 'rgba(245, 158, 11, 0.7)'}`,
                    boxShadow: isDiscovered
                      ? '0 0 20px rgba(16, 185, 129, 0.5)'
                      : '0 0 15px rgba(245, 158, 11, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: 2,
                    minHeight: '44px',
                    minWidth: '44px',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>
                    {isDiscovered ? '✅' : clue?.icon || '🔍'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginTop: '2px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    {hotspot.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 3. Forensic Tool Belt */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              zIndex: 1,
            }}
          >
            {(Object.keys(INVESTIGATION_TOOLS) as InvestigationToolType[]).map((toolKey, idx) => {
              const tool = INVESTIGATION_TOOLS[toolKey]
              const isSelected = state.activeTool === toolKey

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleSelectTool(tool.id)}
                  aria-pressed={isSelected}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '1rem',
                    backgroundColor: isSelected ? tool.accentColor : 'rgba(30, 41, 59, 0.9)',
                    color: '#ffffff',
                    border: `2px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'}`,
                    boxShadow: isSelected
                      ? `0 0 16px ${tool.accentColor}`
                      : '0 4px 10px rgba(0,0,0,0.2)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    minHeight: '44px',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{tool.icon}</span>
                  <span>{tool.name}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '0.1rem 0.4rem',
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

        {/* 4. Evidence Pinboard & Suspect Lineup */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
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
              padding: '1.25rem',
              border: '4px solid #78350f',
              boxShadow: '0 8px 20px rgba(120, 53, 15, 0.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                borderBottom: '2px dashed #b45309',
                paddingBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>📌</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#78350f' }}>
                Evidence Pinboard ({state.discoveredClueIds.length} / {currentCase.clues.length})
              </h3>
            </div>

            {state.discoveredClueIds.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: '#92400e',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                }}
              >
                No clues discovered yet! Scan the crime scene hotspots above using your forensic
                tools to uncover evidence.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
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
                        padding: '0.85rem 1rem',
                        border: '1px solid #fde68a',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{clue.icon || '🔍'}</span>
                      <div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#b45309',
                            textTransform: 'uppercase',
                          }}
                        >
                          Clue #{idx + 1} • {toolMeta.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.92rem',
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

          {/* Right Column: Suspect Lineup */}
          <section
            className="suspect-lineup card-panel"
            style={{
              backgroundColor: 'var(--surface, #ffffff)',
              borderRadius: '1.25rem',
              padding: '1.25rem',
              border: '1px solid var(--border, rgba(108, 92, 231, 0.12))',
              boxShadow: 'var(--shadow-md, 0 8px 24px rgba(108, 92, 231, 0.06))',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🕵️</span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--text-heading, #1e1b4b)',
                  }}
                >
                  Suspect Lineup ({currentCase.suspectPool.length})
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: allCluesFound ? '#16a34a' : '#d97706',
                  backgroundColor: allCluesFound ? '#dcfce7' : '#fef3c7',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                }}
              >
                {allCluesFound ? '⭐ Ready to Deduce!' : 'Gather More Clues'}
              </span>
            </div>

            {/* Innocent Alibi Popup Banner */}
            {innocentAlibi ? (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '0.75rem',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>🛡️</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b' }}>
                    Alibi Confirmed for {innocentAlibi.suspect.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                    "{innocentAlibi.text}"
                  </div>
                </div>
              </div>
            ) : null}

            {/* Suspects Grid */}
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {currentCase.suspectPool.map((suspect) => {
                const isEliminated = state.eliminatedSuspectIds.includes(suspect.id)

                return (
                  <div
                    key={suspect.id}
                    style={{
                      borderRadius: '0.85rem',
                      padding: '0.85rem',
                      border: `2px solid ${isEliminated ? '#e2e8f0' : '#e0e7ff'}`,
                      backgroundColor: isEliminated ? '#f8fafc' : '#ffffff',
                      opacity: isEliminated ? 0.6 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    {/* Suspect Bio & Statement */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div
                        style={{
                          fontSize: '2rem',
                          backgroundColor: isEliminated ? '#cbd5e1' : '#e0e7ff',
                          borderRadius: '50%',
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {suspect.avatar}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '1rem',
                            color: isEliminated ? '#64748b' : '#1e1b4b',
                            textDecoration: isEliminated ? 'line-through' : 'none',
                          }}
                        >
                          {suspect.name}{' '}
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                            ({suspect.species})
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: '#64748b',
                            fontStyle: 'italic',
                            maxWidth: '280px',
                          }}
                        >
                          "{suspect.quote}"
                        </div>
                        {/* Suspect Traits Pills */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.35rem',
                            flexWrap: 'wrap',
                            marginTop: '0.35rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#f1f5f9',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                            }}
                          >
                            📏 {suspect.traits.height}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#f1f5f9',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                            }}
                          >
                            🎨 {suspect.traits.furOrFeathers}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#f1f5f9',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                            }}
                          >
                            🧣 {suspect.traits.accessory}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#f1f5f9',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                            }}
                          >
                            🐾 {suspect.traits.footprint}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Suspect Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleEliminate(suspect.id)}
                        aria-pressed={isEliminated}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '0.6rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: isEliminated ? '#e2e8f0' : '#fff1f2',
                          color: isEliminated ? '#475569' : '#be123c',
                          border: `1px solid ${isEliminated ? '#cbd5e1' : '#fecdd3'}`,
                          cursor: 'pointer',
                          minHeight: '44px',
                        }}
                      >
                        {isEliminated ? '↩️ Restore' : '❌ Rule Out'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAccuse(suspect)}
                        disabled={isEliminated}
                        style={{
                          padding: '0.45rem 0.95rem',
                          borderRadius: '0.6rem',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          backgroundColor: isEliminated ? '#f1f5f9' : '#4f46e5',
                          color: isEliminated ? '#94a3b8' : '#ffffff',
                          border: 'none',
                          cursor: isEliminated ? 'not-allowed' : 'pointer',
                          minHeight: '44px',
                          boxShadow: isEliminated ? 'none' : '0 2px 8px rgba(79, 70, 229, 0.3)',
                        }}
                      >
                        💡 Accuse!
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* 5. Case Solved Reward & Science Celebration Modal */}
        {showCelebration ? (
          <>
            <CelebrationParticles particleCount={40} />
            <div
              className="celebration-overlay"
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <div
                className="card-panel"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  maxWidth: '560px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  border: '3px solid #fbbf24',
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎉 🏆 🔍</div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                  Case Solved!
                </h2>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', marginTop: '0.35rem' }}>
                  Brilliant deduction, Detective! You gathered the evidence and found the playful
                  culprit!
                </p>

                {/* Culprit Confession Box */}
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '1rem',
                    padding: '1rem',
                    margin: '1.25rem 0',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#166534',
                      textTransform: 'uppercase',
                    }}
                  >
                    💬 Culprit Confession:
                  </div>
                  <div
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#14532d',
                      marginTop: '0.2rem',
                    }}
                  >
                    "{currentCase.suspectPool.find((s) => s.id === currentCase.culpritId)?.confessionQuote}"
                  </div>
                </div>

                {/* Science of Wonder Card */}
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '1rem',
                    padding: '1rem',
                    margin: '1rem 0',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>🔬 Science of Wonder:</span>
                    <span>{currentCase.scientificConcept.title}</span>
                  </div>
                  <p
                    style={{
                      margin: '0.35rem 0 0',
                      fontSize: '0.85rem',
                      color: '#1e3a8a',
                      lineHeight: 1.4,
                    }}
                  >
                    {currentCase.scientificConcept.description}
                  </p>
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#3b82f6',
                      fontWeight: 600,
                    }}
                  >
                    ✨ <strong>Fun Fact:</strong> {currentCase.scientificConcept.funFact}
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    marginTop: '1.5rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleReplayCase}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '0.75rem',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    🔄 Replay Case
                  </button>

                  <button
                    type="button"
                    onClick={handleNextCase}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    ⭐ Next Mystery Case ➔
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </ActivityShell>
  )
}
