import React, { type ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
}

export function Button({ children, variant = 'primary', onClick, ariaLabel, className = '', style }: ButtonProps) {
  const variantClass = variant === 'secondary' ? 'button-secondary' : 'button-primary'
  return (
    <button
      type="button"
      className={`button ${variantClass} ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </button>
  )
}
