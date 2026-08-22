import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// This script benchmarks local open-source TTS engines (Piper & Kokoro)
// It assumes the models are downloaded and the CLI tools are available.

const LANGUAGES = [
  { code: 'en-US', engine: 'kokoro', model: 'kokoro-v1.0.onnx', voice: 'af_heart' },
  { code: 'ar-SA', engine: 'piper', model: 'ar_JO-kareem-medium.onnx', voice: 'kareem' },
  { code: 'es-ES', engine: 'kokoro', model: 'kokoro-v1.0.onnx', voice: 'ef_dora' },
  { code: 'fr-FR', engine: 'kokoro', model: 'kokoro-v1.0.onnx', voice: 'ff_siwis' },
  { code: 'de-DE', engine: 'piper', model: 'de_DE-thorsten-medium.onnx', voice: 'thorsten' },
  { code: 'zh-CN', engine: 'kokoro', model: 'kokoro-v1.0.onnx', voice: 'zf_xiaoxiao' },
  { code: 'ja-JP', engine: 'kokoro', model: 'kokoro-v1.0.onnx', voice: 'jf_alpha' },
  { code: 'hi-IN', engine: 'kokoro', model: 'kokoro-v1.0.onnx', voice: 'hf_alpha' },
  { code: 'pt-BR', engine: 'kokoro', model: 'kokoro-v1.0.onnx', voice: 'pf_dora' },
  { code: 'ur-PK', engine: 'piper', model: 'ur_PK-fasih-medium.onnx', voice: 'fasih' }
]

const outDir = path.join(process.cwd(), 'scratch', 'tts-test')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

function runPiper(text: string, model: string, outPath: string) {
  // Assuming piper.exe is in PATH and models are in ./models/piper/
  const modelPath = path.join(process.cwd(), 'models', 'piper', model)
  if (!fs.existsSync(modelPath)) {
    return { success: false, error: 'Model not found' }
  }
  
  const start = performance.now()
  try {
    // Note: Piper accepts text via stdin
    execSync(`echo "${text}" | piper -m ${modelPath} -f ${outPath}`)
    const duration = performance.now() - start
    return { success: true, durationMs: duration }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

function runKokoro(text: string, voice: string, outPath: string) {
  // Assuming a local python wrapper or Kokoro ONNX CLI is available
  // e.g. python kokoro_cli.py --text "..." --voice af_heart --output out.wav
  const start = performance.now()
  try {
    // Placeholder command for the benchmark
    execSync(`python kokoro_cli.py --text "${text}" --voice ${voice} --output ${outPath}`)
    const duration = performance.now() - start
    return { success: true, durationMs: duration }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

async function runBenchmark() {
  console.log('| Language | Provider | Model | Voice | Success | Gen Time (ms) | License | Timing |')
  console.log('|---|---|---|---|---|---|---|---|')

  for (const lang of LANGUAGES) {
    const text = `This is a test for ${lang.code}. This is the second sentence. And the final sentence.`
    const outPath = path.join(outDir, `${lang.code}_${lang.engine}.wav`)
    
    let result;
    if (lang.engine === 'piper') {
      result = runPiper(text, lang.model, outPath)
    } else {
      result = runKokoro(text, lang.voice, outPath)
    }

    const status = result.success ? 'PASS' : 'FAIL'
    const time = result.success ? Math.round(result.durationMs!) : 'N/A'
    const license = lang.engine === 'kokoro' ? 'Apache-2.0' : 'MIT/CC0'
    const timing = 'Requires wrapper'

    console.log(`| ${lang.code} | ${lang.engine} | ${lang.model} | ${lang.voice} | ${status} | ${time} | ${license} | ${timing} |`)
  }
}

runBenchmark()
