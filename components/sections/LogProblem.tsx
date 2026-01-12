'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { generateLogs, LogEntry } from '@/lib/logs'

export function LogProblem() {
  const logs = useMemo(() => generateLogs().slice(0, 100), [])

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
    <section className="section bg-terminal-bg" id="log-problem">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            The answer is in your logs.
            <br />
            <span className="text-terminal-error">But you&apos;ve been trained to ignore them.</span>
          </h2>

        </motion.div>

        {/* Scrolling log chaos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terminal-window"
        >
          <div className="terminal-header">
            <div className="terminal-dot terminal-dot-red" />
            <div className="terminal-dot terminal-dot-yellow" />
            <div className="terminal-dot terminal-dot-green" />
            <span className="text-terminal-muted text-sm ml-2">
              logs — streaming (5,000+ lines/sec)
            </span>
          </div>
          <div className="h-64 overflow-hidden relative">
            <div className="p-4 font-mono text-xs animate-scroll-logs" style={{ animationDuration: '25s' }}>
              {[...logs, ...logs].map((log, idx) => (
                <div
                  key={`${log.id}-${idx}`}
                  className={`py-0.5 whitespace-nowrap ${getLevelColor(log.level)}`}
                >
                  {log.raw}
                </div>
              ))}
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-terminal-surface via-transparent to-terminal-surface pointer-events-none" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-terminal-muted mt-6"
        >
          This is what you see. Every. Single. Time.
        </motion.p>
      </div>
    </section>
  )
}
