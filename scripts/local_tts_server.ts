import * as http from 'http'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PIPER_SERVER_PORT || 3001
const PIPER_EXE = process.env.PIPER_EXECUTABLE_PATH ? path.resolve(process.cwd(), process.env.PIPER_EXECUTABLE_PATH) : undefined
const PIPER_MODEL_DIR = process.env.PIPER_MODEL_DIR ? path.resolve(process.cwd(), process.env.PIPER_MODEL_DIR) : undefined
const DEFAULT_VOICE = process.env.PIPER_VOICE

const server = http.createServer((req, res) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/tts') {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        const text = payload.text || ''
        // Fallback to german since it's the tested one
        // If a voice is requested, try to use it, else default, else fallback
        const requestedVoice = payload.voice || DEFAULT_VOICE || 'de_DE-thorsten-medium.onnx'

        if (!text.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json', ...headers })
          res.end(JSON.stringify({ error: 'Text is required' }))
          return
        }

        if (!PIPER_EXE || !PIPER_MODEL_DIR) {
          res.writeHead(500, { 'Content-Type': 'application/json', ...headers })
          res.end(JSON.stringify({ error: 'Piper is not configured. Set PIPER_EXECUTABLE_PATH and PIPER_MODEL_DIR.' }))
          return
        }

        const modelPath = path.join(PIPER_MODEL_DIR, requestedVoice)

        if (!fs.existsSync(PIPER_EXE)) {
          res.writeHead(500, { 'Content-Type': 'application/json', ...headers })
          res.end(JSON.stringify({ error: 'Piper executable not found at configured path.' }))
          return
        }

        if (!fs.existsSync(modelPath)) {
          res.writeHead(500, { 'Content-Type': 'application/json', ...headers })
          res.end(JSON.stringify({ error: `Piper model not found at ${modelPath}` }))
          return
        }

        // Spawn Piper: output to stdout as WAV (-f -)
        const child = spawn(PIPER_EXE, ['-m', modelPath, '-f', '-'], { shell: false })

        // Write text to stdin
        child.stdin.write(text + '\n')
        child.stdin.end()

        // Set response headers for audio stream
        res.writeHead(200, {
          'Content-Type': 'audio/wav',
          ...headers
        })

        // Pipe Piper's stdout directly to the HTTP response
        child.stdout.pipe(res)

        child.stderr.on('data', (data) => {
          console.error(`[Piper Error]: ${data.toString()}`)
        })

        child.on('close', (code) => {
          if (code !== 0) {
            console.error(`Piper exited with code ${code}`)
            // If headers are not sent, we could return an error, but if they are already streaming we just end.
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'application/json', ...headers })
              res.end(JSON.stringify({ error: 'Piper process failed.' }))
            }
          }
        })

      } catch (err) {
        console.error('Failed to parse request or spawn Piper:', err)
        res.writeHead(400, { 'Content-Type': 'application/json', ...headers })
        res.end(JSON.stringify({ error: 'Invalid request JSON or server error' }))
      }
    })
  } else {
    res.writeHead(404, headers)
    res.end()
  }
})

server.listen(PORT, () => {
  console.log(`Local TTS Server running on port ${PORT}`)
  console.log(`Piper Exe: ${PIPER_EXE}`)
  console.log(`Piper Model Dir: ${PIPER_MODEL_DIR}`)
})
