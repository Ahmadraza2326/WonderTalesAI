import fs from 'fs'
import path from 'path'

const API_KEY = process.env.GCP_API_KEY
if (!API_KEY) {
  console.error("Error: Please set GCP_API_KEY environment variable.")
  process.exit(1)
}

const LANGUAGES = [
  { 
    code: 'en-US', name: 'English', 
    text: 'Hello, welcome to our magical story. This is the second sentence of our tale. And here is the final sentence.', 
    ssml: '<speak><mark name="sentence-1"/>Hello, welcome to our magical story. <mark name="sentence-2"/>This is the second sentence of our tale. <mark name="sentence-3"/>And here is the final sentence.<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'ar-SA', name: 'Arabic', 
    text: 'مرحباً بك في قصتنا السحرية. هذه هي الجملة الثانية من حكايتنا. وها هي الجملة الأخيرة.', 
    ssml: '<speak><mark name="sentence-1"/>مرحباً بك في قصتنا السحرية. <mark name="sentence-2"/>هذه هي الجملة الثانية من حكايتنا. <mark name="sentence-3"/>وها هي الجملة الأخيرة.<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'es-ES', name: 'Spanish', 
    text: 'Hola, bienvenido a nuestra historia mágica. Esta es la segunda frase de nuestro cuento. Y aquí está la frase final.',
    ssml: '<speak><mark name="sentence-1"/>Hola, bienvenido a nuestra historia mágica. <mark name="sentence-2"/>Esta es la segunda frase de nuestro cuento. <mark name="sentence-3"/>Y aquí está la frase final.<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'fr-FR', name: 'French', 
    text: 'Bonjour, bienvenue dans notre histoire magique. Voici la deuxième phrase de notre conte. Et voici la phrase finale.',
    ssml: '<speak><mark name="sentence-1"/>Bonjour, bienvenue dans notre histoire magique. <mark name="sentence-2"/>Voici la deuxième phrase de notre conte. <mark name="sentence-3"/>Et voici la phrase finale.<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'de-DE', name: 'German', 
    text: 'Hallo, willkommen in unserer magischen Geschichte. Dies ist der zweite Satz unseres Märchens. Und hier ist der letzte Satz.',
    ssml: '<speak><mark name="sentence-1"/>Hallo, willkommen in unserer magischen Geschichte. <mark name="sentence-2"/>Dies ist der zweite Satz unseres Märchens. <mark name="sentence-3"/>Und hier ist der letzte Satz.<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'cmn-CN', name: 'Mandarin', 
    text: '你好，欢迎来到我们神奇的故事。这是我们故事的第二句。最后一句在这里。',
    ssml: '<speak><mark name="sentence-1"/>你好，欢迎来到我们神奇的故事。<mark name="sentence-2"/>这是我们故事的第二句。<mark name="sentence-3"/>最后一句在这里。<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'ja-JP', name: 'Japanese', 
    text: 'こんにちは、私たちの魔法の物語へようこそ。これが私たちの物語の2番目の文です。そして、これが最後の文です。',
    ssml: '<speak><mark name="sentence-1"/>こんにちは、私たちの魔法の物語へようこそ。<mark name="sentence-2"/>これが私たちの物語の2番目の文です。<mark name="sentence-3"/>そして、これが最後の文です。<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'hi-IN', name: 'Hindi', 
    text: 'नमस्ते, हमारी जादुई कहानी में आपका स्वागत है। यह हमारी कहानी का दूसरा वाक्य है। और यह अंतिम वाक्य है।',
    ssml: '<speak><mark name="sentence-1"/>नमस्ते, हमारी जादुई कहानी में आपका स्वागत है। <mark name="sentence-2"/>यह हमारी कहानी का दूसरा वाक्य है। <mark name="sentence-3"/>और यह अंतिम वाक्य है。<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'pt-BR', name: 'Portuguese', 
    text: 'Olá, bem-vindo à nossa história mágica. Esta é a segunda frase do nosso conto. E aqui está a frase final.',
    ssml: '<speak><mark name="sentence-1"/>Olá, bem-vindo à nossa história mágica. <mark name="sentence-2"/>Esta é a segunda frase do nosso conto. <mark name="sentence-3"/>E aqui está a frase final.<mark name="sentence-END"/></speak>'
  },
  { 
    code: 'ur-PK', name: 'Urdu', 
    text: 'ہیلو، ہماری جادوئی کہانی میں خوش آمدید۔ یہ ہماری کہانی کا دوسرا جملہ ہے۔ اور یہ آخری جملہ ہے۔',
    ssml: '<speak><mark name="sentence-1"/>ہیلو، ہماری جادوئی کہانی میں خوش آمدید۔ <mark name="sentence-2"/>یہ ہماری کہانی کا دوسرا جملہ ہے۔ <mark name="sentence-3"/>اور یہ آخری جملہ ہے۔<mark name="sentence-END"/></speak>'
  }
]

async function getAvailableVoice(languageCode: string): Promise<string | null> {
  const url = `https://texttospeech.googleapis.com/v1/voices?key=${API_KEY}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.statusText}`)
  }
  const data = await response.json()
  const voices = data.voices.filter((v: any) => v.languageCodes.includes(languageCode))
  
  if (voices.length === 0) return null

  // Prefer Neural2 -> Wavenet -> Standard
  const neural2 = voices.find((v: any) => v.name.includes('Neural2'))
  if (neural2) return neural2.name
  
  const wavenet = voices.find((v: any) => v.name.includes('Wavenet'))
  if (wavenet) return wavenet.name

  return voices[0].name
}

async function runTests() {
  console.log('| Language | Locale | Voice | HTTP | Audio | Duration | Timing | Quality | Result |')
  console.log('|---|---|---|---:|---|---:|---|---|---|')

  for (const lang of LANGUAGES) {
    try {
      // Find voice
      let voiceName = await getAvailableVoice(lang.code)
      if (!voiceName && lang.code === 'ur-PK') {
         // Fallback for ur-PK if Google uses ur-IN internally
         voiceName = await getAvailableVoice('ur-IN')
      }

      if (!voiceName) {
        console.log(`| ${lang.name} | None Found | N/A | N/A | N/A | N/A | Unknown | FAIL |`)
        continue
      }

      // Synthesize
      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`
      
      const payload = {
        input: { ssml: lang.ssml },
        voice: { languageCode: lang.code, name: voiceName },
        audioConfig: { audioEncoding: 'MP3' },
        enableTimePointing: ['SSML_MARK']
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        await response.json()
        console.log(`| ${lang.name} | ${lang.code} | ${voiceName} | FAIL (${response.status}) | No | N/A | N/A | Unknown | FAIL |`)
        continue
      }

      const data = await response.json()
      
      const hasAudio = !!data.audioContent
      const timepoints = data.timepoints || []
      const hasTimepoints = timepoints.length > 0
      
      const hasEnd = timepoints.find((t: any) => t.markName === 'sentence-END')
      
      const tpFormatted = timepoints.map((t: any) => `${t.markName}:${t.timeSeconds}s`).join(', ')
      const durationEst = hasEnd ? `${hasEnd.timeSeconds}s` : 'Unknown'
      
      const result = (hasAudio && hasTimepoints) ? 'PASS' : 'FAIL'

      console.log(`| ${lang.name} | ${lang.code} | ${voiceName} | OK | YES | ${durationEst} | ${tpFormatted} | Needs manual verify | ${result} |`)
      
      // Save output to test dir
      if (hasAudio) {
         const outDir = path.join(process.cwd(), 'scratch', 'tts-test')
         if (!fs.existsSync(outDir)) {
             fs.mkdirSync(outDir, { recursive: true })
         }
         const outPath = path.join(outDir, `${lang.code}.mp3`)
         fs.writeFileSync(outPath, Buffer.from(data.audioContent, 'base64'))
      }

    } catch (_err: any) {
      console.log(`| ${lang.name} | Error | N/A | N/A | N/A | N/A | Unknown | FAIL (${_err.message}) |`)
    }
  }
}

runTests()
