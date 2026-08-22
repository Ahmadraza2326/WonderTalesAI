import { paginateStory } from '../src/services/storybookPagination'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Pagination Test Failed: ${message}`)
  }
}

function runTests() {
  console.log('Running Pagination Regression Tests...\n')

  // Helper to generate dummy text
  const generateText = (words: number) => Array(words).fill('word').join(' ')
  
  // 1. Short story with normal content (~400 words)
  const shortNormalContent = generateText(400).match(/.{1,100}(\s|$)/g)?.join('\n') || ''
  const p1 = paginateStory('Title', shortNormalContent, 'short')
  console.log(`Short (Normal) - Target 4 pages, Actual: ${p1.pages.length} pages`)
  assert(p1.pages.length >= 3 && p1.pages.length <= 5, 'Short story should be around 4 pages')

  // 2. Short story with unusually short content (~50 words)
  const unusuallyShortContent = generateText(50).match(/.{1,30}(\s|$)/g)?.join('\n') || ''
  const p2 = paginateStory('Title', unusuallyShortContent, 'short')
  console.log(`Short (Unusually Short) - Target 4 pages, Actual: ${p2.pages.length} pages`)
  assert(p2.pages.length >= 2 && p2.pages.length <= 4, 'Unusually short story should still paginate reasonably without making tiny 1-word pages (min 150 chars)')

  // 3. Medium story (~700 words)
  const mediumContent = generateText(700).match(/.{1,150}(\s|$)/g)?.join('\n') || ''
  const p3 = paginateStory('Title', mediumContent, 'medium')
  console.log(`Medium - Target 6 pages, Actual: ${p3.pages.length} pages`)
  assert(p3.pages.length >= 5 && p3.pages.length <= 7, 'Medium story should be around 6 pages')

  // 4. Long story (~1100 words)
  const longContent = generateText(1100).match(/.{1,150}(\s|$)/g)?.join('\n') || ''
  const p4 = paginateStory('Title', longContent, 'long')
  console.log(`Long - Target 8 pages, Actual: ${p4.pages.length} pages`)
  assert(p4.pages.length >= 7 && p4.pages.length <= 9, 'Long story should be around 8 pages')

  // 5. RTL Urdu Content
  const urduText = `ایک دفعہ کا ذکر ہے کہ ایک چھوٹی سی لڑکی جس کا نام زارا تھا۔ 
وہ ایک خوبصورت گاؤں میں رہتی تھی۔
اس کا گاؤں بہت ہرا بھرا اور خوشگوار تھا۔
ایک دن وہ جنگل کی طرف گئی۔
وہاں اس نے ایک حیرت انگیز پرندہ دیکھا۔
پرندے کے پر سنہری اور نیلے رنگ کے تھے۔
زارا اسے دیکھ کر بہت خوش ہوئی۔`
  const p5 = paginateStory('Urdu Story', urduText, 'short')
  console.log(`Urdu (Short) - Target 4 pages, Actual: ${p5.pages.length} pages`)
  assert(p5.pages.length > 0, 'Urdu story should paginate successfully')
  
  // 6. Preservation of all source text
  const sourceText = "Paragraph 1.\n\nParagraph 2.\n\nParagraph 3."
  const p6 = paginateStory('Preservation', sourceText, 'short')
  const reconstructed = p6.pages.map(p => p.text).join('\n\n')
  assert(reconstructed === sourceText, 'All source text and paragraph boundaries must be perfectly preserved')
  console.log('Source text perfectly preserved.')

  console.log('\n✅ All pagination regression tests passed!')
}

try {
  runTests()
} catch (e: any) {
  console.error(e.message)
  process.exit(1)
}
