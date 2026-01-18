'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, AlertCircle, AlertTriangle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { generateLogs, LogEntry } from '@/lib/logs'

interface SignificantEvent {
  id: string
  type: 'error' | 'warning' | 'anomaly'
  title: string
  service: string
  timestamp: string
  details: string
  relatedLogs: LogEntry[]
}

export function SignificantEvents() {
  const logs = useMemo(() => generateLogs(), [])
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Pre-defined significant events for the demo
  const significantEvents: SignificantEvent[] = useMemo(() => [
    {
      id: 'evt-1',
      type: 'error',
      title: 'OOM in checkout-service pod-7f8d9',
      service: 'checkout-service',
      timestamp: '2024-12-20T03:14:24.312Z',
      details: 'Container exceeded memory limit and was killed by the OOM killer. This correlates with the upstream timeout event.',
      relatedLogs: logs.filter(l => l.service === 'checkout-service' && l.level === 'ERROR').slice(0, 3),
    },
    {
      id: 'evt-2',
      type: 'warning',
      title: 'Connection pool exhausted (20/20 active)',
      service: 'checkout-service',
      timestamp: '2024-12-20T03:12:15.000Z',
      details: 'Database connection pool reached maximum capacity. New requests are waiting for available connections.',
      relatedLogs: logs.filter(l => l.message.includes('pool') || l.message.includes('connection')).slice(0, 3),
    },
    {
      id: 'evt-3',
      type: 'anomaly',
      title: 'payment-gateway latency 4x normal',
      service: 'payment-gateway',
      timestamp: '2024-12-20T03:10:00.000Z',
      details: 'Response times increased from ~200ms to ~800ms. This preceded the cascade of errors in dependent services.',
      relatedLogs: logs.filter(l => l.service === 'payment-gateway').slice(0, 3),
    },
  ], [logs])

  const getEventIcon = (type: SignificantEvent['type']) => {
    switch (type) {
      case 'error': return AlertCircle
      case 'warning': return AlertTriangle
      case 'anomaly': return TrendingUp
    }
  }

  const getEventColor = (type: SignificantEvent['type']) => {
    switch (type) {
      case 'error': return { badge: 'error' as const, text: 'text-terminal-error', bg: 'bg-terminal-error/10 border-terminal-error/30' }
      case 'warning': return { badge: 'warning' as const, text: 'text-terminal-warning', bg: 'bg-terminal-warning/10 border-terminal-warning/30' }
      case 'anomaly': return { badge: 'info' as const, text: 'text-terminal-accent', bg: 'bg-terminal-accent/10 border-terminal-accent/30' }
    }
  }

  return (
    <section className="section bg-terminal-surface/30" id="significant-events">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Stop hunting. Start knowing.
          </h2>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-terminal-muted text-lg">
              Even organized, parsed logs are still a lot of logs.
            </p>
            <p className="text-terminal-muted">
              You need the error, the anomaly, the thing that broke.
            </p>
            <p className="text-terminal-text font-medium">
              Significant Events surfaces them automatically.
            </p>
            <p className="text-terminal-muted">
              AI identifies the signals you care about:
            </p>
            <ul className="text-terminal-muted">
              <li>Errors and exceptions</li>
              <li>Anomalous patterns</li>
              <li>Critical warnings</li>
              <li>State changes</li>
            </ul>
            <p className="text-terminal-accent font-medium">
              The needle finds you.
            </p>
          </div>
        </motion.div>

        {/* Before/After toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-terminal-muted hover:text-terminal-text transition-colors"
          >
            <Zap className={`w-5 h-5 ${showAll ? 'text-terminal-muted' : 'text-terminal-accent'}`} />
            <span>{showAll ? 'Show significant events only' : 'Showing significant events'}</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showAll ? (
            <motion.div
              key="significant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {significantEvents.map((event, idx) => {
                const Icon = getEventIcon(event.type)
                const colors = getEventColor(event.type)
                const isExpanded = expandedEvent === event.id

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`border rounded-lg overflow-hidden ${colors.bg}`}
                  >
                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                      className="w-full p-4 flex items-start gap-3 text-left"
                    >
                      <Icon className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={colors.badge}>{event.type.toUpperCase()}</Badge>
                          <span className="text-terminal-muted text-xs font-mono">{event.service}</span>
                        </div>
                        <p className={`font-medium ${colors.text}`}>{event.title}</p>
                        <p className="text-terminal-muted text-xs mt-1 font-mono">{event.timestamp}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-terminal-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-terminal-muted" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-terminal-border"
                        >
                          <div className="p-4 space-y-4">
                            <p className="text-terminal-text text-sm">{event.details}</p>

                            <div>
                              <div className="text-terminal-muted text-xs mb-2">Related logs:</div>
                              <div className="bg-terminal-bg rounded-lg p-3 font-mono text-xs space-y-1">
                                {event.relatedLogs.map((log) => (
                                  <div key={log.id} className="text-terminal-muted truncate">
                                    {log.raw}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-terminal-muted text-sm"
              >
                These were surfaced automatically. No query. No search. No hunting.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="terminal-window"
            >
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-terminal-muted text-sm ml-2">All logs — {logs.length} lines</span>
              </div>
              <div className="max-h-64 overflow-auto p-4 font-mono text-xs">
                {logs.slice(0, 50).map((log) => (
                  <div key={log.id} className="py-0.5 text-terminal-muted">
                    {log.raw}
                  </div>
                ))}
              </div>
              <div className="p-4 text-center text-terminal-muted text-sm border-t border-terminal-border">
                Good luck finding what matters in here.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-terminal-text font-medium">
            Before you&apos;re paged. Before the user complains. Before the 3am wake-up.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
