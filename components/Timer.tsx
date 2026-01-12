'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TimerProps {
  isRunning: boolean
  onTimeUpdate?: (seconds: number) => void
  className?: string
}

export function Timer({ isRunning, onTimeUpdate, className = '' }: TimerProps) {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = useCallback((totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1
          onTimeUpdate?.(next)
          return next
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, onTimeUpdate])

  return (
    <div className={`font-mono text-terminal-muted ${className}`}>
      <span className="text-terminal-text">{formatTime(seconds)}</span>
      <span className="ml-2 text-sm">elapsed</span>
    </div>
  )
}

export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  if (mins > 0) {
    return `${mins} minute${mins > 1 ? 's' : ''}, ${secs} second${secs !== 1 ? 's' : ''}`
  }
  return `${secs} second${secs !== 1 ? 's' : ''}`
}
