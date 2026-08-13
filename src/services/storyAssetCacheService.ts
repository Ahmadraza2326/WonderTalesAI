import { supabase } from '../lib/supabase'
import type { StoryNarration } from '../types/narration'
import type { StoryBook } from '../types/storybook'
import type { StoryRecord } from '../types/story'

const STORAGE_BUCKET = 'story-assets'
const STORYBOOK_VERSION = 1
const NARRATION_VERSION = 1

type StoredStoryBook = {
  title: string
  pages: Array<{
    pageNumber: number
    text: string
    illustrationPrompt?: string | null
    illustrationPath?: string | null
    narrationUrl?: string | null
  }>
}

function storySource(story: StoryRecord) {
  return JSON.stringify({
    title: story.title,
    story: story.learning_package?.story ?? story.story_content ?? '',
    storyDNA: story.learning_package?.storyDNA ?? null,
  })
}

async function contentHash(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

async function getHash(story: StoryRecord, assetType: 'storybook' | 'narration') {
  return contentHash(`${assetType}:v1:${storySource(story)}`)
}

async function createSignedUrl(path: string) {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 60 * 60)

  if (error || !data?.signedUrl) {
    throw error ?? new Error('Unable to read the saved StoryBook image.')
  }

  return data.signedUrl
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl)
  if (!response.ok) throw new Error('Unable to prepare the generated illustration for storage.')
  return response.blob()
}

export const storyAssetCacheService = {
  async getStoryBook(story: StoryRecord, userId: string): Promise<StoryBook | null> {
    const hash = await getHash(story, 'storybook')
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
    const pages = await Promise.all(savedStoryBook.pages.map(async page => ({
      pageNumber: page.pageNumber,
      text: page.text,
      illustrationPrompt: page.illustrationPrompt ?? null,
      illustrationUrl: page.illustrationPath ? await createSignedUrl(page.illustrationPath) : null,
      narrationUrl: page.narrationUrl ?? null,
    })))

    return { title: savedStoryBook.title, pages }
  },

  async saveStoryBook(story: StoryRecord, userId: string, storyBook: StoryBook) {
    const hash = await getHash(story, 'storybook')
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
      payload: { title: storyBook.title, pages },
    }, { onConflict: 'story_id,asset_type,content_hash,generation_version' })

    if (error) throw error
  },

  async getNarration(story: StoryRecord, userId: string): Promise<StoryNarration | null> {
    const hash = await getHash(story, 'narration')
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
    return data ? (data.payload as unknown as StoryNarration) : null
  },

  async saveNarration(story: StoryRecord, userId: string, narration: StoryNarration) {
    const hash = await getHash(story, 'narration')
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
