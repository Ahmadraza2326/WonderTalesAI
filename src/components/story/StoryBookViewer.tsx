import { useState } from 'react'
import type { StoryBook } from '../../types/storybook'

interface StoryBookViewerProps {
  storyBook: StoryBook
}

export function StoryBookViewer({
  storyBook,
}: StoryBookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const page = storyBook.pages[currentPage]

  const progress =
    ((currentPage + 1) / storyBook.pages.length) * 100

  function previousPage() {
    setCurrentPage(page =>
      Math.max(page - 1, 0)
    )
  }

  function nextPage() {
    setCurrentPage(page =>
      Math.min(
        page + 1,
        storyBook.pages.length - 1
      )
    )
  }

  return (
    <section className="card-panel">

      <h2
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        📖 {storyBook.title}
      </h2>

      <div
        style={{
          width: '100%',
          height: '10px',
          background: '#e5e7eb',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#6366f1',
            transition: 'width .3s ease',
          }}
        />
      </div>

      <p
        style={{
          textAlign: 'center',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        Page {page.pageNumber} of {storyBook.pages.length}
      </p>

      <div
  style={{
    marginBottom: '2rem',
    textAlign: 'center',
  }}
>
  {page.illustrationUrl ? (
    <img
      src={page.illustrationUrl}
      alt={`Illustration for page ${page.pageNumber}`}
      style={{
        width: '100%',
        maxWidth: '700px',
        borderRadius: '18px',
        boxShadow:
          '0 12px 30px rgba(0,0,0,.15)',
      }}
    />
  ) : (
    <div
      style={{
        height: '320px',
        borderRadius: '18px',
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '1rem',
      }}
    >
      🎨 Illustration coming soon...
    </div>
  )}
</div>

     <div
  style={{
    background: '#ffffff',
    color: '#1f2937',
    borderRadius: '18px',
    padding: '2rem',
    boxShadow:
      '0 10px 30px rgba(0,0,0,.08)',
    minHeight: '340px',
    fontSize: '1.1rem',
    lineHeight: 2,
    whiteSpace: 'pre-wrap',
  }}
>
        {page.text}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2rem',
        }}
      >
        <button
          className="button button-secondary"
          onClick={previousPage}
          disabled={currentPage === 0}
        >
          ← Previous
        </button>

        <button
          className="button button-primary"
          onClick={nextPage}
          disabled={
            currentPage ===
            storyBook.pages.length - 1
          }
        >
          Next →
        </button>
      </div>

    </section>
  )
}