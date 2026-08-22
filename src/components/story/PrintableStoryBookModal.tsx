/**
 * ORBIS Printable StoryBook Export Modal
 * Ink-conscious, printable keepsake book with title cover, narrative pages, illustrations, and family discussion reflection.
 */

import React, { useRef, useEffect } from 'react'
import type { StoryRecord } from '../../types/story'
import type { StoryBook } from '../../types/storybook'
import { paginateStory } from '../../services/storybookPagination'
import { resolveLocaleConfig, isRTLLocale } from '../../services/i18n/locales'
import { t } from '../../services/i18n/translations'

interface PrintableStoryBookModalProps {
  isOpen: boolean
  onClose: () => void
  story: StoryRecord | null
  storyBook?: StoryBook | null
}

export const PrintableStoryBookModal: React.FC<PrintableStoryBookModalProps> = ({
  isOpen,
  onClose,
  story,
  storyBook,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !story) return null

  const storyLanguage = story.language || 'English'
  const localeConfig = resolveLocaleConfig(storyLanguage)
  const isRTL = isRTLLocale(storyLanguage)

  // Resolve pages
  const resolvedPages =
    storyBook && storyBook.pages && storyBook.pages.length > 0
      ? storyBook.pages
      : paginateStory(story.title || 'ORBIS Story', story.learning_package?.story || story.story_content || '').pages

  const handlePrint = () => {
    window.print()
  }

  const discussionQuestions: string[] = story.learning_package?.parentGuide?.discussionQuestions || []

  return (
    <div
      className="printable-modal-backdrop no-print-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="printable-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div ref={modalRef} className="printable-modal-wrapper" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Floating Print Action Toolbar (Hidden during actual print) */}
        <div className="printable-modal-header no-print">
          <div className="printable-header-title">
            <span className="print-badge-icon" aria-hidden="true">🖨️</span>
            <h2 id="printable-modal-title" className="print-modal-heading">
              {t('print_storybook', localeConfig.code)}
            </h2>
          </div>

          <div className="printable-header-actions">
            <button
              type="button"
              className="button button-primary btn-print-trigger"
              onClick={handlePrint}
              aria-label="Print or Save PDF"
            >
              🖨️ {t('print_storybook', localeConfig.code)}
            </button>
            <button
              type="button"
              className="button button-ghost"
              onClick={onClose}
              aria-label={t('close', localeConfig.code)}
            >
              ✕ {t('close', localeConfig.code)}
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT CANVAS */}
        <article className="printable-storybook-document" data-print-rtl={isRTL ? 'true' : undefined}>
          {/* 1. COVER / TITLE PAGE */}
          <section className="print-page print-cover-page">
            <div className="print-cover-header">
              <span className="print-brand-tag">📖 {t('app_name', localeConfig.code)} STORYBOOK</span>
              <span className="print-brand-sub">DINARYX Family Storytelling</span>
            </div>

            <div className="print-cover-body">
              <h1 className="print-story-title">{story.title}</h1>
              {story.child_name && (
                <div className="print-hero-dedication">
                  <span>✨ Specially crafted for <strong>{story.child_name}</strong> (Age {story.child_age})</span>
                </div>
              )}

              <div className="print-meta-pills">
                {story.reading_level && (
                  <span className="print-pill">Level: {story.reading_level}</span>
                )}
                {story.theme && (
                  <span className="print-pill">Theme: {story.theme}</span>
                )}
                <span className="print-pill">{localeConfig.nativeName}</span>
              </div>
            </div>

            <div className="print-cover-footer">
              <p>{t('print_disclaimer', localeConfig.code)}</p>
            </div>
          </section>

          {/* 2. STORY NARRATIVE PAGES */}
          {resolvedPages.map((page, index) => (
            <section key={index} className="print-page print-narrative-page">
              <header className="print-page-header">
                <span className="print-header-story-name">{story.title}</span>
                <span className="print-header-page-num">
                  {t('page', localeConfig.code)} {index + 1} {t('of', localeConfig.code)} {resolvedPages.length}
                </span>
              </header>

              <div className="print-page-content">
                {page.illustrationUrl && (
                  <div className="print-illustration-frame">
                    <img
                      src={page.illustrationUrl}
                      alt={`Scene for page ${index + 1}`}
                      className="print-illustration-img"
                    />
                  </div>
                )}

                <p
                  className="print-narrative-text"
                  style={localeConfig.fontFamily ? { fontFamily: localeConfig.fontFamily } : undefined}
                >
                  {page.text}
                </p>
              </div>

              <footer className="print-page-footer">
                <span>ORBIS Digital Storybook</span>
                <span>— {index + 1} —</span>
              </footer>
            </section>
          ))}

          {/* 3. REFLECTION & FAMILY DISCUSSION BACKMATTER */}
          <section className="print-page print-backmatter-page">
            <header className="print-page-header">
              <span className="print-header-story-name">{story.title}</span>
              <span className="print-header-page-num">{t('parent_insights', localeConfig.code)}</span>
            </header>

            <div className="print-backmatter-content">
              {story.moral && (
                <div className="print-moral-card">
                  <h3>🌟 {t('moral_reflection', localeConfig.code)}</h3>
                  <p>{story.moral}</p>
                </div>
              )}

              {discussionQuestions.length > 0 && (
                <div className="print-discussion-section">
                  <h3>💬 {t('print_discussion_title', localeConfig.code)}</h3>
                  <ul className="print-discussion-list">
                    {discussionQuestions.map((q: string, qIdx: number) => (
                      <li key={qIdx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <footer className="print-page-footer">
              <span>{t('print_disclaimer', localeConfig.code)}</span>
              <span>The End ✨</span>
            </footer>
          </section>
        </article>
      </div>
    </div>
  )
}
