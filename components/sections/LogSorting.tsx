'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Shuffle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { generateLogs, groupLogsByCategory, LogEntry } from '@/lib/logs'

const categoryColors: Record<LogEntry['category'], { bg: string; text: string; label: string }> = {
  k8s: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'K8s Events' },
  app: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'App Logs' },
  auth: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Auth Logs' },
  database: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Database' },
  http: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'HTTP Access' },
  system: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'System' },
}

export function LogSorting() {
  const [isSorted, setIsSorted] = useState(false)
  const logs = useMemo(() => generateLogs().slice(0, 60), [])
  const groupedLogs = useMemo(() => groupLogsByCategory(logs), [logs])

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR': return 'text-terminal-error'
      case 'WARN': return 'text-terminal-warning'
      case 'INFO': return 'text-terminal-text'
      case 'DEBUG': return 'text-terminal-muted'
      default: return 'text-terminal-text'
    }
  }

  return (
    <section className="section bg-terminal-surface/30" id="log-sorting">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Logs that sort themselves.
          </h2>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-terminal-muted text-lg">
              Your logs are chaos. Different formats, different services,
              different schemas, all in the same bucket.
            </p>
            <p className="text-terminal-text font-medium">
              AI organizes them automatically.
            </p>
            <p className="text-terminal-muted">
              Using log format fingerprinting, AI recognizes the structure of each log line
              and groups similar logs together.
            </p>
            <p className="text-terminal-muted">
              No manual tagging. No brittle pipelines. No regex.
            </p>
            <p className="text-terminal-accent font-medium">
              94% accuracy. Automatic. Instant.
            </p>
          </div>
        </motion.div>

        {/* Toggle button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setIsSorted(!isSorted)}
            variant="primary"
            size="lg"
          >
            {isSorted ? (
              <>
                <Shuffle className="w-5 h-5 mr-2" />
                Show Chaos
              </>
            ) : (
              <>
                <Layers className="w-5 h-5 mr-2" />
                Organize with AI
              </>
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {!isSorted ? (
            <motion.div
              key="chaos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="terminal-window"
            >
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-terminal-muted text-sm ml-2">logs — chaos</span>
              </div>
              <div className="max-h-80 overflow-auto p-4 font-mono text-xs">
                {logs.map((log) => (
                  <div key={log.id} className={`py-0.5 ${getLevelColor(log.level)}`}>
                    {log.raw}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sorted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {(Object.entries(groupedLogs) as [LogEntry['category'], LogEntry[]][])
                .filter(([, categoryLogs]) => categoryLogs.length > 0)
                .map(([category, categoryLogs], idx) => {
                  const colors = categoryColors[category]
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`${colors.bg} border border-terminal-border rounded-lg overflow-hidden`}
                    >
                      <div className="px-4 py-2 border-b border-terminal-border flex items-center justify-between">
                        <span className={`font-medium ${colors.text}`}>{colors.label}</span>
                        <Badge variant="default">{categoryLogs.length}</Badge>
                      </div>
                      <div className="max-h-40 overflow-auto p-2 font-mono text-xs">
                        {categoryLogs.slice(0, 10).map((log) => (
                          <div key={log.id} className={`py-0.5 truncate ${getLevelColor(log.level)}`}>
                            {log.raw}
                          </div>
                        ))}
                        {categoryLogs.length > 10 && (
                          <div className="text-terminal-muted text-center py-1">
                            +{categoryLogs.length - 10} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fingerprinting explanation */}
        {isSorted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-terminal-bg border border-terminal-border rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-terminal-text mb-4">
              How it works: Log Format Fingerprinting
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <div>
                <div className="text-terminal-muted mb-1">Raw log:</div>
                <div className="text-terminal-text bg-terminal-surface p-2 rounded overflow-x-auto">
                  2024-12-20T03:14:24.312Z ERROR Database connection pool exhausted active_connections=20
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-terminal-muted" />
              </div>
              <div>
                <div className="text-terminal-muted mb-1">Fingerprint:</div>
                <div className="text-terminal-accent bg-terminal-surface p-2 rounded overflow-x-auto">
                  0-0-0a0:0:0.0a a a a a=0
                </div>
              </div>
            </div>
            <p className="text-terminal-muted text-sm mt-4">
              Similar fingerprints = similar log formats = automatic grouping.
              No configuration required.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
