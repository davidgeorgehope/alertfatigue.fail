'use client'

interface BadgeProps {
  variant?: 'error' | 'warning' | 'success' | 'info' | 'default'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    error: 'bg-terminal-error/20 text-terminal-error border-terminal-error/30',
    warning: 'bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30',
    success: 'bg-terminal-success/20 text-terminal-success border-terminal-success/30',
    info: 'bg-terminal-accent/20 text-terminal-accent border-terminal-accent/30',
    default: 'bg-terminal-surface text-terminal-muted border-terminal-border',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
