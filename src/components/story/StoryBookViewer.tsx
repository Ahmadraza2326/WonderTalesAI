import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { StoryBook, StoryPage } from '../../types/storybook'
import type { StoryRecord } from '../../types/story'
import type { StoryNarration } from '../../types/narration'
import type { TranslatedStoryContent } from '../../types/translation'
import { paginateStory } from '../../services/storybookPagination'
import { readAlongSpeechService } from '../../services/audio/readAlongSpeechService'
import { audioController } from '../../services/audio/audioController'
import { storyAssetCacheService } from '../../services/storyAssetCacheService'
import { storyTranslationService } from '../../services/storyTranslationService'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../context/I18nContext'
import {
  SUPPORTED_LOCALES,
  resolveLocaleConfig,
  isRTLLocale,
} from '../../services/i18n/locales'
import { learningProgressService } from '../../services/learningProgressService'
import { generateStoryNarration } from '../../services/ai/narrationGenerationService'
import { PrintableStoryBookModal } from './PrintableStoryBookModal'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface StoryBookViewerProps {
  storyBook?: StoryBook | null
  story?: StoryRecord | null
  narration?: StoryNarration | null
  onExploreLearning?: () => void
}

type ReadingMode = 'focus' | 'spread'
type FontSize = 'sm' | 'md' | 'lg'
type NarrationVoiceState = 'ready' | 'loading' | 'speaking' | 'paused' | 'completed' | 'error' | 'unavailable'

export const StoryBookViewer = memo(function StoryBookViewer({
  storyBook,
  story,
  narration: narrationProp,
  onExploreLearning,
}: StoryBookViewerProps) {
  const { user } = useAuth()
  const { t } = useI18n()
  const { preferences, updatePreferences } = useUserPreferences()

  // 1. Translation States (Story Language Independent of UI Locale)
  const [activeTranslation, setActiveTranslation] = useState<TranslatedStoryContent | null>(null)
  const [availableTranslations, setAvailableTranslations] = useState<Record<string, TranslatedStoryContent>>({})
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [translationError, setTranslationError] = useState<string | null>(null)

  const originalLocaleConfig = useMemo(() => {
    return resolveLocaleConfig(story?.language || (storyBook as unknown as { language?: string })?.language || 'English')
  }, [story?.language, storyBook])

  // Load existing translations on mount / story change
  useEffect(() => {
    let isMounted = true
    if (!story?.id || !user?.id) return

    storyTranslationService.getAllStoryTranslations(story.id, user.id).then((translations) => {
      if (isMounted) {
        setAvailableTranslations(translations)
      }
    })

    return () => {
      isMounted = false
    }
  }, [story?.id, user?.id])

  // 2. Resolve Active Story Language, Direction, Title, and Narrative
  const activeStoryLanguage = useMemo(() => {
    return activeTranslation?.target_locale || originalLocaleConfig.bcp47
  }, [activeTranslation, originalLocaleConfig])

  const activeLocaleConfig = useMemo(() => {
    return resolveLocaleConfig(activeStoryLanguage)
  }, [activeStoryLanguage])

  const activeIsRTL = useMemo(() => {
    return isRTLLocale(activeStoryLanguage)
  }, [activeStoryLanguage])

  const resolvedTitle = useMemo(() => {
    return activeTranslation?.title || story?.title || storyBook?.title || 'ORBIS Story'
  }, [activeTranslation?.title, story?.title, storyBook?.title])

  const resolvedNarrative = useMemo(() => {
    let narrative = activeTranslation?.story_content ||
      story?.learning_package?.story ||
      story?.story_content ||
      ''
      
    if (!narrative.trim()) {
      if (activeTranslation?.pages?.length) {
        narrative = activeTranslation.pages.map(p => p.text).join('\n\n')
      } else if (storyBook?.pages?.length) {
        narrative = storyBook.pages.map(p => p.text).join('\n\n')
      }
    }
    return narrative
  }, [activeTranslation, story, storyBook])

  // 3. Resolve story pages: Use pre-cached StoryBook for original, or dynamically paginate
  const resolvedPages = useMemo<StoryPage[]>(() => {
    // If we have a cached storyBook without an active translation:
    if (!activeTranslation && storyBook && Array.isArray(storyBook.pages) && storyBook.pages.length > 0) {
      // Check if storyBook pages have valid non-empty text
      const validTextPages = storyBook.pages.filter(
        (p) => p && typeof p.text === 'string' && p.text.trim().length > 0
      )

      // If all pages have valid text AND it is already multi-page:
      if (validTextPages.length === storyBook.pages.length && validTextPages.length > 1) {
        return storyBook.pages
      }

      // If some pages have text but others are empty (e.g. image-only cover page with pageNumber: 1 and text: ''),
      // re-paginate cleanly from the narrative while preserving existing illustrations
      if (validTextPages.length > 0) {
        const illustrationUrls = storyBook.pages.map((p) => p.illustrationUrl).filter(Boolean) as string[]
        const illustrationPrompts = storyBook.pages.map((p) => p.illustrationPrompt).filter(Boolean) as string[]

        const dynamicBook = paginateStory(resolvedTitle, resolvedNarrative, story?.story_length as 'short' | 'medium' | 'long' | undefined)
        const dynamicPages = dynamicBook.pages.length > 0 ? dynamicBook.pages : validTextPages

        return dynamicPages.map((dp, idx) => ({
          ...dp,
          pageNumber: idx + 1,
          illustrationUrl:
            dp.illustrationUrl ||
            illustrationUrls[idx] ||
            null,
          illustrationPrompt:
            dp.illustrationPrompt ||
            illustrationPrompts[idx] ||
            null,
          narrationUrl: dp.narrationUrl || storyBook.pages[idx]?.narrationUrl || null,
        }))
      }
    }

    // Dynamic pagination from resolved narrative
    const paginated = paginateStory(resolvedTitle, resolvedNarrative, story?.story_length as 'short' | 'medium' | 'long' | undefined)
    if (paginated.pages.length === 0 && resolvedNarrative.trim()) {
      return [
        {
          pageNumber: 1,
          text: resolvedNarrative.trim(),
          illustrationUrl: null,
          illustrationPrompt: null,
          narrationUrl: null,
        },
      ]
    }

    // Attach illustrations from story record if available
    const lpIllustrations = story?.learning_package?.illustrations
    return paginated.pages.map((page, idx) => {
      let illUrl = page.illustrationUrl || null
      let illPrompt = page.illustrationPrompt || null

      if (!illUrl && Array.isArray(lpIllustrations)) {
        const match = lpIllustrations.find((ill) => {
          const illObj = ill as unknown as { scene?: number; imageUrl?: string; image_url?: string; url?: string }
          return illObj.scene === idx + 1
        }) as unknown as { imageUrl?: string; image_url?: string; url?: string; prompt?: string } | undefined

        const url = match?.imageUrl || match?.image_url || match?.url
        if (url && (url.startsWith('http') || url.startsWith('data:'))) {
          illUrl = url
        }
        if (match?.prompt) {
          illPrompt = match.prompt
        }
      }

      return {
        ...page,
        pageNumber: idx + 1,
        illustrationUrl: illUrl,
        illustrationPrompt: illPrompt,
      }
    })
  }, [
    activeTranslation,
    storyBook,
    resolvedTitle,
    resolvedNarrative,
    story?.learning_package?.illustrations,
    story?.story_length,
  ])

  const pages: StoryPage[] = resolvedPages

  // Reader States
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [readingMode, setReadingMode] = useState<ReadingMode>('spread')
  const [fontSize, setFontSize] = useState<FontSize>('md')
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false)
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState<boolean>(false)
  const optionsMenuRef = useRef<HTMLDivElement>(null)

  // Synchronized Sentence Narration & Autoplay States
  const [isNarrating, setIsNarrating] = useState<boolean>(false)
  const [isNarratingPaused, setIsNarratingPaused] = useState<boolean>(false)
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null)
  const [narrationSpeed, setNarrationSpeed] = useState<number>(() => preferences.narrationSpeed || 1.0)
  const [voiceState, setVoiceState] = useState<NarrationVoiceState>('ready')
  const hasListenedAudioRef = useRef<boolean>(false)

  // Touch swipe refs
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const touchEndXRef = useRef<number | null>(null)
  const touchEndYRef = useRef<number | null>(null)

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage >= pages.length - 1
  const currentPageData = pages[currentPage]

  // Track story completion and record gentle progress
  useEffect(() => {
    if (!user?.id || !story?.id || pages.length === 0) return

    const isComplete = currentPage === pages.length - 1

    learningProgressService.recordReadingProgress({
      userId: user.id,
      storyId: story.id,
      pagesRead: currentPage + 1,
      totalPages: pages.length,
      readingTimeSeconds: 45,
      isCompleted: isComplete,
      listenedAudio: hasListenedAudioRef.current,
    })
  }, [currentPage, pages.length, story?.id, user?.id])

  // Split current page text into sentences for synchronized read-along
  const pageSentences = useMemo(() => {
    const rawText = currentPageData?.text?.trim()
    if (!rawText) {
      if (pages.length === 1 && resolvedNarrative.trim()) {
        return readAlongSpeechService.prepareText(resolvedNarrative.trim())
      }
      return []
    }
    return readAlongSpeechService.prepareText(rawText)
  }, [currentPageData?.text, pages.length, resolvedNarrative])

  // Cleanly stop narration
  const [, setCachedNarration] = useState<StoryNarration | null>(null)
  const cachedNarrationRef = useRef<StoryNarration | null>(null)
  const isUsingRealAudioRef = useRef<boolean>(false)

  // Load cached narration with fresh signed audio URLs for current language
  useEffect(() => {
    let isMounted = true
    if (!story?.id || !user?.id) return

    storyAssetCacheService
      .getNarration(
        story,
        user.id,
        activeLocaleConfig.bcp47,
        resolvedNarrative,
        resolvedTitle
      )
      .then((narration) => {
        if (isMounted) {
          setCachedNarration(narration)
          cachedNarrationRef.current = narration
        }
      })
      .catch((err) => {
        console.warn('[StoryBookViewer] Failed to load cached narration:', err)
      })

    return () => {
      isMounted = false
    }
  }, [story, user?.id, activeLocaleConfig.bcp47, resolvedNarrative, resolvedTitle])

  // Cleanly stop narration
  const stopNarration = useCallback(() => {
    audioController.stop()
    readAlongSpeechService.stop()
    isUsingRealAudioRef.current = false
    setIsNarrating(false)
    setIsNarratingPaused(false)
    setActiveSentenceIndex(null)
    setVoiceState('ready')
  }, [])

  const previousPage = useCallback(() => {
    stopNarration()
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }, [stopNarration])

  const nextPage = useCallback(() => {
    stopNarration()
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))
  }, [pages.length, stopNarration])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const toggleBedtimeMode = useCallback(() => {
    const next = !preferences.bedtimeMode
    updatePreferences({ bedtimeMode: next })
  }, [preferences.bedtimeMode, updatePreferences])

  // Handle Story Language / Translation Switching
  const handleSelectStoryLanguage = async (targetBcp47: string) => {
    if (!story || !user) return
    setTranslationError(null)

    const targetConfig = resolveLocaleConfig(targetBcp47)

    // 1. If selecting original story language -> switch to canonical original
    if (targetConfig.code === originalLocaleConfig.code || targetConfig.bcp47 === originalLocaleConfig.bcp47) {
      stopNarration()
      setActiveTranslation(null)
      setCurrentPage(0)
      return
    }

    // 2. If translation already in cache -> instant switch (0 cost, 0 quota)
    if (availableTranslations[targetConfig.bcp47]) {
      stopNarration()
      setActiveTranslation(availableTranslations[targetConfig.bcp47])
      setCurrentPage(0)
      return
    }

    // 3. Generate translation via secure server boundary
    setIsTranslating(true)
    stopNarration()

    try {
      const translation = await storyTranslationService.translateStory(
        story,
        targetConfig.bcp47,
        user.id
      )

      setAvailableTranslations((prev) => ({
        ...prev,
        [targetConfig.bcp47]: translation,
      }))
      setActiveTranslation(translation)
      setCurrentPage(0)
    } catch (err) {
      console.error('[StoryBookViewer] Translation error:', err)
      setTranslationError(
        err instanceof Error ? err.message : 'Unable to translate story at this time. Please try again.'
      )
    } finally {
      setIsTranslating(false)
    }
  }

  // Synchronize narration prop from parent workspace when available
  useEffect(() => {
    if (narrationProp) {
      setCachedNarration(narrationProp)
      cachedNarrationRef.current = narrationProp
    }
  }, [narrationProp])

  const [isGeneratingNarrationAudio, setIsGeneratingNarrationAudio] = useState<boolean>(false)

  // Play a specific sentence (HTML5 Audio primary, SpeechSynthesis fallback)
  const playSentenceTrack = useCallback(
    async (sentenceIdx: number, autoplay = true) => {
      if (!pageSentences[sentenceIdx]) return

      hasListenedAudioRef.current = true
      setActiveSentenceIndex(sentenceIdx)

      const currentSentenceText = pageSentences[sentenceIdx].trim()

      // Calculate global sentence index across previous pages
      let globalSentenceOffset = 0
      for (let p = 0; p < currentPage; p++) {
        const pText = pages[p]?.text?.trim()
        if (pText) {
          globalSentenceOffset += readAlongSpeechService.prepareText(pText).length
        }
      }
      const globalIdx = globalSentenceOffset + sentenceIdx

      // 1. Check if current cached narration has a matching segment with real audioUrl
      let narrationToUse = cachedNarrationRef.current
      let matchingSegment = narrationToUse?.segments?.find(
        (seg) => seg.text.replace(/\s+/g, ' ').trim() === currentSentenceText.replace(/\s+/g, ' ').trim()
      ) || narrationToUse?.segments?.[globalIdx] || narrationToUse?.segments?.[sentenceIdx]

      // 2. If audioUrl is missing, attempt on-demand server generation via Edge Function
      if ((!matchingSegment?.audioUrl || !narrationToUse) && story && user && !isGeneratingNarrationAudio) {
        setIsGeneratingNarrationAudio(true)
        setVoiceState('loading')
        setIsNarrating(true)
        setIsNarratingPaused(false)

        try {
          const generatedNarration = await generateStoryNarration(
            story,
            activeStoryLanguage,
            resolvedNarrative,
            resolvedTitle
          )

          await storyAssetCacheService.saveNarration(
            story,
            user.id,
            generatedNarration,
            activeStoryLanguage,
            resolvedNarrative,
            resolvedTitle
          )

          setCachedNarration(generatedNarration)
          cachedNarrationRef.current = generatedNarration
          narrationToUse = generatedNarration

          matchingSegment = generatedNarration.segments?.find(
            (seg) => seg.text.replace(/\s+/g, ' ').trim() === currentSentenceText.replace(/\s+/g, ' ').trim()
          ) || generatedNarration.segments?.[globalIdx] || generatedNarration.segments?.[sentenceIdx]
        } catch (err: any) {
          console.warn('[StoryBookViewer] On-demand server narration generation failed:', err.message)
        } finally {
          setIsGeneratingNarrationAudio(false)
        }
      }

      if (matchingSegment?.audioUrl) {
        // --- PRIMARY: Real Stored HTML5 Audio Stream ---
        setVoiceState('speaking')
        isUsingRealAudioRef.current = true
        audioController.setPlaybackRate(narrationSpeed)
        audioController.setOptions({
          onEnded: () => {
            if (autoplay && sentenceIdx + 1 < pageSentences.length) {
              void playSentenceTrack(sentenceIdx + 1, true)
            } else {
              setIsNarrating(false)
              setIsNarratingPaused(false)
              setActiveSentenceIndex(null)
              setVoiceState('completed')
            }
          },
          onError: (err) => {
            console.warn('[StoryBookViewer] HTML5 Audio error, checking speech synthesis fallback:', err.message)
            isUsingRealAudioRef.current = false
            // Fallback to SpeechSynthesis only if native voice exists or English (NEVER for Urdu)
            const hasVoice = activeLocaleConfig.code !== 'ur' && (Boolean(readAlongSpeechService.findBestVoice(activeLocaleConfig.bcp47)) || activeLocaleConfig.code === 'en')
            if (hasVoice) {
              readAlongSpeechService.speakSequence(pageSentences, sentenceIdx, autoplay, {
                language: activeLocaleConfig.bcp47,
                rate: narrationSpeed,
                onStart: () => {
                  setIsNarrating(true)
                  setIsNarratingPaused(false)
                  setVoiceState('speaking')
                },
                onSentenceChange: (idx) => setActiveSentenceIndex(idx),
                onEnd: () => {
                  setIsNarrating(false)
                  setIsNarratingPaused(false)
                  setActiveSentenceIndex(null)
                  setVoiceState('completed')
                },
                onError: () => {
                  setIsNarrating(false)
                  setIsNarratingPaused(false)
                  setActiveSentenceIndex(null)
                  setVoiceState('error')
                },
              })
            } else {
              setIsNarrating(false)
              setIsNarratingPaused(false)
              setActiveSentenceIndex(null)
              setVoiceState('error')
            }
          },
        })

        setIsNarrating(true)
        setIsNarratingPaused(false)
        await audioController.playSegment(
          { audioUrl: matchingSegment.audioUrl, text: matchingSegment.text },
          activeLocaleConfig.bcp47
        )
        return
      }

      // --- FALLBACK: Browser SpeechSynthesis (only if native voice exists or English, NEVER for Urdu) ---
      isUsingRealAudioRef.current = false
      const hasVoice = activeLocaleConfig.code !== 'ur' && (Boolean(readAlongSpeechService.findBestVoice(activeLocaleConfig.bcp47)) || activeLocaleConfig.code === 'en')
      if (!hasVoice) {
        setIsNarrating(false)
        setIsNarratingPaused(false)
        setActiveSentenceIndex(null)
        setVoiceState('error')
        return
      }

      setVoiceState('speaking')
      const success = readAlongSpeechService.speakSequence(pageSentences, sentenceIdx, autoplay, {
        language: activeLocaleConfig.bcp47,
        rate: narrationSpeed,
        onStart: () => {
          setIsNarrating(true)
          setIsNarratingPaused(false)
          setVoiceState('speaking')
        },
        onSentenceChange: (idx) => {
          setActiveSentenceIndex(idx)
        },
        onEnd: () => {
          setIsNarrating(false)
          setIsNarratingPaused(false)
          setActiveSentenceIndex(null)
          setVoiceState('completed')
        },
        onError: () => {
          setIsNarrating(false)
          setIsNarratingPaused(false)
          setActiveSentenceIndex(null)
          setVoiceState('error')
        },
      })

      if (!success) {
        setVoiceState('unavailable')
      }
    },
    [
      pageSentences,
      narrationSpeed,
      activeLocaleConfig.bcp47,
      activeLocaleConfig.code,
      currentPage,
      pages,
      story,
      user,
      activeStoryLanguage,
      resolvedNarrative,
      resolvedTitle,
      isGeneratingNarrationAudio,
    ]
  )

  // Handle Synchronized Narration Play/Pause/Autoplay (Uses active story language BCP-47)
  const handleToggleNarration = useCallback(() => {
    if (!pageSentences.length) return

    if (isNarrating) {
      if (isNarratingPaused) {
        if (isUsingRealAudioRef.current) {
          audioController.resume()
        } else {
          readAlongSpeechService.resume()
        }
        setIsNarratingPaused(false)
        setVoiceState('speaking')
      } else {
        if (isUsingRealAudioRef.current) {
          audioController.pause()
        } else {
          readAlongSpeechService.pause()
        }
        setIsNarratingPaused(true)
        setVoiceState('paused')
      }
      return
    }

    const startIndex = activeSentenceIndex !== null ? activeSentenceIndex : 0
    playSentenceTrack(startIndex, true)
  }, [pageSentences.length, isNarrating, isNarratingPaused, activeSentenceIndex, playSentenceTrack])

  // Tap a specific sentence to narrate from that sentence and continue autoplay
  const handleSentenceClick = useCallback(
    (sentenceIdx: number) => {
      playSentenceTrack(sentenceIdx, true)
    },
    [playSentenceTrack]
  )

  // Navigate to Next Sentence
  const handleNextSentence = useCallback(() => {
    if (!pageSentences.length) return
    const currentIdx = activeSentenceIndex ?? 0
    const nextIdx = Math.min(currentIdx + 1, pageSentences.length - 1)
    handleSentenceClick(nextIdx)
  }, [pageSentences.length, activeSentenceIndex, handleSentenceClick])

  // Navigate to Previous Sentence
  const handlePrevSentence = useCallback(() => {
    if (!pageSentences.length) return
    const currentIdx = activeSentenceIndex ?? 0
    const prevIdx = Math.max(currentIdx - 1, 0)
    handleSentenceClick(prevIdx)
  }, [pageSentences.length, activeSentenceIndex, handleSentenceClick])

  const handleSpeedChange = (speed: number) => {
    setNarrationSpeed(speed)
    updatePreferences({ narrationSpeed: speed })
    if (isNarrating) {
      stopNarration()
    }
  }

  // Cleanup narration on unmount
  useEffect(() => {
    return () => {
      readAlongSpeechService.stop()
    }
  }, [])

  // Fullscreen body overflow lock
  useEffect(() => {
    if (isFullscreen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isFullscreen])

  // Keyboard navigation (RTL-aware arrow keys)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (activeIsRTL) {
          if (!isLastPage) nextPage()
        } else {
          if (!isFirstPage) previousPage()
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (activeIsRTL) {
          if (!isFirstPage) previousPage()
        } else {
          if (!isLastPage) nextPage()
        }
      } else if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault()
        handleToggleNarration()
      } else if (event.key.toLowerCase() === 'f' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        toggleFullscreen()
      } else if (event.key === 'Escape' && isFullscreen) {
        event.preventDefault()
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFirstPage, isLastPage, isFullscreen, activeIsRTL, nextPage, previousPage, toggleFullscreen, handleToggleNarration])

  // Click outside listener to close options popover
  useEffect(() => {
    if (!isOptionsMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setIsOptionsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOptionsMenuOpen])

  // Touch Swipe Handlers (RTL-aware)
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
    const minDistance = 45

    if (Math.abs(deltaX) > minDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (activeIsRTL) {
        if (deltaX > minDistance && !isLastPage) {
          nextPage()
        } else if (deltaX < -minDistance && !isFirstPage) {
          previousPage()
        }
      } else {
        if (deltaX < -minDistance && !isLastPage) {
          nextPage()
        } else if (deltaX > minDistance && !isFirstPage) {
          previousPage()
        }
      }
    }

    touchStartXRef.current = null
    touchStartYRef.current = null
    touchEndXRef.current = null
    touchEndYRef.current = null
  }

  // Resolve illustration for current page:
  // 1. Current page illustrationUrl (from StoryBook)
  // 2. Learning package illustrations array matching current page (scene = currentPage + 1)
  const currentIllustrationUrl = useMemo(() => {
    if (currentPageData?.illustrationUrl) {
      return currentPageData.illustrationUrl
    }
    const lpIllustrations = story?.learning_package?.illustrations
    if (Array.isArray(lpIllustrations)) {
      const match = lpIllustrations.find((ill) => {
        const illObj = ill as unknown as { scene?: number; imageUrl?: string; image_url?: string; url?: string }
        return illObj.scene === (currentPageData?.pageNumber ?? currentPage + 1)
      }) as unknown as { imageUrl?: string; image_url?: string; url?: string } | undefined
      const url = match?.imageUrl || match?.image_url || match?.url
      if (url && (url.startsWith('http') || url.startsWith('data:'))) {
        return url
      }
    }
    return null
  }, [currentPageData?.illustrationUrl, currentPageData?.pageNumber, story?.learning_package?.illustrations, currentPage])

  const currentIllustrationPrompt = useMemo(() => {
    if (currentPageData?.illustrationPrompt) {
      return currentPageData.illustrationPrompt
    }
    const lpIllustrations = story?.learning_package?.illustrations
    if (Array.isArray(lpIllustrations)) {
      const match = lpIllustrations.find((ill) => {
        const illObj = ill as unknown as { scene?: number; prompt?: string }
        return illObj.scene === (currentPageData?.pageNumber ?? currentPage + 1)
      })
      if (match?.prompt) {
        return match.prompt
      }
    }
    return story?.learning_package?.storyDNA?.keyEvents?.[currentPage] || 'ORBIS Illustrated Adventure'
  }, [currentPageData?.illustrationPrompt, currentPageData?.pageNumber, story?.learning_package, currentPage])

  if (!pages.length) {
    return (
      <div className="card-panel storybook-empty-canvas" role="region" aria-label="Storybook reader">
        <span className="empty-book-icon" aria-hidden="true">
          📖
        </span>
        <h3>{t('empty_story_title')}</h3>
        <p>{t('empty_story_message')}</p>
      </div>
    )
  }

  const progressPercent = Math.round(((currentPage + 1) / pages.length) * 100)

  return (
    <section
      className={`storybook-reader-canvas ${isFullscreen ? 'is-fullscreen' : ''} font-size-${fontSize}`}
      aria-label={`Storybook reader: ${resolvedTitle}`}
      dir={activeIsRTL ? 'rtl' : 'ltr'}
      data-story-rtl={activeIsRTL ? 'true' : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Translation Error Banner */}
      {translationError && (
        <div className="form-status error" role="alert" style={{ margin: '0.75rem 1.5rem' }}>
          <span>⚠️ {translationError}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setTranslationError(null)}
            style={{ marginLeft: '1rem' }}
          >
            {t('close')}
          </button>
        </div>
      )}

      {/* 1. TOP HEADER (Dedicated Fullscreen Header vs Master Toolbar) */}
      {isFullscreen ? (
        <header className="fullscreen-reader-header">
          <div className="fullscreen-header-left">
            <span className="fullscreen-brand">ORBIS</span>
            <span className="fullscreen-divider">•</span>
            <h2 className="fullscreen-title">{resolvedTitle}</h2>
            {story?.moral || story?.theme ? (
              <span className="fullscreen-subtitle">
                {story.moral ? `❤️ ${story.moral}` : `🏰 ${story.theme}`}
              </span>
            ) : null}
          </div>

          <div className="fullscreen-header-center">
            <span className="fullscreen-page-pill">
              {t('page')} {currentPage + 1} {t('of')} {pages.length}
            </span>
          </div>

          <div className="fullscreen-header-right" ref={optionsMenuRef}>
            {/* Compact Options Button */}
            <button
              type="button"
              className={`fullscreen-options-btn ${isOptionsMenuOpen ? 'active' : ''}`}
              onClick={() => setIsOptionsMenuOpen((prev) => !prev)}
              aria-expanded={isOptionsMenuOpen}
              aria-label="Reading Options"
              title="Reading Options"
            >
              ⚙️ <span>Options</span>
            </button>

            {/* Compact Options Popover */}
            {isOptionsMenuOpen && (
              <div className="fullscreen-options-popover card-panel" role="dialog" aria-label="Reading Options">
                <div className="options-popover-row">
                  <span className="options-row-label">🌐 Language</span>
                  <select
                    className="reader-story-lang-select fullscreen-lang-select"
                    value={activeStoryLanguage}
                    onChange={(e) => {
                      handleSelectStoryLanguage(e.target.value)
                      setIsOptionsMenuOpen(false)
                    }}
                    disabled={isTranslating}
                    aria-label="Story Language"
                  >
                    {Object.values(SUPPORTED_LOCALES).map((loc) => {
                      const isOriginal = loc.code === originalLocaleConfig.code || loc.bcp47 === originalLocaleConfig.bcp47
                      const isSaved = !!availableTranslations[loc.bcp47]
                      const label = `${loc.nativeName} (${loc.name}) ${isOriginal ? '• Original' : isSaved ? '✓ Saved' : '✨ Translate'}`

                      return (
                        <option key={loc.bcp47} value={loc.bcp47}>
                          {label}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="options-popover-row">
                  <span className="options-row-label">🔤 {t('font_size')}</span>
                  <div className="fullscreen-font-controls" role="group" aria-label="Text size">
                    <button
                      type="button"
                      className={`reader-tool-btn btn-xs ${fontSize === 'sm' ? 'active' : ''}`}
                      onClick={() => setFontSize('sm')}
                      title="Compact text"
                      aria-label="Compact text"
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      className={`reader-tool-btn btn-xs ${fontSize === 'md' ? 'active' : ''}`}
                      onClick={() => setFontSize('md')}
                      title="Standard text"
                      aria-label="Standard text"
                    >
                      A
                    </button>
                    <button
                      type="button"
                      className={`reader-tool-btn btn-xs ${fontSize === 'lg' ? 'active' : ''}`}
                      onClick={() => setFontSize('lg')}
                      title="Large storybook text"
                      aria-label="Large storybook text"
                    >
                      A+
                    </button>
                  </div>
                </div>

                <div className="options-popover-row">
                  <span className="options-row-label">🌙 {t('bedtime_mode')}</span>
                  <button
                    type="button"
                    className={`reader-tool-btn btn-xs bedtime-btn ${preferences.bedtimeMode ? 'active' : ''}`}
                    onClick={toggleBedtimeMode}
                    title={preferences.bedtimeMode ? 'Bedtime Night-Lamp active' : 'Turn on Bedtime Night-Lamp'}
                    aria-pressed={preferences.bedtimeMode}
                  >
                    {preferences.bedtimeMode ? '🌙 On' : '☀️ Off'}
                  </button>
                </div>

                <div className="options-popover-row">
                  <span className="options-row-label">🖨️ Keepsake</span>
                  <button
                    type="button"
                    className="reader-tool-btn btn-xs print-btn"
                    onClick={() => {
                      setIsPrintModalOpen(true)
                      setIsOptionsMenuOpen(false)
                    }}
                    title={t('print_storybook')}
                  >
                    {t('print_storybook')}
                  </button>
                </div>
              </div>
            )}

            {/* Exit Fullscreen Button */}
            <button
              type="button"
              className="fullscreen-exit-btn"
              onClick={toggleFullscreen}
              title={t('exit_fullscreen')}
              aria-label={t('exit_fullscreen')}
            >
              ✕ {t('exit_fullscreen')}
            </button>
          </div>
        </header>
      ) : (
        <header className="reader-master-toolbar">
          <div className="reader-toolbar-left">
            <span className="reader-book-tag">ORBIS StoryBook</span>
            <h2 className="reader-book-title">{resolvedTitle}</h2>
            {story?.moral || story?.theme ? (
              <span className="reader-book-subtitle">
                {story.moral ? `❤️ ${story.moral}` : `🏰 ${story.theme}`}
              </span>
            ) : null}
          </div>

          <div className="reader-toolbar-controls">
            {/* Story Language Dropdown */}
            <div className="reader-control-group language-group">
              <select
                className="reader-story-lang-select"
                value={activeStoryLanguage}
                onChange={(e) => handleSelectStoryLanguage(e.target.value)}
                disabled={isTranslating}
                aria-label="Story Language"
              >
                {Object.values(SUPPORTED_LOCALES).map((loc) => {
                  const isOriginal = loc.code === originalLocaleConfig.code || loc.bcp47 === originalLocaleConfig.bcp47
                  const isSaved = !!availableTranslations[loc.bcp47]
                  const label = `${loc.nativeName} (${loc.name}) ${isOriginal ? '• Original' : isSaved ? '✓ Saved' : '✨ Translate'}`

                  return (
                    <option key={loc.bcp47} value={loc.bcp47}>
                      {label}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Typography Size Selector */}
            <div className="reader-control-group" role="group" aria-label="Text size">
              <button
                type="button"
                className={`reader-tool-btn ${fontSize === 'sm' ? 'active' : ''}`}
                onClick={() => setFontSize('sm')}
                title="Compact text"
                aria-label="Compact text"
              >
                A-
              </button>
              <button
                type="button"
                className={`reader-tool-btn ${fontSize === 'md' ? 'active' : ''}`}
                onClick={() => setFontSize('md')}
                title="Standard text"
                aria-label="Standard text"
              >
                A
              </button>
              <button
                type="button"
                className={`reader-tool-btn ${fontSize === 'lg' ? 'active' : ''}`}
                onClick={() => setFontSize('lg')}
                title="Large storybook text"
                aria-label="Large storybook text"
              >
                A+
              </button>
            </div>

            {/* Reading Mode Switcher */}
            <div className="reader-control-group mode-switcher" role="group" aria-label={t('two_page_spread')}>
              <button
                type="button"
                className={`reader-tool-btn ${readingMode === 'spread' ? 'active' : ''}`}
                onClick={() => setReadingMode('spread')}
                title={t('two_page_spread')}
                aria-label={t('two_page_spread')}
              >
                📖 {t('two_page_spread')}
              </button>
              <button
                type="button"
                className={`reader-tool-btn ${readingMode === 'focus' ? 'active' : ''}`}
                onClick={() => setReadingMode('focus')}
                title={t('single_page_focus')}
                aria-label={t('single_page_focus')}
              >
                📄 {t('single_page_focus')}
              </button>
            </div>

            {/* Bedtime Mode Toggle */}
            <button
              type="button"
              className={`reader-tool-btn bedtime-btn ${preferences.bedtimeMode ? 'active' : ''}`}
              onClick={toggleBedtimeMode}
              title={preferences.bedtimeMode ? 'Bedtime Night-Lamp active' : 'Turn on Bedtime Night-Lamp'}
              aria-pressed={preferences.bedtimeMode}
            >
              🌙 {t('bedtime_mode')}
            </button>

            {/* Printable Keepsake Button */}
            <button
              type="button"
              className="reader-tool-btn print-btn"
              onClick={() => setIsPrintModalOpen(true)}
              title={t('print_storybook')}
              aria-label={t('print_storybook')}
            >
              🖨️ {t('print_storybook')}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              className="reader-tool-btn fullscreen-btn"
              onClick={toggleFullscreen}
              title={t('fullscreen')}
              aria-label={t('fullscreen')}
            >
              ⛶ {t('fullscreen')}
            </button>
          </div>
        </header>
      )}

      {/* Translating State Overlay */}
      {isTranslating && (
        <div className="story-translating-overlay" role="status" aria-live="polite">
          <LoadingSpinner />
          <p>✨ ORBIS AI is translating this adventure into {activeLocaleConfig.nativeName} ({activeLocaleConfig.name})…</p>
        </div>
      )}

      {/* 2. PROGRESS BAR */}
      <div className="reader-progress-track">
        <div
          className="reader-progress-fill"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={currentPage + 1}
          aria-valuemin={1}
          aria-valuemax={pages.length}
          aria-label={`Reading progress: Page ${currentPage + 1} of ${pages.length}`}
        />
      </div>

      {/* 3. NORMAL MODE NARRATION CONTROL BAR */}
      {!isFullscreen && (
        <div className="reader-subtoolbar">
          <div className="read-along-player-bar">
            {/* Main Play/Pause Button */}
            <button
              type="button"
              className={`btn-narration-play ${isNarrating && !isNarratingPaused ? 'playing' : ''}`}
              onClick={handleToggleNarration}
              aria-label={
                isNarrating
                  ? isNarratingPaused
                    ? t('resume')
                    : t('pause')
                  : `${t('listen')} (${activeLocaleConfig.nativeName})`
              }
            >
              <span className="play-icon" aria-hidden="true">
                {isNarrating ? (isNarratingPaused ? '▶' : '⏸') : '🎙️'}
              </span>
              <span className="play-label">
                {isNarrating
                  ? isNarratingPaused
                    ? t('resume')
                    : t('pause')
                  : `${t('read_along')} (${activeLocaleConfig.nativeName})`}
              </span>
            </button>

            {/* Sentence Navigation Buttons */}
            <div className="reader-sentence-nav-group" role="group" aria-label="Sentence Navigation">
              <button
                type="button"
                className="reader-tool-btn sentence-step-btn"
                onClick={handlePrevSentence}
                disabled={pageSentences.length <= 1 || activeSentenceIndex === 0}
                title="Previous sentence"
                aria-label="Previous sentence"
              >
                ⏮️
              </button>
              <button
                type="button"
                className="reader-tool-btn sentence-step-btn"
                onClick={handleNextSentence}
                disabled={pageSentences.length <= 1 || (activeSentenceIndex !== null && activeSentenceIndex >= pageSentences.length - 1)}
                title="Next sentence"
                aria-label="Next sentence"
              >
                ⏭️
              </button>
            </div>

            {/* Stop / Reset Button */}
            {isNarrating && (
              <button
                type="button"
                className="reader-tool-btn stop-narration-btn"
                onClick={stopNarration}
                title="Stop narration"
                aria-label="Stop narration"
              >
                ⏹ {t('close')}
              </button>
            )}

            {/* Voice State Badge */}
            <div className="reader-voice-status-badge" role="status">
              {voiceState === 'speaking' && (
                <span className="status-speaking">
                  🔊 Reading {activeSentenceIndex !== null ? `· Sentence ${activeSentenceIndex + 1} of ${pageSentences.length}` : 'Aloud'}
                </span>
              )}
              {voiceState === 'paused' && <span className="status-paused">⏸️ Paused</span>}
              {voiceState === 'completed' && <span className="status-completed">✨ Read-along completed</span>}
              {voiceState === 'ready' && <span className="status-ready">🎙️ Tap any sentence to listen</span>}
              {voiceState === 'error' && <span className="status-error">⚠️ Narration unavailable</span>}
            </div>
          </div>

          {/* Speed Controller Pills */}
          <div className="narration-speed-selector" role="group" aria-label="Narration Pace">
            {[0.8, 1.0, 1.2].map((speed) => (
              <button
                key={speed}
                type="button"
                className={`speed-pill ${narrationSpeed === speed ? 'active' : ''}`}
                onClick={() => handleSpeedChange(speed)}
                aria-pressed={narrationSpeed === speed}
              >
                {speed === 0.8 ? '0.8x Gentle' : speed === 1.0 ? '1.0x Normal' : '1.2x Brisk'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. TWO-COLUMN PICTURE-BOOK SPREAD CANVAS */}
      <div className={`reader-book-spread layout-${readingMode} ${isFullscreen ? 'fullscreen-spread' : ''}`}>
        {/* Left Column: Illustration Canvas */}
        {readingMode === 'spread' && (
          <div className="book-spread-canvas left-illustration-canvas">
            <div className="illustration-frame">
              {currentIllustrationUrl ? (
                <img
                  src={currentIllustrationUrl}
                  alt={currentIllustrationPrompt || `Illustration for page ${currentPage + 1}`}
                  className="storybook-img"
                  onLoad={() => setIsImageLoading(false)}
                  onLoadStart={() => setIsImageLoading(true)}
                />
              ) : (
                <div className="illustration-gentle-artwork" aria-hidden="true">
                  <span className="artwork-icon">🪐 🌟 ✨</span>
                  <p className="artwork-caption">Scene {currentPageData?.pageNumber ?? currentPage + 1}</p>
                  <span className="artwork-prompt-hint">
                    {currentIllustrationPrompt || 'ORBIS Illustrated Adventure'}
                  </span>
                </div>
              )}
              {isImageLoading && <div className="illustration-skeleton" aria-busy="true" />}
            </div>
          </div>
        )}

        {/* Right Column: Story Text & Synchronized Sentence Highlights */}
        <div className="book-spread-canvas right-typography-canvas">
          <div className="page-header-ribbon">
            <span className="page-ribbon-number">
              {t('page')} {currentPage + 1} {t('of')} {pages.length}
            </span>
            <span className="page-ribbon-time">
              ⏱️ {Math.max(1, Math.ceil((currentPageData?.text?.length ?? 0) / 200))} {t('minutes_read')}
            </span>
          </div>

          <article
            className="storybook-narrative-article"
            style={{ fontFamily: activeLocaleConfig.fontFamily }}
          >
            {pageSentences.length > 0 ? (
              pageSentences.map((sentence, idx) => {
                const isHighlighted = isNarrating && activeSentenceIndex === idx
                return (
                  <span
                    key={idx}
                    id={`story-sentence-${currentPage}-${idx}`}
                    className={`read-along-sentence ${isHighlighted ? 'read-along-active-sentence' : ''}`}
                    onClick={() => handleSentenceClick(idx)}
                    title="Click sentence to read aloud from here"
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSentenceClick(idx)
                      }
                    }}
                  >
                    {sentence}{' '}
                  </span>
                )
              })
            ) : (
              <p>{currentPageData?.text}</p>
            )}
          </article>

          {/* Story Completion Keepsake Vignette (Shown on Final Page) */}
          {isLastPage ? (
            <div className="card-panel story-completion-card storybook-completion-vignette" role="region" aria-label="Story Completed">
              <div className="vignette-sparkle" aria-hidden="true">✨ 🌟 ✨</div>
              <div className="completion-content">
                <h4 className="vignette-title">The End</h4>
                <p className="vignette-subtitle">You have finished reading &quot;{resolvedTitle}&quot;.</p>
                <div className="completion-actions vignette-actions">
                  <button
                    type="button"
                    className="button button-primary btn-sm btn-vignette btn-vignette-primary"
                    onClick={() => {
                      stopNarration()
                      setCurrentPage(0)
                    }}
                  >
                    🔄 Read Again
                  </button>
                  <button
                    type="button"
                    className="button button-secondary btn-sm btn-vignette btn-vignette-secondary"
                    onClick={() => setIsPrintModalOpen(true)}
                  >
                    🖨️ {t('print_storybook')}
                  </button>
                  {onExploreLearning ? (
                    <button
                      type="button"
                      className="button button-secondary btn-sm btn-vignette btn-vignette-accent"
                      onClick={onExploreLearning}
                    >
                      💡 Explore Quizzes
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 5. PAGE NAVIGATION & FULLSCREEN NARRATION FOOTER */}
      {isFullscreen ? (
        <footer className="fullscreen-reader-footer">
          <button
            type="button"
            className="btn-page-nav prev-page-btn"
            onClick={previousPage}
            disabled={isFirstPage}
            aria-label={t('previous_page')}
          >
            <span>{activeIsRTL ? '▶' : '◀'}</span>
            <span>{t('previous_page')}</span>
          </button>

          <div className="fullscreen-narration-cluster">
            {/* Play/Pause */}
            <button
              type="button"
              className={`btn-narration-play ${isNarrating && !isNarratingPaused ? 'playing' : ''}`}
              onClick={handleToggleNarration}
              aria-label={
                isNarrating
                  ? isNarratingPaused
                    ? t('resume')
                    : t('pause')
                  : `${t('listen')} (${activeLocaleConfig.nativeName})`
              }
            >
              <span className="play-icon" aria-hidden="true">
                {isNarrating ? (isNarratingPaused ? '▶' : '⏸') : '🎙️'}
              </span>
              <span className="play-label">
                {isNarrating
                  ? isNarratingPaused
                    ? t('resume')
                    : t('pause')
                  : `${t('read_along')} (${activeLocaleConfig.nativeName})`}
              </span>
            </button>

            {/* Sentence Stepper */}
            <div className="reader-sentence-nav-group" role="group" aria-label="Sentence Navigation">
              <button
                type="button"
                className="reader-tool-btn sentence-step-btn"
                onClick={handlePrevSentence}
                disabled={pageSentences.length <= 1 || activeSentenceIndex === 0}
                title="Previous sentence"
                aria-label="Previous sentence"
              >
                ⏮️
              </button>
              <button
                type="button"
                className="reader-tool-btn sentence-step-btn"
                onClick={handleNextSentence}
                disabled={pageSentences.length <= 1 || (activeSentenceIndex !== null && activeSentenceIndex >= pageSentences.length - 1)}
                title="Next sentence"
                aria-label="Next sentence"
              >
                ⏭️
              </button>
            </div>

            {/* Stop / Reset Button */}
            {isNarrating && (
              <button
                type="button"
                className="reader-tool-btn stop-narration-btn"
                onClick={stopNarration}
                title="Stop narration"
                aria-label="Stop narration"
              >
                ⏹
              </button>
            )}

            {/* Voice State Badge */}
            <div className="reader-voice-status-badge" role="status">
              {voiceState === 'speaking' && (
                <span className="status-speaking">
                  🔊 Reading {activeSentenceIndex !== null ? `· Sentence ${activeSentenceIndex + 1} of ${pageSentences.length}` : 'Aloud'}
                </span>
              )}
              {voiceState === 'paused' && <span className="status-paused">⏸️ Paused</span>}
              {voiceState === 'completed' && <span className="status-completed">✨ Completed</span>}
              {voiceState === 'ready' && <span className="status-ready">🎙️ Ready</span>}
              {voiceState === 'error' && <span className="status-error">⚠️ Unavailable</span>}
            </div>

            {/* Speed Selector */}
            <div className="narration-speed-selector" role="group" aria-label="Narration Pace">
              {[0.8, 1.0, 1.2].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  className={`speed-pill ${narrationSpeed === speed ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(speed)}
                  aria-pressed={narrationSpeed === speed}
                >
                  {speed === 0.8 ? '0.8x' : speed === 1.0 ? '1.0x' : '1.2x'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn-page-nav next-page-btn"
            onClick={nextPage}
            disabled={isLastPage}
            aria-label={t('next_page')}
          >
            <span>{t('next_page')}</span>
            <span>{activeIsRTL ? '◀' : '▶'}</span>
          </button>
        </footer>
      ) : (
        <footer className="reader-turner-footer">
          <button
            type="button"
            className="btn-page-nav prev-page-btn"
            onClick={previousPage}
            disabled={isFirstPage}
            aria-label={t('previous_page')}
          >
            <span>{activeIsRTL ? '▶' : '◀'}</span>
            <span>{t('previous_page')}</span>
          </button>

          <div className="page-turner-indicator">
            <span className="page-numbers">
              {t('page')} {currentPage + 1} {t('of')} {pages.length}
            </span>
            <span className="turner-hint">
              {activeIsRTL ? 'Keyboard: Arrow keys / Swipe to turn' : 'Keyboard: Arrow keys / Space to listen'}
            </span>
          </div>

          <button
            type="button"
            className="btn-page-nav next-page-btn"
            onClick={nextPage}
            disabled={isLastPage}
            aria-label={t('next_page')}
          >
            <span>{t('next_page')}</span>
            <span>{activeIsRTL ? '◀' : '▶'}</span>
          </button>
        </footer>
      )}

      {/* Printable StoryBook Modal */}
      {isPrintModalOpen ? (
        <PrintableStoryBookModal
          isOpen={isPrintModalOpen}
          story={story ?? null}
          storyBook={storyBook}
          onClose={() => setIsPrintModalOpen(false)}
        />
      ) : null}
    </section>
  )
})