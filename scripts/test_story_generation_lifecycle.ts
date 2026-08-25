/**
 * Test Story Generation Lifecycle for "kuch b"
 * Tests prompt generation, Gemini 3.6 Flash text generation, and learning package parsing.
 */

import * as dotenv from 'dotenv'
import { buildLearningPackagePrompt } from '../src/services/ai/prompts'
import { parseLearningPackage } from '../src/services/ai/jsonParser'
import type { StoryRecord } from '../src/types/story'

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY || ''

async function testStoryGeneration() {
  console.log('🧪 Testing Story Generation Lifecycle for story "kuch b"...')

  const mockStory: StoryRecord = {
    id: 'story-kuch-b-test',
    user_id: 'mock-user-123',
    title: 'kuch b',
    child_name: 'Ahmad',
    child_age: 7,
    language: 'English',
    theme: 'Adventure',
    moral: 'Courage and curiosity lead to discovery',
    characters: 'Ahmad, Little Robot',
    story_length: 'medium',
    reading_level: 'intermediate',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    story_content: '',
    generation_status: 'pending',
    generated_at: null,
    is_favorite: false,
    learning_package: null,
  }

  // 1. Build prompt
  const prompt = buildLearningPackagePrompt(mockStory)
  console.log('  1. Prompt built successfully (length:', prompt.length, 'chars)')

  // 2. Call Gemini 3.6 Flash
  console.log('  2. Calling Gemini 3.6 Flash API...')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`
  
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!resp.ok) {
    throw new Error(`Gemini API call failed (${resp.status}): ${await resp.text()}`)
  }

  const data = await resp.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  console.log('  3. Gemini 3.6 Flash returned response (length:', rawText?.length, 'chars)')

  // 3. Parse and validate learning package
  const pkg = parseLearningPackage(rawText)
  console.log('  4. Learning package parsed successfully!')
  console.log(`     - Title: "${pkg.storyDNA.title}"`)
  console.log(`     - Story Length: ${pkg.story.length} characters`)
  console.log(`     - Vocabulary Words: ${pkg.vocabulary.length}`)
  console.log(`     - Quiz Questions: ${pkg.quizSeeds.length}`)
  console.log(`     - Illustrations: ${pkg.illustrations.length}`)

  console.log('\n✅ STORY GENERATION LIFECYCLE VERIFIED (100% OPERATIONAL)')
}

testStoryGeneration().catch((err) => {
  console.error('❌ Test failed:', err)
  process.exit(1)
})
