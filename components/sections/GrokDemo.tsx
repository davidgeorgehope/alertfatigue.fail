'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const sampleLog = '2024-12-20T03:14:24.312Z ERROR checkout-service Database connection pool exhausted active_connections=20 waiting_requests=147'

const extractedFields = [
  { name: '@timestamp', value: '2024-12-20T03:14:24.312Z', color: 'text-cyan-400' },
  { name: 'log.level', value: 'ERROR', color: 'text-terminal-error' },
  { name: 'service.name', value: 'checkout-service', color: 'text-purple-400' },
  { name: 'message', value: 'Database connection pool exhausted', color: 'text-terminal-text' },
  { name: 'connections.active', value: '20', color: 'text-yellow-400' },
  { name: 'connections.waiting', value: '147', color: 'text-orange-400' },
]

const grokPattern = `%{TIMESTAMP_ISO8601:@timestamp} %{LOGLEVEL:log.level} %{DATA:service.name} %{GREEDYDATA:message} active_connections=%{NUMBER:connections.active} waiting_requests=%{NUMBER:connections.waiting}`

export function GrokDemo() {
  const [phase, setPhase] = useState<'before' | 'generating' | 'after'>('before')
  const [showGrok, setShowGrok] = useState(false)

  const handleGenerate = async () => {
    setPhase('generating')
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setPhase('after')
  }

  const handleReset = () => {
    setPhase('before')
    setShowGrok(false)
  }

  return (
    <section className="section bg-terminal-bg" id="grok-demo">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Do I really need to write grok patterns?
          </h2>

          <p className="text-terminal-muted text-lg mb-4">
            The field you need is right there in the log but it&apos;s trapped in a message string you can&apos;t query, can&apos;t alert on, can&apos;t dashboard. So you&apos;re maintaining brittle regex that breaks every time a dev changes the format.
          </p>
          <p className="text-terminal-muted text-lg mb-8">
            AI generates the parsing pattern from the structure itself.{' '}
            <span className="text-terminal-accent">Fields extracted, typed, queryable. Format changes, pattern adapts.</span>
          </p>
        </motion.div>

        {/* Demo */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {phase === 'before' && (
              <motion.div
                key="before"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-dot terminal-dot-red" />
                    <div className="terminal-dot terminal-dot-yellow" />
                    <div className="terminal-dot terminal-dot-green" />
                    <span className="text-terminal-muted text-sm ml-2">Raw log — unparsed</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <div className="text-terminal-text break-all">{sampleLog}</div>
                  </div>
                </div>

                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                  <div className="text-terminal-muted text-sm mb-2">Current fields:</div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    <div>
                      <span className="text-terminal-muted">message:</span>{' '}
                      <span className="text-terminal-text">[entire string]</span>
                    </div>
                    <div>
                      <span className="text-terminal-muted">@timestamp:</span>{' '}
                      <span className="text-terminal-warning">[ingest time]</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleGenerate} size="lg">
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Pattern
                  </Button>
                </div>
              </motion.div>
            )}

            {phase === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-terminal-border border-t-terminal-accent rounded-full animate-spin" />
                  <Wand2 className="w-6 h-6 text-terminal-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-terminal-muted mt-4">Analyzing log structure...</p>
              </motion.div>
            )}

            {phase === 'after' && (
              <motion.div
                key="after"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Parsed log with highlights */}
                <div className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-dot terminal-dot-red" />
                    <div className="terminal-dot terminal-dot-yellow" />
                    <div className="terminal-dot terminal-dot-green" />
                    <span className="text-terminal-muted text-sm ml-2">Parsed log — structured</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <div className="flex flex-wrap">
                      {extractedFields.map((field, idx) => (
                        <motion.span
                          key={field.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`${field.color} mr-1`}
                        >
                          <span className="underline decoration-dotted underline-offset-4">
                            {field.value}
                          </span>
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Extracted fields */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-terminal-surface border border-terminal-border rounded-lg p-4"
                >
                  <div className="text-terminal-muted text-sm mb-3">Extracted fields:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-sm">
                    {extractedFields.map((field) => (
                      <div key={field.name} className="flex items-center gap-2">
                        <Badge variant="info" className="font-mono">{field.name}</Badge>
                        <span className={field.color}>{field.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Expandable Grok pattern */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => setShowGrok(!showGrok)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {showGrok ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showGrok ? 'Hide' : 'Show'} generated Grok pattern
                  </Button>

                  <AnimatePresence>
                    {showGrok && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 bg-terminal-bg border border-terminal-border rounded-lg p-4 font-mono text-xs overflow-x-auto"
                      >
                        <code className="text-terminal-accent">{grokPattern}</code>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Time comparison */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-2 text-terminal-success"
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Time to parse: 10 seconds</span>
                </motion.div>

                <div className="flex justify-center">
                  <Button variant="ghost" onClick={handleReset}>
                    Try again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-terminal-muted text-center mt-8"
        >
          No regex. No guessing. No 2-hour debugging sessions.
        </motion.p>
      </div>
    </section>
  )
}
