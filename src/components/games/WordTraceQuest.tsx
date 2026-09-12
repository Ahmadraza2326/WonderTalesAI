import { memo, useState, useEffect, useCallback } from 'react'
import type { StoryRecord } from '../../types/story'
import type {
  WordTraceDifficulty,
  WordTraceGame,
  WordTraceCompletionResult,
} from '../../types/games/wordTrace'
import {
  generateWordTraceGame,
  calculateWordTraceScore,
} from '../../services/games/wordTrace'
import { useActivityEconomy } from '../../hooks/useActivityEconomy'
import { sfxService } from '../../services/audio/sfxService'
import { ActivityShell } from '../experience/ActivityShell'
import { RewardCelebration } from '../experience/RewardCelebration'

interface WordTraceQuestProps {
  story: StoryRecord
}

export const WordTraceQuest = memo(function WordTraceQuest({
  story,
}: WordTraceQuestProps) {
  const activeChildId = story.child_id || null
  const [difficulty, setDifficulty] = useState<WordTraceDifficulty>('easy')
  const [game, setGame] = useState<WordTraceGame>(() =>
    generateWordTraceGame(story, 'easy')
  )

  const { isCompleted, rewardStatus, completeActivity, resetActivity } =
    useActivityEconomy({
      childId: activeChildId,
      activityType: 'word_trace',
      activityId: story.id,
    })

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [placedTiles, setPlacedTiles] = useState<
    { tileId: string; letter: string }[]
  >([])
  const [mistakes, setMistakes] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [activeHintTier, setActiveHintTier] = useState<number>(0)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isWordSolved, setIsWordSolved] = useState(false)
  const [completionResult, setCompletionResult] =
    useState<WordTraceCompletionResult | null>(null)

  // Re-generate game when difficulty or story changes
  useEffect(() => {
    const newGame = generateWordTraceGame(story, difficulty)
    setGame(newGame)
    setCurrentWordIndex(0)
    setPlacedTiles([])
    setMistakes(0)
    setHintsUsed(0)
    setActiveHintTier(0)
    setStartTime(Date.now())
    setIsWordSolved(false)
    setCompletionResult(null)
    resetActivity()
  }, [story, difficulty, resetActivity])

  const currentChallenge = game.challenges[currentWordIndex]

  // Check if current placed tiles match the target word
  const handlePlaceLetter = useCallback(
    (tileId: string, letter: string) => {
      if (isWordSolved || isCompleted || !currentChallenge) return

      // Check if this letter is the next expected letter in the word
      const nextExpectedIndex = placedTiles.length
      const expectedLetter = currentChallenge.word[nextExpectedIndex]

      if (letter.toUpperCase() === expectedLetter) {
        sfxService.play('card_flip')
        const nextPlaced = [...placedTiles, { tileId, letter }]
        setPlacedTiles(nextPlaced)

        // Check if full word is completed
        if (nextPlaced.length === currentChallenge.word.length) {
          setIsWordSolved(true)
          sfxService.play('match_success')

          // Check if this was the final word in the quest
          if (currentWordIndex + 1 === game.totalWords) {
            const durationSeconds = Math.max(
              1,
              Math.round((Date.now() - startTime) / 1000)
            )
            const scoreData = calculateWordTraceScore({
              difficulty,
              wordsCount: game.totalWords,
              mistakes,
              hintsUsed,
              durationSeconds,
            })

            const finalResult: WordTraceCompletionResult = {
              storyId: story.id,
              childId: activeChildId,
              difficulty,
              wordsCompleted: game.totalWords,
              totalWords: game.totalWords,
              mistakes,
              hintsUsed,
              accuracy: scoreData.accuracy,
              durationSeconds,
              score: scoreData.score,
              xpEarned: scoreData.xpEarned,
              starsEarned: scoreData.starsEarned,
            }

            setCompletionResult(finalResult)

            // Trigger authoritative activity reward via unified Experience Layer hook
            completeActivity({
              xpAmount: scoreData.xpEarned,
              starsAmount: scoreData.starsEarned,
            })
          }
        }
      } else {
        // Mistake!
        sfxService.play('mistake_soft')
        setMistakes((prev) => prev + 1)
      }
    },
    [
      isWordSolved,
      isCompleted,
      currentChallenge,
      placedTiles,
      currentWordIndex,
      game.totalWords,
      difficulty,
      mistakes,
      hintsUsed,
      startTime,
      story.id,
      activeChildId,
      completeActivity,
    ]
  )

  const handleBackspace = useCallback(() => {
    if (isWordSolved || placedTiles.length === 0) return
    sfxService.play('card_flip')
    setPlacedTiles((prev) => prev.slice(0, -1))
  }, [isWordSolved, placedTiles.length])

  const handleResetWord = () => {
    if (isWordSolved) return
    sfxService.play('card_flip')
    setPlacedTiles([])
  }

  // Progressive Hint Handler: Cycles 1 -> 2 -> 3
  const handleHint = () => {
    if (isWordSolved || !currentChallenge) return
    sfxService.resumeContext().catch(() => {})
    sfxService.play('star_pop')
    setHintsUsed((prev) => prev + 1)
    setActiveHintTier((prev) => (prev < 3 ? prev + 1 : 1))
  }

  const handleNextWord = () => {
    if (currentWordIndex + 1 < game.totalWords) {
      sfxService.play('card_flip')
      setCurrentWordIndex((prev) => prev + 1)
      setPlacedTiles([])
      setActiveHintTier(0)
      setIsWordSolved(false)
    }
  }

  const handleRestart = () => {
    const newGame = generateWordTraceGame(story, difficulty)
    setGame(newGame)
    setCurrentWordIndex(0)
    setPlacedTiles([])
    setMistakes(0)
    setHintsUsed(0)
    setActiveHintTier(0)
    setStartTime(Date.now())
    setIsWordSolved(false)
    setCompletionResult(null)
    resetActivity()
  }

  // Keyboard shortcut listener for letter keys and backspace
  useEffect(() => {
    if (!currentChallenge || isWordSolved || isCompleted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        handleBackspace()
        return
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        const pressedUpper = e.key.toUpperCase()
        const availableTile = currentChallenge.scrambledLetters.find(
          (tile) =>
            tile.letter.toUpperCase() === pressedUpper &&
            !placedTiles.some((pt) => pt.tileId === tile.id)
        )
        if (availableTile) {
          handlePlaceLetter(availableTile.id, availableTile.letter)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    currentChallenge,
    isWordSolved,
    isCompleted,
    placedTiles,
    handlePlaceLetter,
    handleBackspace,
  ])

  const targetLetters = currentChallenge ? currentChallenge.word.split('') : []
  const placedTileIds = new Set(placedTiles.map((t) => t.tileId))

  // Find next target letter tile for Tier 3 hint highlight
  const nextTargetChar = currentChallenge && !isWordSolved && placedTiles.length < currentChallenge.word.length
    ? currentChallenge.word[placedTiles.length]
    : null

  return (
    <ActivityShell
      title="Word Trace & Vocabulary Quest"
      emoji="🔤"
      tagline="Spell the story vocabulary and master word meanings!"
      primaryDomain="vocabulary"
      secondaryDomains={['phonics']}
      difficulty={difficulty}
      onDifficultyChange={(d) => setDifficulty(d as WordTraceDifficulty)}
      supportsDifficulty={true}
      difficultyDisabled={isCompleted || placedTiles.length > 0}
      progressInfo={
        isCompleted
          ? 'Quest Completed'
          : `Word ${currentWordIndex + 1} of ${game.totalWords}`
      }
      isPlayable={game.isPlayable}
      unavailableReason={game.unavailableReason}
    >
      {isCompleted && completionResult ? (
        <RewardCelebration
          title="🌟 Quest Completed!"
          message={`You spelled all ${completionResult.totalWords} vocabulary words successfully!`}
          accuracy={completionResult.accuracy}
          rewardStatus={rewardStatus}
          statsSummary={[
            { label: 'Mistakes', value: completionResult.mistakes },
            { label: 'Hints Used', value: completionResult.hintsUsed },
            { label: 'Time', value: `${completionResult.durationSeconds}s` },
          ]}
          onPrimaryAction={handleRestart}
          primaryActionLabel="Play Again 🔄"
        />
      ) : currentChallenge ? (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {/* Metadata pill row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div className="flex items-center gap-2">
              {currentChallenge.partOfSpeech ? (
                <span
                  className="card-pill"
                  style={{
                    backgroundColor: 'rgba(104, 74, 255, 0.12)',
                    color: 'var(--brand-purple, #684aff)',
                    border: '1px solid rgba(104, 74, 255, 0.25)',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  {currentChallenge.partOfSpeech}
                </span>
              ) : null}
            </div>

            <span
              className="card-pill"
              style={{
                backgroundColor: 'rgba(0,0,0,0.04)',
                border: '1px solid var(--border, #e2e8f0)',
                margin: 0,
                fontWeight: 600,
              }}
            >
              {currentChallenge.letterCount} letters ({currentChallenge.vowelCount} vowels)
            </span>
          </div>

          {/* Meaning & Sentence Box (Leak-Free) */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              backgroundColor: 'var(--surface-alt, #f8fafc)',
              border: '1px solid var(--border, #e2e8f0)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <p
              style={{
                margin: '0 0 0.5rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-heading, #1e293b)',
              }}
            >
              💡 Meaning: {currentChallenge.meaning}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '0.95rem',
                color: 'var(--text-muted, #64748b)',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              "{isWordSolved ? currentChallenge.fullSentence : currentChallenge.clozeSentence}"
            </p>
          </div>

          {/* Progressive Hint Drawer */}
          {activeHintTier > 0 && !isWordSolved && currentChallenge.hints ? (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '0.85rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#b45309',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.75rem', display: 'block', marginBottom: '2px' }}>
                  Progressive Hint (Level {activeHintTier}/3)
                </span>
                {activeHintTier === 1 && <p style={{ margin: 0 }}>{currentChallenge.hints.phoneticClue}</p>}
                {activeHintTier === 2 && <p style={{ margin: 0 }}>{currentChallenge.hints.syllableClue}</p>}
                {activeHintTier >= 3 && <p style={{ margin: 0 }}>{currentChallenge.hints.firstLetterClue}</p>}
              </div>
            </div>
          ) : null}

          {/* Letter Slots */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              margin: '0.5rem 0 1rem',
              flexWrap: 'wrap',
            }}
            role="region"
            aria-label="Target spelling slots"
          >
            {targetLetters.map((_, idx) => {
              const placed = placedTiles[idx]
              return (
                <div
                  key={idx}
                  style={{
                    width: '3rem',
                    height: '3.5rem',
                    borderRadius: '0.75rem',
                    border: placed
                      ? isWordSolved
                        ? '2px solid #16a34a'
                        : '2px solid var(--accent, #684aff)'
                      : '2px dashed var(--border, #cbd5e1)',
                    backgroundColor: placed
                      ? isWordSolved
                        ? 'rgba(34, 197, 94, 0.14)'
                        : 'rgba(104, 74, 255, 0.1)'
                      : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: isWordSolved
                      ? '#15803d'
                      : 'var(--text-heading, #1e293b)',
                    transition: 'all 150ms ease',
                    boxShadow: placed ? '0 4px 12px rgba(104, 74, 255, 0.15)' : 'none',
                  }}
                >
                  {placed ? placed.letter : ''}
                </div>
              )
            })}
          </div>

          {/* Action Bar (Hint, Backspace, Reset) */}
          {!isWordSolved ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.65rem',
                marginBottom: '0.5rem',
              }}
            >
              <button
                type="button"
                className="button button-outline"
                onClick={handleHint}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: '44px', minWidth: '44px', fontWeight: 700 }}
                aria-label={`Progressive Hint: Current level ${activeHintTier} of 3`}
              >
                💡 Hint {activeHintTier > 0 ? `(${activeHintTier}/3)` : ''}
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={handleBackspace}
                disabled={placedTiles.length === 0}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: '44px', minWidth: '44px' }}
                aria-label="Backspace letter"
              >
                ⌫ Undo
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={handleResetWord}
                disabled={placedTiles.length === 0}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: '44px', minWidth: '44px' }}
                aria-label="Reset word"
              >
                🔄 Clear
              </button>
            </div>
          ) : null}

          {/* Scrambled Letter Tiles Bank */}
          {!isWordSolved ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.6rem',
                flexWrap: 'wrap',
                margin: '0.5rem 0',
              }}
              role="group"
              aria-label="Available letter tiles"
            >
              {currentChallenge.scrambledLetters.map((tile) => {
                const isPlaced = placedTileIds.has(tile.id)
                const isHintHighlighted = activeHintTier >= 3 && !isPlaced && tile.letter === nextTargetChar

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handlePlaceLetter(tile.id, tile.letter)}
                    disabled={isPlaced}
                    aria-label={`Letter ${tile.letter}`}
                    aria-disabled={isPlaced}
                    style={{
                      width: '3.25rem',
                      height: '3.5rem',
                      borderRadius: '0.75rem',
                      border: isPlaced
                        ? '1px solid transparent'
                        : isHintHighlighted
                        ? '2.5px solid #f59e0b'
                        : '1.5px solid var(--border, #e2e8f0)',
                      backgroundColor: isPlaced
                        ? 'rgba(0,0,0,0.04)'
                        : isHintHighlighted
                        ? 'rgba(254, 243, 199, 0.9)'
                        : 'var(--surface-alt, #f8fafc)',
                      color: isPlaced
                        ? 'transparent'
                        : 'var(--text-heading, #1e293b)',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      cursor: isPlaced ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition:
                        'transform 120ms ease, background-color 150ms ease, border-color 150ms ease',
                      boxShadow: isPlaced
                        ? 'none'
                        : isHintHighlighted
                        ? '0 0 16px rgba(245, 158, 11, 0.4)'
                        : '0 2px 8px rgba(0,0,0,0.08)',
                      transform: isHintHighlighted ? 'scale(1.05)' : 'none',
                    }}
                  >
                    {isPlaced ? '' : tile.letter}
                  </button>
                )
              })}
            </div>
          ) : (
            /* Word Solved Celebration Box */
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '1rem',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1.5px solid rgba(34, 197, 94, 0.5)',
                textAlign: 'center',
                margin: '0.5rem 0',
              }}
            >
              <p
                style={{
                  margin: '0 0 0.75rem',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: '#15803d',
                }}
              >
                ✨ Perfect! You mastered "{currentChallenge.word}"!
              </p>
              {currentWordIndex + 1 < game.totalWords ? (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleNextWord}
                  style={{ fontWeight: 700 }}
                >
                  Next Word ➔
                </button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </ActivityShell>
  )
})
