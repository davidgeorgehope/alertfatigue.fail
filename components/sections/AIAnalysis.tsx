'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MermaidDiagram, defaultArchitectureDiagram } from '@/components/MermaidDiagram'
import { generateLogs, getAnswerLog, LogEntry } from '@/lib/logs'

interface AnalysisResult {
  diagram: string
  analysis: {
    rootCause: string
    affectedServices: string[]
    severity: string
    annotations: Array<{
      service: string
      message: string
      severity: 'error' | 'warning' | 'info'
    }>
  }
  fallback?: boolean
}

export function AIAnalysis() {
  const logs = useMemo(() => generateLogs(), [])
  const answerLog = useMemo(() => getAnswerLog(logs), [logs])
  const [phase, setPhase] = useState<'idle' | 'processing' | 'complete'>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [processingStep, setProcessingStep] = useState(0)
  const [analysisTime, setAnalysisTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [revealStage, setRevealStage] = useState(0)

  const processingSteps = [
    'Reading log line #847...',
    'Identifying upstream failure: payment-gateway',
    'Tracing service dependencies...',
    'Correlating related events...',
    'Mapping root cause chain...',
  ]

  // Progressive reveal after analysis completes
  useEffect(() => {
    if (phase !== 'complete' || !result) return

    // Stage 1: immediate (service map)
    setRevealStage(1)

    const timers = [
      setTimeout(() => setRevealStage(2), 1200),  // annotations
      setTimeout(() => setRevealStage(3), 2400),  // root cause
      setTimeout(() => setRevealStage(4), 3200),  // time comparison
    ]

    return () => timers.forEach(clearTimeout)
  }, [phase, result])

  const handleAnalyze = async () => {
    setPhase('processing')
    setError(null)
    setProcessingStep(0)
    setRevealStage(0)

    const startTime = Date.now()

    // Animate through processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setProcessingStep(i + 1)
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logs.slice(0, 200) }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResult(data)
      setAnalysisTime((Date.now() - startTime) / 1000)
      setPhase('complete')
    } catch (err) {
      // Use fallback on error
      setResult({
        diagram: defaultArchitectureDiagram,
        analysis: {
          rootCause: 'Payment gateway timeout due to upstream dependency failure',
          affectedServices: ['checkout-service', 'payment-gateway'],
          severity: 'critical',
          annotations: [
            { service: 'payment-gateway', message: '3 retry attempts', severity: 'error' },
            { service: 'payment-gateway', message: 'Response time: 30,000ms', severity: 'error' },
            { service: 'checkout-service', message: 'Connection pool: exhausted', severity: 'warning' },
          ],
        },
        fallback: true,
      })
      setAnalysisTime((Date.now() - startTime) / 1000)
      setPhase('complete')
      setError('Using demo data (API unavailable)')
    }
  }

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
    <section className="section bg-terminal-bg" id="ai-analysis">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Can I trace what a single log line actually broke?
          </h2>
          <p className="text-terminal-muted text-lg mb-4">
            An error fires in checkout. You&apos;re 45 minutes into a war room reverse-engineering the dependency chain from memory and Slack threads while the outage timer runs.
          </p>
          <p className="text-terminal-muted text-lg">
            AI builds the service map from your log traffic. When checkout errors, you see the cascade in seconds: payment-gateway, connection pool, upstream.{' '}
            <span className="text-terminal-accent">You know what&apos;s broken before the war room forms.</span>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Preview of chaotic logs */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                  <span className="text-terminal-muted text-sm ml-2">logs — chaos mode</span>
                </div>
                <div className="h-48 overflow-hidden p-4 font-mono text-xs relative">
                  <div className="animate-scroll-logs" style={{ animationDuration: '20s' }}>
                    {[...logs.slice(0, 50), ...logs.slice(0, 50)].map((log, idx) => (
                      <div
                        key={`${log.id}-${idx}`}
                        className={`py-0.5 whitespace-nowrap ${getLevelColor(log.level)}`}
                      >
                        {log.raw}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-terminal-surface to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Log #847 callout */}
              {answerLog && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-terminal-error/5 border border-terminal-error/20 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-terminal-error" />
                    <span className="text-terminal-error text-sm font-medium">1 line. 1,000 logs.</span>
                  </div>
                  <pre className="text-xs font-mono text-terminal-muted overflow-x-auto whitespace-pre-wrap break-all">
                    <span className="text-terminal-error/60">#{answerLog.id}</span>{' '}
                    {answerLog.raw}
                  </pre>
                </motion.div>
              )}

              <div className="flex justify-center">
                <Button onClick={handleAnalyze} size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Trace this failure
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                  <span className="text-terminal-muted text-sm ml-2">analyzing...</span>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {processingSteps.map((step, idx) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: processingStep > idx ? 1 : 0.3,
                          x: 0,
                        }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        {processingStep > idx ? (
                          <CheckCircle className="w-5 h-5 text-terminal-success" />
                        ) : processingStep === idx ? (
                          <Loader2 className="w-5 h-5 text-terminal-accent animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-terminal-border" />
                        )}
                        <span
                          className={
                            processingStep > idx
                              ? 'text-terminal-success'
                              : processingStep === idx
                              ? 'text-terminal-accent'
                              : 'text-terminal-muted'
                          }
                        >
                          {step}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'complete' && result && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {error && (
                <div className="flex items-center gap-2 text-terminal-warning text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Stage 1: Architecture diagram */}
              <AnimatePresence>
                {revealStage >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="terminal-window">
                      <div className="terminal-header">
                        <div className="terminal-dot terminal-dot-red" />
                        <div className="terminal-dot terminal-dot-yellow" />
                        <div className="terminal-dot terminal-dot-green" />
                        <span className="text-terminal-muted text-sm ml-2">Service Architecture — AI Generated</span>
                      </div>
                      <div className="p-6 flex justify-center">
                        <MermaidDiagram chart={result.diagram} className="max-w-full" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 2: Annotations */}
              <AnimatePresence>
                {revealStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {result.analysis.annotations.map((annotation, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.4 }}
                        className="bg-terminal-surface border border-terminal-border rounded-lg p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              annotation.severity === 'error'
                                ? 'error'
                                : annotation.severity === 'warning'
                                ? 'warning'
                                : 'info'
                            }
                          >
                            {annotation.service}
                          </Badge>
                        </div>
                        <p className="text-terminal-text text-sm">{annotation.message}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 3: Root cause */}
              <AnimatePresence>
                {revealStage >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-terminal-error/10 border border-terminal-error/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-terminal-error" />
                      <span className="text-terminal-error font-medium">Root Cause Identified</span>
                    </div>
                    <p className="text-terminal-text">{result.analysis.rootCause}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 4: Time comparison */}
              <AnimatePresence>
                {revealStage >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-8 py-6">
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-terminal-accent mb-1">
                          <Clock className="w-5 h-5" />
                          <span className="text-2xl font-bold">{analysisTime.toFixed(1)}s</span>
                        </div>
                        <p className="text-terminal-muted text-sm">Time to insight</p>
                      </div>
                      <div className="text-terminal-muted text-2xl">vs</div>
                      <div className="text-center">
                        <div className="text-terminal-error text-2xl font-bold mb-1">34+ min</div>
                        <p className="text-terminal-muted text-sm">Manual investigation</p>
                      </div>
                    </div>

                    <p className="text-center text-terminal-muted">
                      Searches required: <span className="text-terminal-accent font-bold">0</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
