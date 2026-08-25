/**
 * Comprehensive Verification Test Suite for Parent Intelligence Hub & Audio Narration Layer
 * Tests:
 * 1. Parent PIN Security (hashing, lockout, retry limits, math challenge recovery)
 * 2. Curfew & Screen-Time Tracking (domain distribution, limits, bedtime wind-down event)
 * 3. Diploma & Certificate Generator (SVG vector generation across all 4 themes, child metrics)
 * 4. Native Speech Narration Engine (presets, normalization, chunking, voice matching, events)
 */

import { parentPinService } from '../src/services/parentPinService'
import { curfewService } from '../src/services/curfewService'
import { certificateGenerator } from '../src/services/certificateGenerator'
import type { CertificateTheme } from '../src/services/certificateGenerator'
import { speechService, SPEECH_PRESETS } from '../src/services/audio/speechService'
import type { SpeechVoicePreset } from '../src/services/audio/speechService'
import { calculateAdventureProgress } from '../src/services/progressionService'

// Simple mock for localStorage and window events in Node.js
class MockLocalStorage {
  private store: Record<string, string> = {}

  getItem(key: string): string | null {
    return this.store[key] !== undefined ? this.store[key] : null
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value)
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  clear(): void {
    this.store = {}
  }
}

// Setup Node test environment globals
const mockStorage = new MockLocalStorage()
const eventListeners: Record<string, Function[]> = {}

;(globalThis as any).window = {
  localStorage: mockStorage,
  addEventListener: (event: string, cb: Function) => {
    if (!eventListeners[event]) eventListeners[event] = []
    eventListeners[event].push(cb)
  },
  removeEventListener: (event: string, cb: Function) => {
    if (eventListeners[event]) {
      eventListeners[event] = eventListeners[event].filter((f) => f !== cb)
    }
  },
  dispatchEvent: (event: any) => {
    const handlers = eventListeners[event.type] || []
    handlers.forEach((h) => h(event))
    return true
  },
}
;(globalThis as any).localStorage = mockStorage
;(globalThis as any).CustomEvent = class CustomEvent {
  type: string
  detail: any
  constructor(type: string, params?: { detail?: any }) {
    this.type = type
    this.detail = params?.detail
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

console.log('==================================================================')
console.log('👨‍👩‍👧 RUNNING PARENT INTELLIGENCE HUB & AUDIO NARRATION TEST SUITE')
console.log('==================================================================\n')

let totalTests = 0
let passedTests = 0

function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++
  try {
    fn()
    console.log(`  ✅ ${name}`)
    passedTests++
  } catch (err: any) {
    console.error(`  ❌ ${name}: ${err.message}`)
    throw err
  }
}

// -----------------------------------------------------------------------------
// TEST SUITE 1: PARENT PIN SECURITY & LOCKOUT PROTECTION
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 1: Parent PIN Security & Lockout Protection ---')

runTest('Initial state should report no PIN set when storage is empty', () => {
  mockStorage.clear()
  assert(parentPinService.isPinSet() === false, 'PIN should not be set initially')
})

runTest('Should reject non-4-digit PINs during setup', () => {
  const invalid1 = parentPinService.setPin('123')
  assert(invalid1.success === false, 'Should reject 3-digit PIN')

  const invalid2 = parentPinService.setPin('12345')
  assert(invalid2.success === false, 'Should reject 5-digit PIN')

  const invalid3 = parentPinService.setPin('abcd')
  assert(invalid3.success === false, 'Should reject non-numeric PIN')
})

runTest('Should set and verify valid 4-digit PIN', () => {
  const setResult = parentPinService.setPin('2468')
  assert(setResult.success === true, 'Setting valid PIN should succeed')
  assert(parentPinService.isPinSet() === true, 'isPinSet should return true')

  const verifyResult = parentPinService.verifyPin('2468')
  assert(verifyResult.success === true, 'Verifying correct PIN should succeed')
  assert(parentPinService.isSessionActive() === true, 'Session should be active after correct PIN')
})

runTest('Should reject wrong PIN and track remaining attempts', () => {
  parentPinService.setPin('1234')
  parentPinService.lockSession()
  assert(parentPinService.isSessionActive() === false, 'Session should be locked')

  const wrongResult = parentPinService.verifyPin('9999')
  assert(wrongResult.success === false, 'Wrong PIN should fail')
  assert(wrongResult.error!.includes('attempts remaining'), 'Error should specify remaining attempts')
})

runTest('Should trigger 30-second lockout after 5 failed attempts', () => {
  mockStorage.clear()
  parentPinService.setPin('1111')
  parentPinService.lockSession()

  // Attempt 1 to 4
  for (let i = 1; i <= 4; i++) {
    const res = parentPinService.verifyPin('0000')
    assert(res.success === false, `Attempt ${i} should fail`)
  }

  // Attempt 5 -> triggers lockout
  const lockoutRes = parentPinService.verifyPin('0000')
  assert(lockoutRes.success === false, 'Attempt 5 should fail and trigger lockout')
  assert(lockoutRes.lockoutRemainingSeconds! > 0, 'Should have positive lockout remaining seconds')
  assert(parentPinService.getLockoutRemainingSeconds() > 0, 'Service should report lockout active')

  // Attempt during lockout should be rejected immediately
  const duringLockout = parentPinService.verifyPin('1111')
  assert(duringLockout.success === false, 'Should reject correct PIN while locked out')
  assert(duringLockout.error!.includes('Too many failed attempts'), 'Should explain lockout reason')
})

runTest('Should generate and verify parent math challenge for emergency recovery', () => {
  const challenge = parentPinService.generateMathChallenge()
  assert(Boolean(challenge.question), 'Challenge question should exist')
  assert(typeof challenge.answer === 'number', 'Challenge answer should be a number')

  // Verify wrong answer
  const wrongRes = parentPinService.verifyMathChallenge(challenge.answer + 999, challenge.answer)
  assert(wrongRes === false, 'Wrong math answer should fail')

  // Verify correct answer
  const correctRes = parentPinService.verifyMathChallenge(challenge.answer, challenge.answer)
  assert(correctRes === true, 'Correct math answer should succeed')
  assert(parentPinService.isSessionActive() === true, 'Math challenge should grant active session')
})

// -----------------------------------------------------------------------------
// TEST SUITE 2: COGNITIVE SCREEN-TIME & CURFEW SERVICE
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Curfew & Cognitive Screen-Time Tracking ---')

runTest('Should return default curfew settings and allow updates', () => {
  mockStorage.clear()
  const defaults = curfewService.getSettings()
  assert(defaults.dailyLimitMinutes === 45, 'Default limit should be 45m')
  assert(defaults.bedtimeHour === 20, 'Default bedtime should be 20:30')

  const updated = curfewService.updateSettings({ dailyLimitMinutes: 30, bedtimeHour: 21, bedtimeMinute: 0 })
  assert(updated.dailyLimitMinutes === 30, 'Updated limit should be 30m')
  assert(updated.bedtimeHour === 21, 'Updated bedtime should be 21:00')
})

runTest('Should record screen-time across cognitive domains and compute breakdown', () => {
  mockStorage.clear()
  const childId = 'child_test_123'

  // Record 10 minutes reading, 15 minutes logic, 10 minutes creativity, 5 minutes science
  curfewService.recordScreenTime(childId, 'reading', 10 * 60)
  curfewService.recordScreenTime(childId, 'logic', 15 * 60)
  curfewService.recordScreenTime(childId, 'creativity', 10 * 60)
  curfewService.recordScreenTime(childId, 'science', 5 * 60)

  const breakdown = curfewService.getCognitiveScreenTime(childId)
  assert(breakdown.readingMinutes === 10, 'Reading should be 10 minutes')
  assert(breakdown.logicPhysicsMinutes === 15, 'Logic should be 15 minutes')
  assert(breakdown.creativityMinutes === 10, 'Creativity should be 10 minutes')
  assert(breakdown.scienceMinutes === 5, 'Science should be 5 minutes')
  assert(breakdown.totalMinutes === 40, 'Total screen time should be 40 minutes')
})

runTest('Should calculate curfew status and detect time expiration', () => {
  curfewService.updateSettings({ dailyLimitMinutes: 35, isCurfewEnabled: true })
  const status = curfewService.getCurfewStatus('child_test_123')

  // Total used is 40m, limit is 35m -> time expired
  assert(status.isTimeExpired === true, 'Time limit should be expired')
  assert(status.isWindDownActive === true, 'Wind-down should be active')
  assert(status.remainingMinutes === 0, 'Remaining minutes should be 0')
})

runTest('Should allow parent to grant extra bonus time', () => {
  curfewService.grantExtraTime(15)
  const statusAfterBonus = curfewService.getCurfewStatus('child_test_123')
  assert(statusAfterBonus.isWindDownActive === false, 'Wind-down should be inactive after bonus')
})

runTest('Should dispatch bedtime wind-down event on trigger', () => {
  let eventFired = false
  const listener = () => {
    eventFired = true
  }
  window.addEventListener('orbis:bedtime_wind_down', listener)

  curfewService.triggerBedtimeWindDown()
  assert(Boolean(eventFired), 'orbis:bedtime_wind_down event should fire')

  window.removeEventListener('orbis:bedtime_wind_down', listener)
})

// -----------------------------------------------------------------------------
// TEST SUITE 3: DIPLOMA & CERTIFICATE GENERATOR
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Diploma & Certificate Generator ---')

const certificateThemes: CertificateTheme[] = ['cosmic_master', 'alchemist', 'scientist', 'story_weaver']

certificateThemes.forEach((theme) => {
  runTest(`Should generate valid SVG diploma for theme "${theme}"`, () => {
    const svg = certificateGenerator.generateCertificateSvg({
      childName: 'Aria the Starlight Seeker',
      explorerTitle: 'Grand Master of the Cosmos',
      level: 5,
      xp: 650,
      stars: 42,
      unlockedDossiersCount: 28,
      theme,
      customMessage: 'Awarded for extraordinary imagination and brilliance in STEM!',
      dateString: 'August 25, 2026',
      masteredStations: ['🧪 Creature Lab', '⚙️ Magic Machine', '🔍 Mystery Detective', '⚖️ Potion Market'],
    })

    assert(svg.startsWith('<svg'), 'Output should start with <svg tag')
    assert(svg.endsWith('</svg>'), 'Output should end with </svg> tag')
    assert(svg.includes('Aria the Starlight Seeker'), 'SVG should contain child name')
    assert(svg.includes('Grand Master of the Cosmos'), 'SVG should contain explorer title')
    assert(svg.includes('650 XP'), 'SVG should contain XP count')
    assert(svg.includes('28 Dossiers'), 'SVG should contain dossiers count')
    assert(svg.includes('Orby the Star Sprite'), 'SVG should contain mascot signature')
    assert(svg.includes('ORBIS ACADEMY'), 'SVG should contain academy header')
    assert(svg.includes('VERIFIED'), 'SVG should contain seal verification')
  })
})

runTest('Should generate certificate options from ChildAdventureProgress', () => {
  const mockChild: any = {
    id: 'child_1',
    name: 'Leo',
    avatar: '🦁',
    xp: 520,
    stars: 35,
    current_streak: 7,
  }
  const progress = calculateAdventureProgress(mockChild, {
    creatureDiscoveriesCount: 12,
    machineCompletedCount: 8,
    detectiveSolvedCount: 6,
    potionBrewedCount: 10,
  })

  const certOptions = certificateGenerator.fromProgress(progress, 'scientist')
  assert(certOptions.childName === 'Leo', 'Child name should match')
  assert(certOptions.level === 5, 'Level should match computed title level')
  assert(certOptions.xp === 520, 'XP should match')
  assert(certOptions.unlockedDossiersCount === 36, 'Unlocked dossiers count should match sum of stations')
  assert(certOptions.masteredStations!.length === 4, 'All 4 stations should be listed')

  const svg = certificateGenerator.generateCertificateSvg(certOptions)
  assert(svg.includes('Leo'), 'SVG should contain Leo')
  assert(svg.includes('520 XP'), 'SVG should contain 520 XP')
})

// -----------------------------------------------------------------------------
// TEST SUITE 4: NATIVE SPEECH NARRATION ENGINE (speechService)
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Native Speech Narration Engine ---')

runTest('Should define 4 child-friendly voice presets with valid parameters', () => {
  const presets: SpeechVoicePreset[] = ['ORBY_SPRITE', 'STORYTELLER_WARM', 'BEDTIME_CALM', 'EXPLORER_ENERGETIC']
  presets.forEach((preset) => {
    const config = SPEECH_PRESETS[preset]
    assert(Boolean(config), `Preset ${preset} must exist in SPEECH_PRESETS`)
    assert(config.pitch > 0 && config.pitch <= 2.0, `Preset ${preset} pitch must be within 0-2.0`)
    assert(config.rate > 0 && config.rate <= 2.0, `Preset ${preset} rate must be within 0-2.0`)
    assert(config.volume > 0 && config.volume <= 1.0, `Preset ${preset} volume must be within 0-1.0`)
    assert(config.preferredVoiceKeywords.length > 0, `Preset ${preset} should define preferred voice keywords`)
  })
})

runTest('Should switch and retain active preset', () => {
  speechService.setPreset('BEDTIME_CALM')
  assert(speechService.getActivePreset() === 'BEDTIME_CALM', 'Active preset should be BEDTIME_CALM')

  speechService.setPreset('ORBY_SPRITE')
  assert(speechService.getActivePreset() === 'ORBY_SPRITE', 'Active preset should be ORBY_SPRITE')
})

runTest('Should normalize markdown and special formatting characters', () => {
  const rawText = 'Welcome to **Creature Lab**! Tap *here* to see # Amazing Secrets • Sparkle 1 • Sparkle 2.'
  const normalized = speechService.normalizeText(rawText)
  assert(!normalized.includes('**'), 'Should strip bold markdown')
  assert(!normalized.includes('*'), 'Should strip italic markdown')
  assert(!normalized.includes('#'), 'Should strip header markdown')
  assert(normalized.includes('Creature Lab'), 'Should retain plain text words')
})

runTest('Should chunk text into sentences under 180 chars for synthesis stability', () => {
  const longStory =
    'Once upon a time in the magical kingdom of ORBis, a young star sprite named Orby danced across the luminous sky! ' +
    'Orby loved collecting sparkling stardust and discovering ancient alchemical secrets in the deep cosmic forest. ' +
    'One sunny morning, a mysterious sound echoed through the Enchanted Woods, calling every explorer to a new adventure.'

  const chunks = speechService.chunkText(longStory)
  assert(chunks.length === 3, `Should split into 3 sentence chunks, got ${chunks.length}`)
  chunks.forEach((chunk, i) => {
    assert(chunk.length <= 180, `Chunk ${i} length ${chunk.length} should be <= 180 chars`)
  })
})

runTest('Should match voices with language priority and preset keywords', () => {
  const mockVoices: any[] = [
    { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', default: false },
    { name: 'Google Samantha Natural Female', lang: 'en-US', default: false },
    { name: 'Google US English', lang: 'en-US', default: true },
    { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', default: false },
    { name: 'Google Arabic Voice', lang: 'ar-SA', default: false },
    { name: 'Google Spanish', lang: 'es-ES', default: false },
  ]

  speechService.setVoices(mockVoices)

  // 1. Orby Sprite prefers 'samantha' / 'female' / 'natural'
  const orbyVoice = speechService.findBestVoice('en-US', 'ORBY_SPRITE')
  assert(orbyVoice !== null, 'Should find voice for en-US')
  assert(orbyVoice!.name.includes('Samantha'), `Orby voice should prioritize Samantha, got ${orbyVoice!.name}`)

  // 2. Multilingual matching (Arabic)
  const arabicVoice = speechService.findBestVoice('ar-SA', 'STORYTELLER_WARM')
  assert(arabicVoice !== null, 'Should find Arabic voice')
  assert(arabicVoice!.lang === 'ar-SA', 'Should match Arabic language')

  // 3. Spanish matching
  const spanishVoice = speechService.findBestVoice('es', 'EXPLORER_ENERGETIC')
  assert(spanishVoice !== null, 'Should find Spanish voice by prefix')
  assert(spanishVoice!.lang === 'es-ES', 'Should match Spanish voice')
})

console.log('\n==================================================================')
console.log(`🏆 ALL ${passedTests}/${totalTests} PARENT HUB & AUDIO NARRATION TESTS PASSED`)
console.log('==================================================================\n')
