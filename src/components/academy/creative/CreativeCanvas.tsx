import React, { useRef, useState, useEffect } from 'react'
import { StickerPalette, type StickerItem } from './StickerPalette'
import { MagicalButton } from '../../ui/design'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface PlacedSticker {
  id: string
  emoji: string
  x: number
  y: number
}

interface CreativeCanvasProps {
  onSave?: (dataUrl: string, stickers: PlacedSticker[]) => void
}

export const CreativeCanvas: React.FC<CreativeCanvasProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#38bdf8')
  const [brushSize, setBrushSize] = useState(6)
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedSticker) {
      // Stamp sticker
      HapticsService.light()
      sfxService.play('star_pop')
      setPlacedStickers((prev) => [
        ...prev,
        {
          id: `stk_${Date.now()}`,
          emoji: selectedSticker.emoji,
          x,
          y,
        },
      ])
      setSelectedSticker(null)
      return
    }

    setIsDrawing(true)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedSticker) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const handlePointerUp = () => {
    setIsDrawing(false)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setPlacedStickers([])
    HapticsService.light()
    sfxService.play('card_flip')
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    HapticsService.success()
    sfxService.play('victory_fanfare')
    onSave?.(dataUrl, placedStickers)
  }

  const paletteColors = ['#f8fafc', '#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#a855f7', '#f43f5e']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '720px',
          padding: '12px 16px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Colors */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {paletteColors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c)
                setSelectedSticker(null)
              }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: c,
                border: color === c ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transform: color === c ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Size:</span>
          {[3, 6, 12, 20].map((sz) => (
            <button
              key={sz}
              onClick={() => setBrushSize(sz)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: brushSize === sz ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#f8fafc',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleClear}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
          <MagicalButton variant="cosmic" size="sm" onClick={handleSave}>
            Save Creation 🎨
          </MagicalButton>
        </div>
      </div>

      {/* Canvas Area with Placed Stickers */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '720px',
          height: '420px',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#020617',
          border: '2px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={420}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            touchAction: 'none',
            cursor: selectedSticker ? 'crosshair' : 'default',
          }}
        />

        {/* Render Stamped Stickers */}
        {placedStickers.map((stk) => (
          <div
            key={stk.id}
            style={{
              position: 'absolute',
              left: `${stk.x - 16}px`,
              top: `${stk.y - 16}px`,
              fontSize: '32px',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {stk.emoji}
          </div>
        ))}
      </div>

      {/* Sticker Tray */}
      <div style={{ maxWidth: '720px', width: '100%' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
          ✨ Magic Stickers (Tap to Stamp)
        </div>
        <StickerPalette onSelectSticker={(stk) => setSelectedSticker(stk)} />
      </div>
    </div>
  )
}
