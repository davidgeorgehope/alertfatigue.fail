'use client'

import { useRef, useEffect } from 'react'
import { LogEntry } from '@/lib/logs'

interface LogViewerProps {
  logs: LogEntry[]
  highlightId?: number
  maxHeight?: string
  autoScroll?: boolean
  showLineNumbers?: boolean
  className?: string
  onLogClick?: (log: LogEntry) => void
}

export function LogViewer({
  logs,
  highlightId,
  maxHeight = '400px',
  autoScroll = false,
  showLineNumbers = true,
  className = '',
  onLogClick,
}: LogViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return 'text-terminal-error'
      case 'WARN':
        return 'text-terminal-warning'
      case 'INFO':
        return 'text-terminal-text'
      case 'DEBUG':
        return 'text-terminal-muted'
      default:
        return 'text-terminal-text'
    }
  }

  return (
    <div
      ref={containerRef}
      className={`font-mono text-sm overflow-auto bg-terminal-bg rounded-lg ${className}`}
      style={{ maxHeight }}
    >
      <div className="p-4">
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => onLogClick?.(log)}
            className={`flex gap-2 py-0.5 hover:bg-terminal-surface/50 cursor-pointer transition-colors ${
              highlightId === log.id ? 'bg-terminal-accent/20 rounded' : ''
            }`}
          >
            {showLineNumbers && (
              <span className="text-terminal-muted w-12 flex-shrink-0 text-right pr-2 select-none">
                {log.id + 1}
              </span>
            )}
            <span className={`flex-1 break-all ${getLevelColor(log.level)}`}>
              {log.raw}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Scrolling log viewer for the chaos effect
interface ScrollingLogViewerProps {
  logs: LogEntry[]
  speed?: number
  className?: string
}

export function ScrollingLogViewer({ logs, speed = 30, className = '' }: ScrollingLogViewerProps) {
  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return 'text-terminal-error'
      case 'WARN':
        return 'text-terminal-warning'
      case 'INFO':
        return 'text-terminal-text'
      case 'DEBUG':
        return 'text-terminal-muted'
      default:
        return 'text-terminal-text'
    }
  }

  // Double the logs for seamless loop
  const doubledLogs = [...logs, ...logs]

  return (
    <div className={`overflow-hidden bg-terminal-bg rounded-lg ${className}`}>
      <div
        className="font-mono text-xs animate-scroll-logs"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubledLogs.map((log, idx) => (
          <div
            key={`${log.id}-${idx}`}
            className={`py-0.5 whitespace-nowrap ${getLevelColor(log.level)}`}
          >
            {log.raw}
          </div>
        ))}
      </div>
    </div>
  )
}
