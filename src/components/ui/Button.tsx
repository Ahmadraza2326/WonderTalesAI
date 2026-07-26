import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  ariaLabel?: string
}

export function Button({ children, variant = 'primary', onClick, ariaLabel }: ButtonProps) {
  return (
    <button type="button" className={`button ${variant}`} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
