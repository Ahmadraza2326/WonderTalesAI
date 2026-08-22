import { supabase } from '../lib/supabase'
import type { StoryNarration } from '../types/narration'
import type { StoryBook } from '../types/storybook'
import type { StoryRecord } from '../types/story'
import { resolveLocaleConfig } from './i18n/locales'

const STORAGE_BUCKET = 'story-assets'
const STORYBOOK_VERSION = 2
const NARRATION_VERSION = 2

type StoredStoryBook = {
  title: string
  language?: string
  pages: Array<{
    pageNumber: number
    text: string
    illustrationPrompt?: string | null
    illustrationPath?: string | null
    narrationUrl?: string | null
  }>
}

function storySource(
  story: StoryRecord,
  language?: string,
  customStoryContent?: string,
  customTitle?: string
) {
  const targetLocale = resolveLocaleConfig(language || story.language || 'English')
  return JSON.stringify({
    title: customTitle || story.title,
    story: customStoryContent ?? story.learning_package?.story ?? story.story_content ?? '',
    storyDNA: story.learning_package?.storyDNA ?? null,
    language: targetLocale.bcp47,
  })
}

export async function contentHash(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function getNarrationHash(
  story: StoryRecord,
  language?: string,
  customStoryContent?: string,
  customTitle?: string
) {
  return getHash(story, 'narration', language, customStoryContent, customTitle)
}

async function getHash(
  story: StoryRecord,
  assetType: 'storybook' | 'narration',
  language?: string,
  customStoryContent?: string,
  customTitle?: string
) {
  const version = assetType === 'storybook' ? STORYBOOK_VERSION : NARRATION_VERSION
  return contentHash(`${assetType}:v${version}:${storySource(story, language, customStoryContent, customTitle)}`)
}

async function createSignedUrl(path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, 60 * 60)

    if (error || !data?.signedUrl) {
      console.warn(`[storyAssetCacheService] Unable to create signed URL for path "${path}":`, error)
      return null
    }

    return data.signedUrl
  } catch (err) {
    console.warn(`[storyAssetCacheService] Failed to create signed URL for path "${path}":`, err)
    return null
  }
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl)
  if (!response.ok) throw new Error('Unable to prepare the generated illustration for storage.')
  return response.blob()
}

export const storyAssetCacheService = {
  async getStoryBook(
    story: StoryRecord,
    userId: string,
    language?: string,
    customStoryContent?: string,
    customTitle?: string
  ): Promise<StoryBook | null> {
    const hash = await getHash(story, 'storybook', language, customStoryContent, customTitle)
    return this.fetchStoryBook(story, userId, hash)
  },

  async fetchStoryBook(story: StoryRecord, userId: string, hash: string): Promise<StoryBook | null> {
    const { data, error } = await supabase
      .from('story_assets')
      .select('payload')
      .eq('story_id', story.id)
      .eq('user_id', userId)
      .eq('asset_type', 'storybook')
      .eq('content_hash', hash)
      .eq('generation_version', STORYBOOK_VERSION)
      .eq('status', 'generated')
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    const savedStoryBook = data.payload as unknown as StoredStoryBook
    const pages = await Promise.all(savedStoryBook.pages.map(async page => {
      let illustrationUrl: string | null = null

      if (page.illustrationPath) {
        illustrationUrl = await createSignedUrl(page.illustrationPath)
      }

      return {
        pageNumber: page.pageNumber,
        text: page.text,
        illustrationPrompt: page.illustrationPrompt ?? null,
        illustrationUrl,
        narrationUrl: page.narrationUrl ?? null,
      }
    }))

    return { title: savedStoryBook.title, pages }
  },

  async saveStoryBook(
    story: StoryRecord,
    userId: string,
    storyBook: StoryBook,
    language?: string,
    customStoryContent?: string,
    customTitle?: string
  ) {
    const targetLocale = resolveLocaleConfig(language || story.language || 'English')
    const hash = await getHash(story, 'storybook', language, customStoryContent, customTitle)
    const pages = await Promise.all(storyBook.pages.map(async page => {
      let illustrationPath: string | null = null

      if (page.illustrationUrl) {
        const image = await dataUrlToBlob(page.illustrationUrl)
        const extension = image.type === 'image/png' ? 'png' : 'jpg'
        illustrationPath = `${userId}/${story.id}/storybook/${hash}/page-${page.pageNumber}.${extension}`
        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(illustrationPath, image, { contentType: image.type, upsert: true })
        if (error) throw error
      }

      return {
        pageNumber: page.pageNumber,
        text: page.text,
        illustrationPrompt: page.illustrationPrompt ?? null,
        illustrationPath,
        narrationUrl: page.narrationUrl ?? null,
      }
    }))

    const { error } = await supabase.from('story_assets').upsert({
      story_id: story.id,
      user_id: userId,
      asset_type: 'storybook',
      content_hash: hash,
      generation_version: STORYBOOK_VERSION,
      status: 'generated',
      payload: { title: storyBook.title, language: targetLocale.bcp47, pages },
    }, { onConflict: 'story_id,asset_type,content_hash,generation_version' })

    if (error) throw error
  },

  async getNarration(
    story: StoryRecord,
    userId: string,
    language?: string,
    customStoryContent?: string,
    customTitle?: string
  ): Promise<StoryNarration | null> {
    const hash = await getHash(story, 'narration', language, customStoryContent, customTitle)
    const { data, error } = await supabase
      .from('story_assets')
      .select('payload')
      .eq('story_id', story.id)
      .eq('user_id', userId)
      .eq('asset_type', 'narration')
      .eq('content_hash', hash)
      .eq('generation_version', NARRATION_VERSION)
      .eq('status', 'generated')
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    const savedNarration = data.payload as unknown as StoryNarration
    const hydratedSegments = await Promise.all(
      savedNarration.segments.map(async (seg) => {
        let audioUrl = seg.audioUrl || ''
        if (seg.audioPath) {
          const freshSignedUrl = await createSignedUrl(seg.audioPath)
          if (freshSignedUrl) {
            audioUrl = freshSignedUrl
          }
        }
        return {
          ...seg,
          audioUrl,
        }
      })
    )

    return {
      ...savedNarration,
      segments: hydratedSegments,
    }
  },

  async saveNarration(
    story: StoryRecord,
    userId: string,
    narration: StoryNarration,
    language?: string,
    customStoryContent?: string,
    customTitle?: string
  ) {
    const hash = await getHash(story, 'narration', language, customStoryContent, customTitle)
    const { error } = await supabase.from('story_assets').upsert({
      story_id: story.id,
      user_id: userId,
      asset_type: 'narration',
      content_hash: hash,
      generation_version: NARRATION_VERSION,
      status: 'generated',
      payload: narration,
    }, { onConflict: 'story_id,asset_type,content_hash,generation_version' })

    if (error) throw error
  },
}
