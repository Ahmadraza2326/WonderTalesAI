import { paginateStory } from '../src/services/storybookPagination'
import { readAlongSpeechService } from '../src/services/audio/readAlongSpeechService'
import { buildNarration } from '../src/services/ai/narrationService'
import { generateNarration } from '../src/services/narrationGenerator'
import type { StoryRecord } from '../src/types/story'

let total = 0
let passed = 0

function assert(condition: boolean, msg: string) {
  total++
  if (condition) {
    passed++
    console.log(`  ✅ [PASS] ${msg}`)
  } else {
    console.error(`  ❌ [FAIL] ${msg}`)
    throw new Error(`Assertion failed: ${msg}`)
  }
}

async function runVerification() {
  console.log('========================================================================')
  console.log('🧪 RUNTIME VERIFICATION: MULTILINGUAL PAGINATION & NARRATION PIPELINE')
  console.log('========================================================================\n')

  // --- TEST 1: 21-Sentence Urdu Story Pagination ---
  console.log('📖 1. Urdu 21-Sentence Single-Paragraph Pagination')
  const urdu21Text = `ایک دفعہ کا ذکر ہے کہ ایک چھوٹے سے گاؤں میں ایک بچہ رہتا تھا۔ اس کا نام علی تھا۔ وہ بہت ذہین اور محنتی تھا۔ علی کو کہانیاں پڑھنے کا بہت شوق تھا۔ وہ ہر روز شام کو اپنے دادا جی سے نئی کہانی سنتا تھا۔ دادا جی اسے بہادری اور سچائی کے قصے سناتے تھے۔ ایک دن علی نے جنگل میں ایک چھوٹا پرندہ دیکھا۔ پرندہ زخمی تھا اور اڑ نہیں سکتا تھا۔ علی نے نرمی سے پرندے کو اپنے ہاتھ میں اٹھایا۔ وہ اسے گھر لے آیا اور اس کے زخم پر مرہم لگایا۔ چند دنوں میں پرندہ بالکل ٹھیک ہو گیا۔ پرندے نے خوشی سے اپنے پر پھڑپھڑائے اور چہچہانے لگا۔ علی نے اسے کھلی کھڑکی سے آزاد کر دیا۔ پرندہ اڑ کر پاس کے درخت پر بیٹھ گیا۔ اس نے علی کی طرف دیکھ کر شکریہ کا گیت گایا۔ علی کے دل کو بہت خوشی اور سکون ملا۔ دادا جی نے علی کی پیٹھ تھپتھپائی اور شاباش دی۔ انہوں نے کہا کہ بے زبان جانوروں پر رحم کرنا سب سے بڑی نیکی ہے۔ علی نے وعدہ کیا کہ وہ ہمیشہ کمزوروں اور ضرورت مندوں کی مدد کرے گا۔ اس دن سے علی پورے گاؤں میں اپنی رحم دلی کی وجہ سے مشہور ہو گیا۔`

  const pShort = paginateStory('Urdu Story', urdu21Text, 'short')
  assert(pShort.pages.length === 4, `Short Urdu story yields exactly 4 pages (got ${pShort.pages.length})`)

  const pDefault = paginateStory('Urdu Story', urdu21Text)
  assert(pDefault.pages.length === 4, `Default Urdu story (no length specified) yields 4 pages (got ${pDefault.pages.length})`)

  const pMedium = paginateStory('Urdu Story', urdu21Text, 'medium')
  assert(pMedium.pages.length === 6, `Medium Urdu story yields 6 pages (got ${pMedium.pages.length})`)

  const pLong = paginateStory('Urdu Story', urdu21Text, 'long')
  assert(pLong.pages.length === 8, `Long Urdu story yields 8 pages (got ${pLong.pages.length})`)

  // Check sentence distribution
  pShort.pages.forEach((p, idx) => {
    assert(p.text.length > 50, `Page ${idx + 1} has substantial content (${p.text.length} chars)`)
  })

  // --- TEST 2: Sentence Alignment in Narration ---
  console.log('\n🎙️ 2. Sentence-Aligned Multilingual Narration Segments')
  const dummyStory = {
    id: 'story-urdu-001',
    user_id: 'user-001',
    title: 'kuch b',
    story_content: urdu21Text,
    language: 'Urdu',
    reading_level: 'Grade 2',
    created_at: new Date().toISOString(),
  } as unknown as StoryRecord

  const narration = buildNarration(dummyStory, 'ur-PK')
  assert(narration.segments.length === 20, `Narration extracts all 20 sentences as distinct segments (got ${narration.segments.length})`)
  assert(narration.language === 'ur-PK', `Narration locale resolved to ur-PK`)

  const legacyNarration = await generateNarration(dummyStory, 'ur-PK')
  assert(legacyNarration.segments.length === 20, `generateNarration() aligned with buildNarration (20 segments)`)

  // --- TEST 3: SpeechSynthesis Safety for Unsupported Languages ---
  console.log('\n🔇 3. SpeechSynthesis Safety: Rejection of Fake Playback When No Voice Exists')
  // Mock SpeechSynthesis environment without Urdu voice
  const mockVoices = [
    { name: 'Microsoft David - English (United States)', lang: 'en-US', default: true } as SpeechSynthesisVoice,
  ]
  readAlongSpeechService.setVoices(mockVoices)

  const urduVoice = readAlongSpeechService.findBestVoice('ur-PK')
  assert(urduVoice === null, 'findBestVoice returns null for ur-PK on systems without Urdu TTS voice')

  let errorFired = false
  const sentences = ['ایک دفعہ کا ذکر ہے۔', 'وہاں ایک پرندہ تھا۔']
  const canSpeak = readAlongSpeechService.speakSequence(sentences, 0, true, {
    language: 'ur-PK',
    onError: (err) => {
      errorFired = true
      console.log(`  [Verified Error Notification]: ${err.message}`)
    },
  })

  assert(canSpeak === false, 'speakSequence() returns false when no native voice exists for ur-PK (refuses fake playback)')
  assert(errorFired, 'speakSequence() triggered onError callback with clear missing-voice notification')

  // --- TEST 4: English Voice Remains Fully Supported for Fallback ---
  console.log('\n🔊 4. English SpeechSynthesis Compatibility')
  const enVoice = readAlongSpeechService.findBestVoice('en-US')
  assert(enVoice !== null, 'findBestVoice resolves valid English voice for en-US')

  console.log('\n========================================================================')
  console.log(`🎉 ALL TESTS PASSED: ${passed}/${total} assertions verified!`)
  console.log('========================================================================\n')
}

runVerification().catch((err) => {
  console.error('Test suite failed:', err)
  process.exit(1)
})
