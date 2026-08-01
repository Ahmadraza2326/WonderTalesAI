import { useEffect, useState } from 'react'
import type { StoryBook } from '../../types/storybook'

interface StoryBookViewerProps {
  storyBook: StoryBook
}

function estimateReadingTime(text: string) {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return `${Math.max(1, Math.ceil(words / 140))} min read`
}

export function StoryBookViewer({
  storyBook,
}: StoryBookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const pages = storyBook.pages

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
  const progress = ((currentPage + 1) / pages.length) * 100
  const progressPercent = Math.round(progress)
  const readingTime = estimateReadingTime(page.text)
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === pages.length - 1

  useEffect(() => {
    setIsImageLoading(Boolean(page.illustrationUrl))
  }, [currentPage, page.illustrationUrl])

  function previousPage() {
    setCurrentPage(value => Math.max(value - 1, 0))
  }

  function nextPage() {
    setCurrentPage(value => Math.min(value + 1, pages.length - 1))
  }

  return (
    <section className="storybook-reader card-panel" aria-label={`Storybook reader for ${storyBook.title}`}>
      <div className="storybook-reader__header">
        <p className="storybook-reader__eyebrow">Digital Storybook</p>
        <h2>📖 {storyBook.title}</h2>
        <p>A calm, premium reading experience crafted for little readers and grown-ups alike.</p>
      </div>

      <div className="storybook-reader__progress" aria-label="Reading progress">
        <div className="storybook-reader__progress-meta">
          <span className="storybook-reader__progress-label">Reading progress</span>
          <span className="storybook-reader__progress-stats">
            {currentPage + 1} / {pages.length} pages • {progressPercent}%
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
          <span>{readingTime}</span>
          <span>{progressPercent}% complete</span>
        </div>
      </div>

      <div className="storybook-reader__book">
        <div className="storybook-reader__page">
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
        </div>
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
          <span>Page {currentPage + 1} of {pages.length}</span>
          <span>Comfortable edges and soft motion</span>
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
}