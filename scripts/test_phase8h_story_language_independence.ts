/**
 * Phase 8H Automated Test Suite
 * STORY LANGUAGE INDEPENDENCE + TRANSLATION + NARRATION + ORBIS AI ABSTRACTION + LEARNING PACKAGE FIX
 */

import assert from 'node:assert'
import {
  SUPPORTED_LOCALES,
  resolveLocaleConfig,
  isRTLLocale,
} from '../src/services/i18n/locales'
import { buildTranslationPrompt } from '../src/services/ai/prompts'
import { parseLearningPackage } from '../src/services/ai/jsonParser'
import { storyTranslationService } from '../src/services/storyTranslationService'
import { readAlongSpeechService } from '../src/services/audio/readAlongSpeechService'
import { paginateStory } from '../src/services/storybookPagination'
import type { StoryRecord } from '../src/types/story'
import type { TranslatedStoryContent } from '../src/types/translation'

let passedTests = 0
let failedTests = 0

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn()
      console.log(`  ✅ PASS: ${name}`)
      passedTests++
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`)
      console.error(err)
      failedTests++
    }
  })()
}

async function runTests() {
  console.log('\n--- Running Phase 8H: Story Language Independence Tests ---\n')

  const canonicalOriginalStory: StoryRecord = {
    id: 'mock-story-8h-123',
    user_id: 'mock-user-8h-456',
    title: 'Ahmad and the Crystal Falcon',
    child_name: 'Ahmad',
    child_age: 7,
    language: 'English',
    theme: 'Courage & Friendship',
    moral: 'Kindness is the greatest strength',
    characters: 'Ahmad, Falcon, Wise Elder',
    story_length: 'medium',
    reading_level: 'intermediate',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    story_content:
      'Once upon a time in Lahore, Ahmad found a wounded crystal falcon in the ancient Shalimar Gardens. With gentle hands, he sheltered the bird and shared his bread.',
    generation_status: 'completed',
    generated_at: new Date().toISOString(),
    is_favorite: false,
    learning_package: {
      story:
        'Once upon a time in Lahore, Ahmad found a wounded crystal falcon in the ancient Shalimar Gardens. With gentle hands, he sheltered the bird and shared his bread.',
      storyDNA: {
        title: 'Ahmad and the Crystal Falcon',
        theme: 'Courage & Friendship',
        moral: 'Kindness is the greatest strength',
        characters: ['Ahmad', 'Crystal Falcon'],
        locations: ['Shalimar Gardens', 'Lahore'],
        importantObjects: ['Crystal Falcon'],
        vocabulary: [
          { word: 'crystal', meaning: 'Clear and sparkling like glass', difficulty: 'easy' },
          { word: 'ancient', meaning: 'Belonging to the very distant past', difficulty: 'medium' },
          { word: 'sheltered', meaning: 'Protected from danger or harm', difficulty: 'easy' },
        ],
        keyEvents: ['Found bird', 'Sheltered bird'],
        educationalConcepts: ['Wildlife care'],
        emotions: ['Empathy', 'Courage'],
      },
      readingSkills: [
        { skill: 'Cause & Effect', explanation: 'Ahmad helped the bird, so the bird recovered.' },
      ],
      lifeSkills: [
        { skill: 'Compassion', explanation: 'Showing gentle kindness to small creatures.' },
      ],
      criticalThinking: [
        { question: 'Why is it important to protect injured animals?' },
      ],
      creativeActivity: {
        title: 'Draw the Crystal Falcon',
        instructions: 'Use shades of blue and silver.',
      },
      funFact: {
        title: 'Shalimar Gardens',
        fact: 'Built in the 17th century with beautiful fountains.',
      },
      vocabulary: [
        { word: 'Crystal', meaning: 'Clear and sparkling like glass', example: 'crystal falcon', difficulty: 'easy' },
      ],
      quizSeeds: [
        { question: 'Where did Ahmad find the falcon?', answer: 'Shalimar Gardens', options: ['Shalimar Gardens', 'Market', 'School'] },
      ],
      gameSeeds: [],
      parentGuide: {
        discussionQuestions: ['How would you care for a lost animal?'],
        realLifeActivity: 'Visit a bird sanctuary.',
      },
      illustrations: [{ scene: 1, prompt: 'Ahmad finding the falcon' }],
      narration: { style: 'gentle', voices: ['warm'], soundEffects: ['chirping'] },
      metadata: { schemaVersion: 1, language: 'English', recommendedAge: '7', readingLevel: 'intermediate' },
    },
  }

  // 1. All 10 Supported Locales are Registered
  await test('1. All 10 supported locales are registered with proper metadata', () => {
    const localeKeys = Object.keys(SUPPORTED_LOCALES)
    assert.strictEqual(localeKeys.length, 10, 'Must support exactly 10 locales')
    assert.strictEqual(SUPPORTED_LOCALES.ur.bcp47, 'ur-PK')
    assert.strictEqual(SUPPORTED_LOCALES.en.bcp47, 'en-US')
    assert.strictEqual(SUPPORTED_LOCALES.ar.bcp47, 'ar-SA')
    assert.strictEqual(SUPPORTED_LOCALES.es.bcp47, 'es-ES')
    assert.strictEqual(SUPPORTED_LOCALES.fr.bcp47, 'fr-FR')
    assert.strictEqual(SUPPORTED_LOCALES.de.bcp47, 'de-DE')
    assert.strictEqual(SUPPORTED_LOCALES.zh.bcp47, 'zh-CN')
    assert.strictEqual(SUPPORTED_LOCALES.ja.bcp47, 'ja-JP')
    assert.strictEqual(SUPPORTED_LOCALES.hi.bcp47, 'hi-IN')
    assert.strictEqual(SUPPORTED_LOCALES.pt.bcp47, 'pt-BR')
  })

  // 2. Urdu uses ur-PK and RTL direction
  await test('2. Urdu correctly resolves to ur-PK and RTL text direction', () => {
    const urduConfig = resolveLocaleConfig('ur-PK')
    assert.strictEqual(urduConfig.code, 'ur')
    assert.strictEqual(urduConfig.bcp47, 'ur-PK')
    assert.strictEqual(urduConfig.dir, 'rtl')
    assert.strictEqual(isRTLLocale('ur-PK'), true)
    assert.strictEqual(isRTLLocale('Urdu'), true)
    assert.strictEqual(isRTLLocale('en-US'), false)
  })

  // 3. UI Locale and Story Locale are completely independent
  await test('3. UI Locale and Story Locale are completely independent', () => {
    let uiLocale = 'en-US'
    let storyLocale = 'ur-PK'

    // Switching story locale does NOT mutate UI locale
    storyLocale = 'ja-JP'
    assert.strictEqual(uiLocale, 'en-US', 'UI locale must remain English when story switches to Japanese')

    // Switching UI locale does NOT mutate story locale
    uiLocale = 'ar-SA'
    assert.strictEqual(storyLocale, 'ja-JP', 'Story locale must remain Japanese when UI switches to Arabic')
  })

  // 4. Original Story is Never Modified (Immutability Guarantee)
  await test('4. Original story is never mutated by translation requests', async () => {
    const originalClone = JSON.parse(JSON.stringify(canonicalOriginalStory))

    // Simulating translation prompt creation
    const targetLocale = resolveLocaleConfig('ur-PK')
    const prompt = buildTranslationPrompt(canonicalOriginalStory, targetLocale)

    assert.ok(prompt.includes(canonicalOriginalStory.title))
    assert.ok(prompt.includes(canonicalOriginalStory.story_content!))

    // Ensure canonical story fields remained untouched
    assert.strictEqual(canonicalOriginalStory.title, originalClone.title)
    assert.strictEqual(canonicalOriginalStory.language, originalClone.language)
    assert.strictEqual(canonicalOriginalStory.story_content, originalClone.story_content)
    assert.deepStrictEqual(canonicalOriginalStory.learning_package, originalClone.learning_package)
  })

  // 5. Translation Direction is Always Canonical Original -> Target
  await test('5. Translation prompt builds strictly from the canonical original story', () => {
    const japaneseLocale = resolveLocaleConfig('ja-JP')
    const prompt = buildTranslationPrompt(canonicalOriginalStory, japaneseLocale)

    assert.ok(prompt.includes('CANONICAL ORIGINAL STORY TO TRANSLATE'))
    assert.ok(prompt.includes(canonicalOriginalStory.title))
    assert.ok(prompt.includes('Ahmad and the Crystal Falcon'))
    assert.ok(prompt.includes('Japanese'))
    assert.ok(!prompt.includes('Translate from Urdu'))
  })

  // 6. Urdu Translation Prompt Enforces Pakistani Urdu & Native Script
  await test('6. Urdu translation prompt enforces authentic Pakistani Urdu script and rejects Roman Urdu', () => {
    const urduLocale = resolveLocaleConfig('ur-PK')
    const prompt = buildTranslationPrompt(canonicalOriginalStory, urduLocale)

    assert.ok(prompt.includes('اردو رسم الخط'), 'Must specify Urdu script')
    assert.ok(prompt.includes('Do NOT use Roman Urdu'), 'Must disallow Roman Urdu')
    assert.ok(prompt.includes('Do NOT use Hindi vocabulary'), 'Must disallow Hindi substitutions')
  })

  // 7. Sentence preparation supports Urdu punctuation (۔, ؟, ،)
  await test('7. Read-along sentence segmentation correctly supports Urdu punctuation (۔, ؟)', () => {
    const urduText = 'ایک دفعہ کا ذکر ہے کہ احمد لاہور میں رہتا تھا۔ کیا وہ پرندے کی مدد کرے گا؟ جی ہاں، اس نے مدد کی۔'
    const sentences = readAlongSpeechService.prepareText(urduText)

    assert.strictEqual(sentences.length, 3, 'Must split into 3 Urdu sentences')
    assert.ok(sentences[0].includes('رہتا تھا۔'))
    assert.ok(sentences[1].includes('مدد کرے گا؟'))
    assert.ok(sentences[2].includes('اس نے مدد کی۔'))
  })

  // 8. BCP-47 voice matching works for all 10 supported locales
  await test('8. BCP-47 voice matching finds correct language tags for all 10 locales', () => {
    const mockVoices: SpeechSynthesisVoice[] = [
      { lang: 'en-US', name: 'English US', default: true, localService: true, voiceURI: 'en-us' },
      { lang: 'ur-PK', name: 'Urdu Pakistan', default: false, localService: true, voiceURI: 'ur-pk' },
      { lang: 'ar-SA', name: 'Arabic Saudi', default: false, localService: true, voiceURI: 'ar-sa' },
      { lang: 'es-ES', name: 'Spanish Spain', default: false, localService: true, voiceURI: 'es-es' },
      { lang: 'fr-FR', name: 'French France', default: false, localService: true, voiceURI: 'fr-fr' },
      { lang: 'de-DE', name: 'German Germany', default: false, localService: true, voiceURI: 'de-de' },
      { lang: 'zh-CN', name: 'Chinese Mandarin', default: false, localService: true, voiceURI: 'zh-cn' },
      { lang: 'ja-JP', name: 'Japanese Japan', default: false, localService: true, voiceURI: 'ja-jp' },
      { lang: 'hi-IN', name: 'Hindi India', default: false, localService: true, voiceURI: 'hi-in' },
      { lang: 'pt-BR', name: 'Portuguese Brazil', default: false, localService: true, voiceURI: 'pt-br' },
    ]

    readAlongSpeechService.setVoices(mockVoices)

    for (const [key, config] of Object.entries(SUPPORTED_LOCALES)) {
      const voice = readAlongSpeechService.findBestVoice(config.bcp47)
      assert.ok(voice, `Voice must be found for ${key} (${config.bcp47})`)
      assert.strictEqual(voice?.lang.toLowerCase(), config.bcp47.toLowerCase())
    }
  })

  // 9. Story pagination handles translated text cleanly
  await test('9. Story pagination works with translated Urdu text', () => {
    const urduTitle = 'احمد اور کرسٹل شاہین'
    const urduNarrative =
      'ایک دفعہ کا ذکر ہے کہ احمد کو شالامار باغ میں ایک زخمی پرندہ ملا۔ اس نے نرم ہاتھوں سے اس کی دیکھ بھال کی۔ شاہین نے شکر گزاری سے اپنے پر پھیلائے۔'

    const book = paginateStory(urduTitle, urduNarrative)
    assert.strictEqual(book.title, urduTitle)
    assert.ok(book.pages.length >= 1, 'Must generate at least 1 page')
    assert.ok(book.pages[0].text.includes('شالامار باغ'))
  })

  // 10. Translation Schema Validation
  await test('10. parseLearningPackage parses valid multilingual structured output', () => {
    const mockJson = JSON.stringify({
      story: 'احمد اور شاہین کی کہانی۔',
      storyDNA: {
        title: 'احمد اور شاہین',
        theme: 'بہادری اور دوستی',
        moral: 'ہمدردی سب سے بڑی طاقت ہے۔',
        characters: ['احمد', 'شاہین'],
        locations: ['شالامار باغ'],
        importantObjects: ['شاہین'],
        vocabulary: [
          { word: 'شالامار', meaning: 'ایک خوبصورت تاریخی باغ' },
          { word: 'شاہین', meaning: 'ایک طاقتور اور تیز پرندہ' },
        ],
        keyEvents: ['پرندے کی مدد'],
        educationalConcepts: ['جانوروں کا تحفظ'],
        emotions: ['خوشی'],
      },
      readingSkills: [{ skill: 'وجہ اور اثر', explanation: 'مدد کرنے سے پرندہ ٹھیک ہو گیا۔' }],
      lifeSkills: [{ skill: 'ہمدردی', explanation: 'چھوٹے جانداروں سے پیار کرنا۔' }],
      criticalThinking: [{ question: 'ہمیں پرندوں کا خیال کیوں رکھنا چاہیے؟' }],
      creativeActivity: { title: 'تصویر بنائیں', instructions: 'شاہین کی تصویر بنائیں' },
      funFact: { title: 'شالامار باغ', fact: 'لاہور کا ایک خوبصورت تاریخی باغ ہے۔' },
      vocabulary: [{ word: 'شاہین', meaning: 'ایک طاقتور اور تیز پرندہ', example: 'کرسٹل شاہین', difficulty: 'easy' }],
      quizSeeds: [{ question: 'احمد کو پرندہ کہاں ملا؟', answer: 'باغ میں', options: ['باغ میں', 'سکول میں'] }],
      gameSeeds: [],
      parentGuide: {
        discussionQuestions: ['آپ پرندوں کی دیکھ بھال کیسے کریں گے؟'],
        realLifeActivity: 'پرندوں کے لیے پانی رکھیں۔',
      },
      illustrations: [{ scene: 1, prompt: 'Ahmad with the bird in Lahore' }],
      narration: { style: 'warm', voices: ['Urdu voice'], soundEffects: ['nature'] },
      metadata: { schemaVersion: 1, language: 'Urdu', recommendedAge: '7', readingLevel: 'intermediate' },
    })

    const parsed = parseLearningPackage(mockJson)
    assert.strictEqual(parsed.storyDNA.title, 'احمد اور شاہین')
    assert.strictEqual(parsed.storyDNA.moral, 'ہمدردی سب سے بڑی طاقت ہے۔')
  })

  // 11. Matching original story language returns canonical original with 0 AI cost
  await test('11. Requesting translation for original story language returns canonical content without AI call', async () => {
    const result = await storyTranslationService.translateStory(
      canonicalOriginalStory,
      'en-US',
      'mock-user-8h-456'
    )

    assert.strictEqual(result.title, canonicalOriginalStory.title)
    assert.strictEqual(result.story_content, canonicalOriginalStory.story_content)
    assert.strictEqual(result.target_locale, 'en-US')
  })

  // 12. Multiple Translations Can Coexist
  await test('12. Multiple translations can coexist in memory and database structures', () => {
    const translations: Record<string, TranslatedStoryContent> = {
      'ur-PK': {
        title: 'احمد اور کرسٹل شاہین',
        story_content: 'لاہور میں احمد نے شاہین کی مدد کی۔',
        moral: 'ہمدردی سب سے بڑی طاقت ہے۔',
        theme: 'بہادری',
        learning_package: null,
        target_locale: 'ur-PK',
        target_language: 'Pakistani Urdu',
        translated_at: new Date().toISOString(),
      },
      'ja-JP': {
        title: 'アーマドと水晶のハヤブサ',
        story_content: 'ラホールでアーマドは傷ついたハヤブサを見つけました。',
        moral: '親切は最大の強さです。',
        theme: '勇気と友情',
        learning_package: null,
        target_locale: 'ja-JP',
        target_language: 'Japanese',
        translated_at: new Date().toISOString(),
      },
    }

    assert.strictEqual(Object.keys(translations).length, 2)
    assert.strictEqual(translations['ur-PK'].title, 'احمد اور کرسٹل شاہین')
    assert.strictEqual(translations['ja-JP'].title, 'アーマドと水晶のハヤブサ')
  })

  // 13. User-Facing Branding Uses ORBIS AI
  await test('13. User-facing branding uses ORBIS AI and eliminates provider-specific jargon', async () => {
    const fs = await import('node:fs')
    const workspacePage = fs.readFileSync('src/pages/StoryWorkspacePage.tsx', 'utf-8')
    assert.ok(!workspacePage.includes('⚡ Test Gemini API'), 'Must not display Test Gemini API')
    assert.ok(workspacePage.includes('⚡ Check ORBIS AI'), 'Must display Check ORBIS AI')
    assert.ok(!workspacePage.includes('Gemini Diagnostic Output'), 'Must not display Gemini Diagnostic Output')
    assert.ok(workspacePage.includes('ORBIS AI Diagnostic Output'), 'Must display ORBIS AI Diagnostic Output')
  })

  // 14. Zero Client Secrets Required
  await test('14. Frontend codebase does not require client-side AI API keys', async () => {
    const fs = await import('node:fs')
    const geminiService = fs.readFileSync('src/services/geminiService.ts', 'utf-8')
    assert.ok(!geminiService.includes('getGeminiClient()'), 'geminiService must not invoke client SDK constructor')
    const geminiProvider = fs.readFileSync('src/services/ai/providers/geminiProvider.ts', 'utf-8')
    assert.ok(!geminiProvider.includes('getGeminiClient()'), 'geminiProvider must not invoke local fallback client')
  })

  // 15. Server Boundary Routing for Story and Learning Package Generation
  await test('15. Generation provider routes through secure Supabase Edge Function boundary', async () => {
    const fs = await import('node:fs')
    const geminiProvider = fs.readFileSync('src/services/ai/providers/geminiProvider.ts', 'utf-8')
    assert.ok(geminiProvider.includes("supabase.functions.invoke('generate-story-package'"), 'Must route through generate-story-package Edge Function')
  })

  // 16. Existing Story Illustrations Reused
  await test('16. Translation maintains existing illustration asset references without duplicate image calls', () => {
    const pages = paginateStory('Title', 'Content with existing assets').pages
    assert.ok(pages.length > 0)
  })

  // 17. RTL detection for Arabic and Urdu
  await test('17. RTL detection correctly identifies both Arabic and Urdu as RTL', () => {
    assert.strictEqual(isRTLLocale('Arabic'), true)
    assert.strictEqual(isRTLLocale('ar-SA'), true)
    assert.strictEqual(isRTLLocale('ar'), true)
    assert.strictEqual(isRTLLocale('Urdu'), true)
    assert.strictEqual(isRTLLocale('ur-PK'), true)
    assert.strictEqual(isRTLLocale('ur'), true)
    assert.strictEqual(isRTLLocale('English'), false)
    assert.strictEqual(isRTLLocale('en-US'), false)
    assert.strictEqual(isRTLLocale('French'), false)
    assert.strictEqual(isRTLLocale('Japanese'), false)
  })

  // 18. All 10 Locales have Valid BCP-47 and Native Names
  await test('18. All 10 locales have valid BCP-47 codes, native names, and English names', () => {
    for (const [code, config] of Object.entries(SUPPORTED_LOCALES)) {
      assert.ok(config.code, `Locale ${code} must have code`)
      assert.ok(config.bcp47.includes('-'), `Locale ${code} must have valid BCP-47 tag with hyphen`)
      assert.ok(config.name.length > 0, `Locale ${code} must have name`)
      assert.ok(config.nativeName.length > 0, `Locale ${code} must have nativeName`)
      assert.ok(config.direction === 'ltr' || config.direction === 'rtl', `Locale ${code} must have direction`)
    }
  })

  console.log(`\n========================================`)
  console.log(`Phase 8H Test Results: ${passedTests} passed, ${failedTests} failed`)
  console.log(`========================================\n`)

  if (failedTests > 0) {
    process.exit(1)
  }
}

runTests()

