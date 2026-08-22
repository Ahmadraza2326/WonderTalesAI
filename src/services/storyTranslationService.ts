/**
 * ORBIS Story Translation Service
 * Provides non-destructive, cached, and authenticated story translations
 * across all 10 supported locales through the secure server boundary.
 */

import { supabase } from '../lib/supabase'
import { aiEngine } from './ai/aiEngine'
import { buildTranslationPrompt } from './ai/prompts'
import { parseLearningPackage } from './ai/jsonParser'
import { resolveLocaleConfig } from './i18n/locales'
import type { StoryRecord } from '../types/story'
import type { TranslatedStoryContent } from '../types/translation'
import type { Json } from '../types/database.types'

export class StoryTranslationService {
  // In-flight concurrency lock to prevent duplicate simultaneous translation calls
  private inFlightTranslations = new Map<string, Promise<TranslatedStoryContent>>()

  /**
   * Fetches an existing cached story translation from Supabase.
   */
  async getStoryTranslation(
    storyId: string,
    targetLocaleOrLanguage: string,
    userId: string
  ): Promise<TranslatedStoryContent | null> {
    if (!storyId || !userId) return null

    const localeConfig = resolveLocaleConfig(targetLocaleOrLanguage)
    const targetBcp47 = localeConfig.bcp47

    try {
      const { data, error } = await supabase
        .from('story_translations')
        .select('translated_content')
        .eq('story_id', storyId)
        .eq('target_locale', targetBcp47)
        .eq('user_id', userId)
        .maybeSingle()

      if (error || !data) {
        return null
      }

      return data.translated_content as unknown as TranslatedStoryContent
    } catch {
      return null
    }
  }

  /**
   * Fetches all cached translations for a specific story.
   */
  async getAllStoryTranslations(
    storyId: string,
    userId: string
  ): Promise<Record<string, TranslatedStoryContent>> {
    if (!storyId || !userId) return {}

    try {
      const { data, error } = await supabase
        .from('story_translations')
        .select('target_locale, translated_content')
        .eq('story_id', storyId)
        .eq('user_id', userId)

      if (error || !data) {
        return {}
      }

      const map: Record<string, TranslatedStoryContent> = {}
      for (const row of data) {
        if (row.target_locale && row.translated_content) {
          map[row.target_locale] = row.translated_content as unknown as TranslatedStoryContent
        }
      }
      return map
    } catch {
      return {}
    }
  }

  /**
   * Translates an existing story into a target locale.
   * - Never mutates the original story.
   * - Translates strictly from the canonical original story to prevent translation drift.
   * - Reuses cached translation if already generated.
   * - Enforces server-side quota and authentication.
   */
  async translateStory(
    story: StoryRecord,
    targetLocaleOrLanguage: string,
    userId: string
  ): Promise<TranslatedStoryContent> {
    if (!story || !userId) {
      throw new Error('Story and user authentication are required for translation.')
    }

    const localeConfig = resolveLocaleConfig(targetLocaleOrLanguage)
    const targetBcp47 = localeConfig.bcp47
    const originalLocale = resolveLocaleConfig(story.language)

    // 1. If target matches canonical original story locale, return original representation
    if (originalLocale.code === localeConfig.code || originalLocale.bcp47 === targetBcp47) {
      return this.formatOriginalStoryAsTranslated(story, localeConfig.bcp47, localeConfig.name)
    }

    // 2. Check cache first (zero AI cost, zero quota)
    const cached = await this.getStoryTranslation(story.id, targetBcp47, userId)
    if (cached) {
      return cached
    }

    // 3. Concurrency guard: await active in-flight translation if one is already running
    const lockKey = `${story.id}:${targetBcp47}`
    const inFlight = this.inFlightTranslations.get(lockKey)
    if (inFlight) {
      return inFlight
    }

    // 4. Perform new translation via secure server boundary
    const translationPromise = (async () => {
      // Build structured translation prompt from canonical original story
      const prompt = buildTranslationPrompt(story, localeConfig)

      // Call secure server boundary
      const response = await aiEngine.generateStory(prompt)

      // Parse validated learning package
      const translatedPackage = parseLearningPackage(response)

      const translatedTitle =
        translatedPackage.storyDNA?.title ||
        story.title ||
        'Translated Story'

      const translatedMoral =
        translatedPackage.storyDNA?.moral ||
        story.moral ||
        ''

      const translatedTheme =
        translatedPackage.storyDNA?.theme ||
        story.theme ||
        ''

      const translatedContent: TranslatedStoryContent = {
        title: translatedTitle,
        story_content: translatedPackage.story,
        moral: translatedMoral,
        theme: translatedTheme,
        learning_package: translatedPackage,
        target_locale: targetBcp47,
        target_language: localeConfig.name,
        translated_at: new Date().toISOString(),
      }

      // 5. Persist to story_translations table (RLS protected)
      const { error: persistError } = await supabase
        .from('story_translations')
        .upsert(
          {
            story_id: story.id,
            user_id: userId,
            target_locale: targetBcp47,
            translated_content: translatedContent as unknown as Json,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'story_id, target_locale' }
        )

      if (persistError) {
        console.warn('[storyTranslationService] Could not persist translation to database:', persistError.message)
      }

      return translatedContent
    })()

    this.inFlightTranslations.set(lockKey, translationPromise)

    try {
      const result = await translationPromise
      return result
    } finally {
      this.inFlightTranslations.delete(lockKey)
    }
  }

  private formatOriginalStoryAsTranslated(
    story: StoryRecord,
    targetLocale: string,
    targetLanguage: string
  ): TranslatedStoryContent {
    return {
      title: story.title,
      story_content: story.learning_package?.story || story.story_content || '',
      moral: story.moral || '',
      theme: story.theme || '',
      learning_package: story.learning_package,
      target_locale: targetLocale,
      target_language: targetLanguage,
      translated_at: story.generated_at || story.created_at,
    }
  }
}

export const storyTranslationService = new StoryTranslationService()
