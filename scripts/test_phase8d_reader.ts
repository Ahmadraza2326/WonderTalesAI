/**
 * Phase 8D StoryBook Reader & Pagination Test Suite
 */
import { paginateStory } from '../src/services/storybookPagination'

console.log('🧪 Running Phase 8D Reader Suite...')

let passed = 0
let total = 0

function assert(condition: boolean, name: string, details?: string) {
  total++
  if (condition) {
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } else {
    console.error(`  ❌ [FAIL] ${name}${details ? ` -> ${details}` : ''}`)
  }
}


// 1. Pagination tests
const longText = 'Paragraph one about an adventure.\n\nParagraph two about finding a magical star in the forest. '.repeat(10) + '\n\nParagraph three about learning kindness and sharing.'
const storybook = paginateStory('The Little Star', longText, 'short')

assert(storybook.title === 'The Little Star', 'paginateStory preserves story title')
assert(storybook.pages.length >= 2, 'paginateStory splits paragraphs into multiple pages', `Got ${storybook.pages.length}`)
assert(typeof paginateStory === 'function', 'paginateStory is exported function')

console.log(`\nPhase 8D Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
