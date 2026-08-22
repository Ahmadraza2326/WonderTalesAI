import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import os from 'os'

const text = 'Das ist ein Test für die deutsche Sprache. Dies ist der zweite Satz. Und der letzte Satz. Wir testen die Leistung des lokalen TTS-Systems. Piper ist ein schnelles lokales TTS-Modell. Ich hoffe, das verursacht keinen Speicherfehler.'
const outDir = path.join(process.cwd(), 'scratch', 'tts-test')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}
const outPath = path.join(outDir, `de_DE_piper.wav`)
const modelPath = path.join(process.cwd(), 'scratch', 'tts_env', 'piper_models', 'de_DE-thorsten-medium.onnx')
const piperExe = path.join(process.cwd(), 'scratch', 'tts_env', 'piper', 'piper', 'piper.exe')

if (!fs.existsSync(modelPath)) {
  console.error('Model not found at', modelPath)
  process.exit(1)
}

if (!fs.existsSync(piperExe)) {
  console.error('Piper exe not found at', piperExe)
  process.exit(1)
}

console.log(`[Before] System Free RAM: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
const initialFreeMem = os.freemem();
let minFreeMem = initialFreeMem;
// let maxPiperMem = 0;

const start = performance.now()

const child = spawn(piperExe, ['-m', modelPath, '-f', outPath], {
  shell: false
});

child.stdin.write(text + '\n');
child.stdin.end();

const monitorInterval = setInterval(() => {
  const currentFree = os.freemem();
  if (currentFree < minFreeMem) {
    minFreeMem = currentFree;
  }
  
  // Try to get process memory
  try {
    process.memoryUsage();
    // this is just node memory
  } catch(e) {}
}, 20);

child.on('close', (code) => {
  clearInterval(monitorInterval);
  const duration = performance.now() - start;
  console.log(`\n[After] System Free RAM: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
  const maxRamUsed = (initialFreeMem - minFreeMem) / 1024 / 1024;
  console.log(`\nPiper exited with code ${code}`);
  console.log(`Generation Time: ${duration.toFixed(2)} ms`);
  console.log(`Max system RAM delta (decrease in free RAM during generation): ${maxRamUsed.toFixed(2)} MB`);
  
  if (fs.existsSync(outPath)) {
    const stats = fs.statSync(outPath);
    console.log(`Generated WAV size: ${stats.size} bytes`);
  } else {
    console.log(`WAV file was not created at ${outPath}`);
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(`Piper error: ${data.toString()}`);
});

child.stdout.on('data', (data) => {
  process.stdout.write(data.toString());
});
