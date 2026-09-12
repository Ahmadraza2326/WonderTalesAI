import React, { useEffect, useRef } from 'react'

export interface ParticleFieldProps {
  particleType?: 'stardust' | 'embers' | 'runes' | 'bubbles'
  count?: number
  speed?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

interface Particle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  alpha: number
  maxAlpha: number
  life: number
  maxLife: number
  color: string
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  particleType = 'stardust',
  count = 45,
  speed = 0.5,
  color = '#a855f7',
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    const colors =
      particleType === 'embers'
        ? ['#f97316', '#fbbf24', '#ef4444']
        : particleType === 'bubbles'
        ? ['#38bdf8', '#06b6d4', '#818cf8']
        : particleType === 'runes'
        ? ['#c084fc', '#e879f9', '#f472b6']
        : [color, '#38bdf8', '#fbbf24', '#ffffff']

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * speed,
      vy: particleType === 'embers' ? -Math.random() * speed * 1.5 : (Math.random() - 0.5) * speed,
      alpha: Math.random() * 0.7 + 0.1,
      maxAlpha: Math.random() * 0.7 + 0.3,
      life: Math.random() * 200,
      maxLife: 200 + Math.random() * 200,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    let isVisible = true
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const render = () => {
      if (!isVisible) {
        animRef.current = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const lifeRatio = p.life / p.maxLife
        const currentAlpha = Math.sin(lifeRatio * Math.PI) * p.maxAlpha

        if (p.life >= p.maxLife) {
          p.life = 0
          p.x = Math.random() * width
          p.y = particleType === 'embers' ? height : Math.random() * height
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha))
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [count, speed, color, particleType])

  return (
    <canvas
      ref={canvasRef}
      className={`orbis-particle-field ${className}`.trim()}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
