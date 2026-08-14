import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { StoryBook } from '../../types/storybook'

interface StoryBookViewerProps {
  storyBook: StoryBook
}

function estimateReadingTime(text: string): string {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return `${Math.max(1, Math.ceil(words / 140))} min read`
}

export const StoryBookViewer = memo(function StoryBookViewer({ storyBook }: StoryBookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Touch gesture coordinates
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const touchEndXRef = useRef<number | null>(null)
  const touchEndYRef = useRef<number | null>(null)

  const pages = storyBook.pages

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === pages.length - 1

  const previousPage = useCallback(() => {
    setCurrentPage((value) => Math.max(value - 1, 0))
  }, [])

  const nextPage = useCallback(() => {
    setCurrentPage((value) => Math.min(value + 1, pages.length - 1))
  }, [pages.length])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // Handle image loading states
  const currentIllustrationUrl = pages[currentPage]?.illustrationUrl
  useEffect(() => {
    if (pages.length > 0) {
      setIsImageLoading(Boolean(currentIllustrationUrl))
    }
  }, [pages.length, currentIllustrationUrl])

  // Prevent background scroll when in fullscreen reading mode
  useEffect(() => {
    if (isFullscreen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isFullscreen])

  // Keyboard navigation on desktop
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't capture when typing in inputs/textareas
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (!isFirstPage) {
          previousPage()
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (!isLastPage) {
          nextPage()
        }
      } else if (event.key === 'Escape' && isFullscreen) {
        event.preventDefault()
        setIsFullscreen(false)
      } else if (event.key.toLowerCase() === 'f' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFirstPage, isLastPage, isFullscreen, nextPage, previousPage, toggleFullscreen])

  // Touch Swipe Handlers
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    touchStartXRef.current = touch.clientX
    touchStartYRef.current = touch.clientY
    touchEndXRef.current = touch.clientX
    touchEndYRef.current = touch.clientY
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    touchEndXRef.current = touch.clientX
    touchEndYRef.current = touch.clientY
  }

  const handleTouchEnd = () => {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      touchEndXRef.current === null ||
      touchEndYRef.current === null
    ) {
      return
    }

    const deltaX = touchEndXRef.current - touchStartXRef.current
    const deltaY = touchEndYRef.current - touchStartYRef.current
    const minSwipeDistance = 50

    // Only recognize horizontal page swipe if horizontal movement significantly exceeds vertical
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < -minSwipeDistance) {
        // Swipe Left -> Next Page
        if (!isLastPage) {
          nextPage()
        }
      } else if (deltaX > minSwipeDistance) {
        // Swipe Right -> Previous Page
        if (!isFirstPage) {
          previousPage()
        }
      }
    }

    // Reset touch coordinates
    touchStartXRef.current = null
    touchStartYRef.current = null
    touchEndXRef.current = null
    touchEndYRef.current = null
  }

  if (!pages.length) {
    return (
      <section className="storybook-reader card-panel" aria-label="Storybook reader placeholder">
        <div className="storybook-reader__header">
          <p className="storybook-reader__eyebrow">Digital Storybook</p>
          <h2>{storyBook.title}</h2>
          <p>No pages are available yet.</p>
        </div>
      </section>
    )
  }

  const page = pages[currentPage]
  if (!page) return null

  const progress = ((currentPage + 1) / pages.length) * 100
  const progressPercent = Math.round(progress)
  const readingTime = estimateReadingTime(page.text)

  return (
    <section
      className={`storybook-reader card-panel ${isFullscreen ? 'storybook-reader--fullscreen' : ''}`}
      aria-label={`Storybook reader for ${storyBook.title}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="storybook-reader__header">
        <div className="storybook-reader__header-top">
          <p className="storybook-reader__eyebrow">Digital Storybook</p>
          <button
            type="button"
            className="button button-secondary storybook-reader__fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen reading' : 'Enter fullscreen reading'}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Reading (F)'}
          >
            {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
          </button>
        </div>
        <h2>📖 {storyBook.title}</h2>
        <p className="storybook-reader__subtitle">
          Swipe left/right or use controls to turn pages.
        </p>
      </div>

      <div className="storybook-reader__progress" aria-label="Reading progress">
        <div className="storybook-reader__progress-meta">
          <span className="storybook-reader__progress-label">Reading Progress</span>
          <span className="storybook-reader__progress-stats">
            Page {currentPage + 1} of {pages.length} • {progressPercent}%
          </span>
        </div>

        <div
          className="storybook-reader__progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
        >
          <div className="storybook-reader__progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="storybook-reader__progress-details">
          <span>⏱️ {readingTime}</span>
          <span>✨ {progressPercent}% complete</span>
        </div>
      </div>

      <div className="storybook-reader__book">
        <article className="storybook-reader__page" aria-live="polite">
          <div className="storybook-reader__page-top">
            <span className="storybook-reader__page-badge">Page {page.pageNumber}</span>
            <span className="storybook-reader__page-time">{readingTime}</span>
          </div>

          <div className={`storybook-reader__illustration ${isImageLoading ? 'is-loading' : ''}`}>
            {page.illustrationUrl ? (
              <>
                {isImageLoading ? (
                  <div className="storybook-reader__skeleton" aria-hidden="true" />
                ) : null}
                <img
                  src={page.illustrationUrl}
                  alt={`Illustration for page ${page.pageNumber}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              </>
            ) : (
              <div className="storybook-reader__placeholder">
                <span aria-hidden="true">🎨</span>
                <p>Illustration will appear here</p>
                {page.illustrationPrompt ? (
                  <small>{page.illustrationPrompt}</small>
                ) : (
                  <small>Beautiful artwork is ready for this page.</small>
                )}
              </div>
            )}
          </div>

          <div className="storybook-reader__text">
            <p>{page.text}</p>
          </div>
        </article>
      </div>

      <div className="storybook-reader__footer">
        <button
          type="button"
          className="button button-secondary storybook-reader__nav-button"
          onClick={previousPage}
          disabled={isFirstPage}
          aria-label="Go to previous page"
        >
          ← Previous
        </button>

        <div className="storybook-reader__footer-copy">
          <span className="storybook-reader__page-indicator">
            Page {currentPage + 1} of {pages.length}
          </span>
          <span className="storybook-reader__hint">
            Swipe or use arrow keys ← →
          </span>
        </div>

        <button
          type="button"
          className="button button-primary storybook-reader__nav-button"
          onClick={nextPage}
          disabled={isLastPage}
          aria-label="Go to next page"
        >
          Next →
        </button>
      </div>
    </section>
  )
})