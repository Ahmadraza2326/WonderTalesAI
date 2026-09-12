/**
 * Branded Mobile App Icon & Splash Screen Asset Generator
 * Generates pixel-perfect PNG assets for Android mipmap and drawable directories.
 */
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

// CRC32 table & helper for PNG chunks
const CRC_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  CRC_TABLE[i] = c
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function createChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const toCrc = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(toCrc), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePNG(width: number, height: number, rgba: Buffer): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr.writeUInt8(8, 8) // bit depth: 8
  ihdr.writeUInt8(6, 9) // color type: 6 (RGBA)
  ihdr.writeUInt8(0, 10) // compression: 0 (deflate)
  ihdr.writeUInt8(0, 11) // filter: 0
  ihdr.writeUInt8(0, 12) // interlace: 0
  const ihdrChunk = createChunk('IHDR', ihdr)

  // IDAT - Scanlines with filter byte 0
  const stride = width * 4
  const rawScanlines = Buffer.alloc(height * (stride + 1))
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1)
    rawScanlines[rowStart] = 0 // Filter type 0 (None)
    rgba.copy(rawScanlines, rowStart + 1, y * stride, (y + 1) * stride)
  }

  const compressed = zlib.deflateSync(rawScanlines, { level: 9 })
  const idatChunk = createChunk('IDAT', compressed)

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

/**
 * Creates Orby Mascot Icon
 */
function generateOrbyIcon(size: number, isRound: boolean, isForegroundOnly: boolean): Buffer {
  const rgba = Buffer.alloc(size * size * 4)
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const normDist = dist / maxR

      // Round / Squircle Clipping
      let mask = 1.0
      if (isRound) {
        if (normDist > 1.0) mask = 0.0
        else if (normDist > 0.96) mask = (1.0 - normDist) / 0.04
      } else if (!isForegroundOnly) {
        // Squircle / rounded box
        const cornerR = size * 0.22
        const qx = Math.max(0, Math.abs(dx) - (size / 2 - cornerR))
        const qy = Math.max(0, Math.abs(dy) - (size / 2 - cornerR))
        const cornerDist = Math.sqrt(qx * qx + qy * qy)
        if (cornerDist > cornerR) mask = 0.0
        else if (cornerDist > cornerR - 2) mask = (cornerR - cornerDist) / 2
      }

      if (mask <= 0) {
        rgba[idx] = 0
        rgba[idx + 1] = 0
        rgba[idx + 2] = 0
        rgba[idx + 3] = 0
        continue
      }

      if (isForegroundOnly) {
        // Transparent background for adaptive foreground icon
        rgba[idx] = 0
        rgba[idx + 1] = 0
        rgba[idx + 2] = 0
        rgba[idx + 3] = 0
      } else {
        // Deep Cosmic Gradient Background
        const gradT = (y + x * 0.5) / (size * 1.5)
        const bgR = Math.round(15 + gradT * 25)
        const bgG = Math.round(23 + gradT * 15)
        const bgB = Math.round(42 + gradT * 85)

        rgba[idx] = bgR
        rgba[idx + 1] = bgG
        rgba[idx + 2] = bgB
        rgba[idx + 3] = Math.round(255 * mask)
      }

      // Outer Starlight Halo Glow
      const starScale = isForegroundOnly ? size * 0.38 : size * 0.36
      const starDist = dist / starScale
      if (starDist < 1.35) {
        const glowAlpha = Math.max(0, 1 - starDist / 1.35) * 0.6
        if (!isForegroundOnly || rgba[idx + 3] === 0) {
          rgba[idx] = Math.round(rgba[idx] * (1 - glowAlpha) + 168 * glowAlpha)
          rgba[idx + 1] = Math.round(rgba[idx + 1] * (1 - glowAlpha) + 85 * glowAlpha)
          rgba[idx + 2] = Math.round(rgba[idx + 2] * (1 - glowAlpha) + 247 * glowAlpha)
          rgba[idx + 3] = Math.max(rgba[idx + 3], Math.round(255 * glowAlpha * mask))
        }
      }

      // 8-Pointed Star Math: r(theta) = r_base * (1 + 0.35 * cos(4*theta) + 0.15 * cos(8*theta))
      const angle = Math.atan2(dy, dx)
      const starShape = 0.68 + 0.24 * Math.cos(4 * angle) + 0.08 * Math.cos(8 * angle)
      const starR = starScale * starShape

      if (dist <= starR) {
        const tStar = dist / starR
        // Star Gradient: Golden Core (#fffbeb) -> Amber (#fbbf24) -> Coral (#f43f5e) -> Purple Edge (#9333ea)
        let rS = 255, gS = 251, bS = 235
        if (tStar > 0.3 && tStar <= 0.7) {
          const k = (tStar - 0.3) / 0.4
          rS = Math.round(255 * (1 - k) + 251 * k)
          gS = Math.round(251 * (1 - k) + 191 * k)
          bS = Math.round(235 * (1 - k) + 36 * k)
        } else if (tStar > 0.7) {
          const k = (tStar - 0.7) / 0.3
          rS = Math.round(251 * (1 - k) + 236 * k)
          gS = Math.round(191 * (1 - k) + 72 * k)
          bS = Math.round(36 * (1 - k) + 153 * k)
        }

        // Draw Orby's Cute Eyes
        const eyeOffsetX = starScale * 0.22
        const eyeOffsetY = -starScale * 0.06
        const eyeRadius = starScale * 0.08
        const eyeDist1 = Math.hypot(dx - (-eyeOffsetX), dy - eyeOffsetY)
        const eyeDist2 = Math.hypot(dx - eyeOffsetX, dy - eyeOffsetY)

        if (eyeDist1 < eyeRadius || eyeDist2 < eyeRadius) {
          // Eye color: Deep Midnight Navy with a sparkling white catchlight
          const catchX = (eyeDist1 < eyeDist2 ? dx + eyeOffsetX : dx - eyeOffsetX) - eyeRadius * 0.25
          const catchY = dy - eyeOffsetY + eyeRadius * 0.25
          if (Math.hypot(catchX, catchY) < eyeRadius * 0.35) {
            rS = 255
            gS = 255
            bS = 255
          } else {
            rS = 15
            gS = 23
            bS = 42
          }
        }

        // Draw Cute Smile
        const mouthDx = dx
        const mouthDy = dy - starScale * 0.14
        const mouthDist = Math.hypot(mouthDx, mouthDy)
        if (mouthDist < starScale * 0.12 && mouthDist > starScale * 0.07 && dy > starScale * 0.12) {
          rS = 15
          gS = 23
          bS = 42
        }

        rgba[idx] = rS
        rgba[idx + 1] = gS
        rgba[idx + 2] = bS
        rgba[idx + 3] = Math.round(255 * mask)
      }
    }
  }

  return encodePNG(size, size, rgba)
}

/**
 * Creates Cosmic Splash Screen
 */
function generateCosmicSplash(width: number, height: number): Buffer {
  const rgba = Buffer.alloc(width * height * 4)
  const cx = width / 2
  const cy = height * 0.44

  // Deterministic Starfield
  const stars: { x: number; y: number; r: number; b: number }[] = []
  let seed = 12345
  function rnd() {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  for (let i = 0; i < 90; i++) {
    stars.push({
      x: rnd() * width,
      y: rnd() * height,
      r: 1 + rnd() * 2.2,
      b: 0.4 + rnd() * 0.6,
    })
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      // Deep Dark Celestial Gradient
      const dyNorm = y / height
      const dxNorm = (x - cx) / width
      const centerDist = Math.hypot(dxNorm, dyNorm - 0.45)

      // Radial Cosmic Nebula Glow
      const nebula = Math.max(0, 1 - centerDist * 1.8) * 0.45

      const bgR = Math.round((10 + dyNorm * 18) * (1 - nebula) + 88 * nebula)
      const bgG = Math.round((14 + dyNorm * 22) * (1 - nebula) + 28 * nebula)
      const bgB = Math.round((28 + dyNorm * 48) * (1 - nebula) + 135 * nebula)

      rgba[idx] = bgR
      rgba[idx + 1] = bgG
      rgba[idx + 2] = bgB
      rgba[idx + 3] = 255

      // Stars
      for (const st of stars) {
        const sDist = Math.hypot(x - st.x, y - st.y)
        if (sDist < st.r) {
          const bright = (1 - sDist / st.r) * st.b
          rgba[idx] = Math.min(255, Math.round(rgba[idx] + 255 * bright))
          rgba[idx + 1] = Math.min(255, Math.round(rgba[idx + 1] + 245 * bright))
          rgba[idx + 2] = Math.min(255, Math.round(rgba[idx + 2] + 220 * bright))
        }
      }

      // Central Orby Mascot
      const dx = x - cx
      const dy = y - cy
      const dist = Math.hypot(dx, dy)
      const starScale = Math.min(width, height) * 0.16

      // Glowing Aura
      if (dist < starScale * 2.2) {
        const aura = Math.max(0, 1 - dist / (starScale * 2.2)) * 0.35
        rgba[idx] = Math.min(255, Math.round(rgba[idx] + 168 * aura))
        rgba[idx + 1] = Math.min(255, Math.round(rgba[idx + 1] + 85 * aura))
        rgba[idx + 2] = Math.min(255, Math.round(rgba[idx + 2] + 247 * aura))
      }

      // Star Shape
      const angle = Math.atan2(dy, dx)
      const starShape = 0.68 + 0.24 * Math.cos(4 * angle) + 0.08 * Math.cos(8 * angle)
      const starR = starScale * starShape

      if (dist <= starR) {
        const tStar = dist / starR
        let rS = 255, gS = 251, bS = 235
        if (tStar > 0.3 && tStar <= 0.7) {
          const k = (tStar - 0.3) / 0.4
          rS = Math.round(255 * (1 - k) + 251 * k)
          gS = Math.round(251 * (1 - k) + 191 * k)
          bS = Math.round(235 * (1 - k) + 36 * k)
        } else if (tStar > 0.7) {
          const k = (tStar - 0.7) / 0.3
          rS = Math.round(251 * (1 - k) + 236 * k)
          gS = Math.round(191 * (1 - k) + 72 * k)
          bS = Math.round(36 * (1 - k) + 153 * k)
        }

        // Eyes & Smile
        const eyeOffsetX = starScale * 0.22
        const eyeOffsetY = -starScale * 0.06
        const eyeRadius = starScale * 0.08
        const eyeDist1 = Math.hypot(dx - (-eyeOffsetX), dy - eyeOffsetY)
        const eyeDist2 = Math.hypot(dx - eyeOffsetX, dy - eyeOffsetY)

        if (eyeDist1 < eyeRadius || eyeDist2 < eyeRadius) {
          const catchX = (eyeDist1 < eyeDist2 ? dx + eyeOffsetX : dx - eyeOffsetX) - eyeRadius * 0.25
          const catchY = dy - eyeOffsetY + eyeRadius * 0.25
          if (Math.hypot(catchX, catchY) < eyeRadius * 0.35) {
            rS = 255
            gS = 255
            bS = 255
          } else {
            rS = 15
            gS = 23
            bS = 42
          }
        }

        const mouthDist = Math.hypot(dx, dy - starScale * 0.14)
        if (mouthDist < starScale * 0.12 && mouthDist > starScale * 0.07 && dy > starScale * 0.12) {
          rS = 15
          gS = 23
          bS = 42
        }

        rgba[idx] = rS
        rgba[idx + 1] = gS
        rgba[idx + 2] = bS
      }
    }
  }

  return encodePNG(width, height, rgba)
}

// Generate all target files
const androidResDir = path.resolve('android/app/src/main/res')

const MIPMAP_SPECS = [
  { folder: 'mipmap-mdpi', iconSize: 48, fgSize: 108 },
  { folder: 'mipmap-hdpi', iconSize: 72, fgSize: 162 },
  { folder: 'mipmap-xhdpi', iconSize: 96, fgSize: 216 },
  { folder: 'mipmap-xxhdpi', iconSize: 144, fgSize: 324 },
  { folder: 'mipmap-xxxhdpi', iconSize: 192, fgSize: 432 },
]

const SPLASH_SPECS = [
  { folder: 'drawable', w: 480, h: 800 },
  { folder: 'drawable-port-mdpi', w: 320, h: 480 },
  { folder: 'drawable-port-hdpi', w: 480, h: 800 },
  { folder: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { folder: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { folder: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
  { folder: 'drawable-land-mdpi', w: 480, h: 320 },
  { folder: 'drawable-land-hdpi', w: 800, h: 480 },
  { folder: 'drawable-land-xhdpi', w: 1280, h: 720 },
  { folder: 'drawable-land-xxhdpi', w: 1600, h: 960 },
  { folder: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
]

console.log('🎨 Generating Branded Android Icons & Splash Screens...')

// 1. Mipmap Icons
for (const spec of MIPMAP_SPECS) {
  const dir = path.join(androidResDir, spec.folder)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  console.log(`  -> Generating ${spec.folder} icons (${spec.iconSize}px & ${spec.fgSize}px)...`)
  const squareIcon = generateOrbyIcon(spec.iconSize, false, false)
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), squareIcon)

  const roundIcon = generateOrbyIcon(spec.iconSize, true, false)
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), roundIcon)

  const fgIcon = generateOrbyIcon(spec.fgSize, false, true)
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), fgIcon)
}

// 2. Splash Screens
for (const spec of SPLASH_SPECS) {
  const dir = path.join(androidResDir, spec.folder)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  console.log(`  -> Generating ${spec.folder}/splash.png (${spec.w}x${spec.h})...`)
  const splash = generateCosmicSplash(spec.w, spec.h)
  fs.writeFileSync(path.join(dir, 'splash.png'), splash)
}

console.log('✨ All Android Branded Icons & Splash Screens Generated Successfully!')
