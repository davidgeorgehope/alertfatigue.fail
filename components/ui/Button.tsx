'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glow' | 'icon'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-terminal-accent text-terminal-bg hover:bg-terminal-accent/90 active:scale-[0.98]',
      secondary: 'bg-terminal-surface border border-terminal-border text-terminal-text hover:bg-terminal-border/50',
      ghost: 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface',
      danger: 'bg-terminal-error text-white hover:bg-terminal-error/90 active:scale-[0.98]',
      glow: 'bg-terminal-accent text-terminal-bg hover:bg-terminal-accent/90 active:scale-[0.98] btn-glow',
      icon: 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface p-0',
    }

    const sizes = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    // Icon variant uses its own sizing (square), skip standard sizes
    const sizeClass = variant === 'icon' ? '' : sizes[size]

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
