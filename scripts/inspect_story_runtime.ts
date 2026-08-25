import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { paginateStory } from '../src/services/storybookPagination'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectStory() {
  console.log('=== Inspecting Stories in Supabase ===')
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, language, story_length, story_content, learning_package, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching stories:', error.message)
    return
  }

  console.log(`Found ${stories?.length ?? 0} stories.`)
  for (const s of stories || []) {
    const rawContent = s.learning_package?.story || s.story_content || ''
    const paragraphs = rawContent.split('\n').map((p: string) => p.trim()).filter(Boolean)
    const sentences = rawContent.split(/(?<=[.!?؟۔])\s+|(?<=[。！？।])\s*/).map((x: string) => x.trim()).filter(Boolean)
    
    console.log('\n----------------------------------------')
    console.log(`Story ID: ${s.id}`)
    console.log(`Title: ${s.title}`)
    console.log(`Language: ${s.language}`)
    console.log(`story_length: ${s.story_length ?? 'UNDEFINED/NULL'}`)
    console.log(`story_content length (chars): ${rawContent.length}`)
    console.log(`Paragraph count (split on \\n): ${paragraphs.length}`)
    console.log(`Sentence count (multilingual regex): ${sentences.length}`)

    // Check cached assets in story_assets
    const { data: assets } = await supabase
      .from('story_assets')
      .select('asset_type, generation_version, created_at')
      .eq('story_id', s.id)

    console.log(`Cached story_assets:`, assets)

    // Run paginateStory
    const paginated = paginateStory(s.title, rawContent, s.story_length)
    console.log(`paginateStory() result pages count: ${paginated.pages.length}`)
    paginated.pages.forEach((p, idx) => {
      console.log(`  Page ${idx + 1}: length=${p.text.length} chars, sentences=${p.text.split(/(?<=[.!?؟۔])\s+/).length}`)
    })
  }
}

inspectStory()
