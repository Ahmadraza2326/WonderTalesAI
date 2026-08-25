import { useEffect, useRef, memo } from 'react'

interface CelebrationParticlesProps {
  particleCount?: number
  durationMs?: number
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  rotation: number
  rotationSpeed: number
  shape: 'circle' | 'star' | 'sparkle'
}

const PASTEL_COLORS = [
  '#f59e0b', // Magic gold star
  '#8b5cf6', // Lavender purple
  '#ec4899', // Gentle rose
  '#06b6d4', // Sky cyan
  '#10b981', // Emerald green
  '#fbbf24', // Amber light
]

export const CelebrationParticles = memo(function CelebrationParticles({
  particleCount = 45,
  durationMs = 2600,
  className = '',
}: CelebrationParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    // 1. Accessibility: Check for prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Under reduced motion, do not run high-velocity particle physics loop
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth || 600)
    const height = (canvas.height = canvas.parentElement?.clientHeight || 400)

    const particles: Particle[] = []
    const originX = width / 2
    const originY = height / 2.5

    // Initialize particle burst
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
      const speed = 2.5 + Math.random() * 4.5

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // gentle upward bias
        size: 3 + Math.random() * 5,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        shape: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'sparkle' : 'circle',
      })
    }

    let animationFrameId: number
    const startTime = performance.now()

    const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3
      let x = cx
      let y = cy
      const step = Math.PI / spikes

      c.beginPath()
      c.moveTo(cx, cy - outerRadius)
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius
        y = cy + Math.sin(rot) * outerRadius
        c.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius
        y = cy + Math.sin(rot) * innerRadius
        c.lineTo(x, y)
        rot += step
      }
      c.lineTo(cx, cy - outerRadius)
      c.closePath()
      c.fill()
    }

    const render = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / durationMs)

      ctx.clearRect(0, 0, width, height)

      if (progress >= 1) {
        return
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.07 // soft gravity
        p.vx *= 0.985 // air friction
        p.rotation += p.rotationSpeed
        p.alpha = Math.max(0, 1 - progress * 1.2)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color

        if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2)
        } else if (p.shape === 'sparkle') {
          drawStar(ctx, 0, 0, 4, p.size * 1.2, p.size * 0.3)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [particleCount, durationMs])

  return (
    <canvas
      ref={canvasRef}
      className={`celebration-particles ${className}`.trim()}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
      aria-hidden="true"
    />
  )
})
