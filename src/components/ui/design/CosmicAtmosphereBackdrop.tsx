import React, { useEffect, useRef } from 'react'

export interface CosmicAtmosphereBackdropProps {
  accentColor?: string
  particleCount?: number
  particleType?: 'stardust' | 'embers' | 'runes' | 'bubbles'
  speed?: number
  className?: string
  style?: React.CSSProperties
}

interface StarParticle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  alpha: number
  maxAlpha: number
  twinkleSpeed: number
  color: string
}

export const CosmicAtmosphereBackdrop: React.FC<CosmicAtmosphereBackdropProps> = ({
  accentColor = '#8b5cf6',
  particleCount = 35,
  particleType = 'stardust',
  speed = 0.35,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Check system preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Palette generation based on particleType & realm accent
    const colorPalette =
      particleType === 'embers'
        ? ['#f97316', '#fbbf24', '#ef4444', '#f59e0b']
        : particleType === 'bubbles'
        ? ['#38bdf8', '#06b6d4', '#818cf8', '#67e8f9']
        : particleType === 'runes'
        ? ['#c084fc', '#e879f9', '#f472b6', '#a855f7']
        : [accentColor, '#38bdf8', '#fbbf24', '#f8fafc', '#c084fc']

    // Initialize particles
    const particles: StarParticle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * speed,
      vy: prefersReducedMotion
        ? 0
        : particleType === 'embers'
        ? -Math.abs(Math.random() * speed * 1.5)
        : (Math.random() - 0.5) * speed,
      alpha: Math.random() * 0.7 + 0.2,
      maxAlpha: Math.random() * 0.5 + 0.4,
      twinkleSpeed: prefersReducedMotion ? 0 : Math.random() * 0.015 + 0.005,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
    }))

    let isVisible = true
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    let lastTime = performance.now()

    const render = (currentTime: number) => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render)
        return
      }

      const dt = Math.min(currentTime - lastTime, 64)
      lastTime = currentTime

      ctx.clearRect(0, 0, width, height)

      // Draw subtle ambient nebula glow behind particles
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        20,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.75
      )
      gradient.addColorStop(0, 'rgba(30, 27, 75, 0.35)')
      gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.55)')
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.95)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!prefersReducedMotion) {
          p.x += p.vx * (dt / 16.66)
          p.y += p.vy * (dt / 16.66)

          // Twinkle pulse
          p.alpha += p.twinkleSpeed
          if (p.alpha > p.maxAlpha || p.alpha < 0.15) {
            p.twinkleSpeed = -p.twinkleSpeed
          }

          // Screen boundary wrap
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
          if (p.y < -10) p.y = height + 10
          if (p.y > height + 10) p.y = -10
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha))
        ctx.shadowBlur = p.radius * 3
        ctx.shadowColor = p.color
        ctx.fill()
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1.0

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [accentColor, particleCount, particleType, speed])

  return (
    <div
      className={`orbis-cosmic-atmosphere-backdrop ${className}`}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
