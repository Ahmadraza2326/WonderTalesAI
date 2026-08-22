import type { StoryBook } from '../types/storybook'

/**
 * Splits text into multilingual sentences using standard delimiters across
 * Western (. ! ?), Urdu (۔ ؟), Arabic (؟ . !), CJK (。 ！ ？), Indic (। ? !), and newlines.
 */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?؟۔。！？।])\s+|(?<=[。！？।])\s*|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

/**
 * Multilingual, sentence-aware story pagination.
 * Produces balanced multi-page layouts regardless of whether the input text
 * is formatted into clean paragraphs or provided as a single wall of text.
 */
export function paginateStory(
  title: string,
  story: string,
  storyLength?: 'short' | 'medium' | 'long'
): StoryBook {
  const cleanStory = (story || '').trim()
  if (!cleanStory) {
    return {
      title,
      pages: [],
    }
  }

  // 1. Determine target page count
  let targetPages = 4 // default
  if (storyLength === 'short') targetPages = 4
  else if (storyLength === 'medium') targetPages = 6
  else if (storyLength === 'long') targetPages = 8

  // 2. Check if clean paragraph structure already exists
  const rawParagraphs = cleanStory
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const totalChars = cleanStory.length
  let maxCharacters = Math.ceil((totalChars * 1.1) / targetPages)
  maxCharacters = Math.max(150, Math.min(maxCharacters, 900))

  // If we already have multiple paragraphs (>= targetPages - 1) and none are huge (> maxCharacters * 1.5):
  if (
    rawParagraphs.length >= Math.max(2, targetPages - 1) &&
    rawParagraphs.every((p) => p.length <= maxCharacters * 1.5)
  ) {
    const pages: StoryBook['pages'] = []
    let currentText = ''

    for (const paragraph of rawParagraphs) {
      if (currentText.trim() && currentText.length + paragraph.length > maxCharacters) {
        pages.push({
          pageNumber: pages.length + 1,
          text: currentText.trim(),
        })
        currentText = ''
      }
      currentText += (currentText ? '\n\n' : '') + paragraph
    }

    if (currentText.trim()) {
      pages.push({
        pageNumber: pages.length + 1,
        text: currentText.trim(),
      })
    }

    if (pages.length >= 2) {
      return { title, pages }
    }
  }

  // 3. Sentence-level balanced distribution (handles single paragraphs & uneven text)
  const sentences = splitIntoSentences(cleanStory)

  // Very short story (< 120 chars or <= 1 sentence) -> 1 page
  if (sentences.length <= 1 || cleanStory.length < 120) {
    return {
      title,
      pages: [
        {
          pageNumber: 1,
          text: cleanStory,
        },
      ],
    }
  }

  // Bound effective page count between 2 and targetPages, not exceeding sentence count
  const effectivePageCount = Math.min(targetPages, Math.max(2, sentences.length))

  const baseCount = Math.floor(sentences.length / effectivePageCount)
  const remainder = sentences.length % effectivePageCount

  const pages: StoryBook['pages'] = []
  let sentenceOffset = 0

  for (let i = 0; i < effectivePageCount; i++) {
    const countForThisPage = baseCount + (i < remainder ? 1 : 0)
    if (countForThisPage <= 0) continue

    const pageSentences = sentences.slice(sentenceOffset, sentenceOffset + countForThisPage)
    sentenceOffset += countForThisPage

    const pageText = pageSentences.join(' ')
    if (pageText.trim()) {
      pages.push({
        pageNumber: pages.length + 1,
        text: pageText.trim(),
      })
    }
  }

  // Preserve any remaining sentences
  if (sentenceOffset < sentences.length) {
    const remainingText = sentences.slice(sentenceOffset).join(' ')
    if (pages.length > 0) {
      pages[pages.length - 1].text += ' ' + remainingText.trim()
    } else {
      pages.push({
        pageNumber: 1,
        text: remainingText.trim(),
      })
    }
  }

  return {
    title,
    pages,
  }
}