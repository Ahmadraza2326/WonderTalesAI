import { config } from 'dotenv'

config({ path: '.env' })

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error("No GEMINI_API_KEY found in .env")
  process.exit(1)
}

const MODELS = [
  "gemini-3.1-flash-tts-preview",
  "gemini-2.5-flash-preview-tts"
]

const TEST_CASES = [
  { lang: "English", text: "Hello, this is a test of the English TTS model.", voiceName: "Puck" },
  { lang: "Urdu", text: "یہ اردو ٹی ٹی ایس ماڈل کا ایک ٹیسٹ ہے۔", voiceName: "Puck" },
  { lang: "Arabic", text: "هذا اختبار لنموذج تحويل النص إلى كلام باللغة العربية.", voiceName: "Puck" }
]

async function testGeminiTTS() {
  console.log("Starting controlled Gemini TTS tests...\n")

  for (const model of MODELS) {
    console.log(`\n===========================================`)
    console.log(`Testing Model: ${model}`)
    console.log(`===========================================\n`)

    for (const testCase of TEST_CASES) {
      console.log(`-- Language: ${testCase.lang} --`)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`
      
      const payload = {
        contents: [{ parts: [{ text: testCase.text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: testCase.voiceName,
              },
            },
          },
        },
      }

      const tStart = Date.now()
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const tEnd = Date.now()
        console.log(`   Status: ${res.status} ${res.statusText} (${tEnd - tStart}ms)`)

        if (!res.ok) {
          const textBody = await res.text()
          console.error(`   ❌ Failed. Response Body:\n   ${textBody}`)
        } else {
          const jsonBody = await res.json()
          const dataPart = jsonBody?.candidates?.[0]?.content?.parts?.[0]?.inlineData
          if (dataPart && dataPart.data) {
            console.log(`   ✅ Success! Audio bytes received: ${dataPart.data.substring(0, 30)}...`)
          } else {
            console.error(`   ⚠️ Success status but no audio inlineData found! Body:\n   ${JSON.stringify(jsonBody, null, 2).substring(0, 200)}...`)
          }
        }
      } catch (err: any) {
        console.error(`   💥 Fetch Exception: ${err.message}`)
      }
      
      // Delay to avoid intentional concurrency or basic rate limiting during tests
      console.log("   Waiting 2000ms before next request...\n")
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

testGeminiTTS().catch(console.error)
