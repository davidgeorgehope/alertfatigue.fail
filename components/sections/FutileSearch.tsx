'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Timer, formatSeconds } from '@/components/Timer'
import { generateLogs, searchLogs, getAnswerLog, LogEntry } from '@/lib/logs'

export function FutileSearch() {
  const [logs] = useState(() => generateLogs())
  const [query, setQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [timerRunning, setTimerRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [showReveal, setShowReveal] = useState(false)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  const answerLog = useMemo(() => getAnswerLog(logs), [logs])

  const filteredLogs = useMemo(() => {
    if (!query.trim()) return logs.slice(0, 100) // Show first 100 by default
    return searchLogs(logs, query)
  }, [logs, query])

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery)

    if (!hasStarted && newQuery.trim()) {
      setHasStarted(true)
      setTimerRunning(true)
    }

    if (newQuery.trim() && !searchHistory.includes(newQuery.trim())) {
      setSearchHistory((prev) => [...prev, newQuery.trim()])
    }
  }, [hasStarted, searchHistory])

  const handleGiveUp = () => {
    setTimerRunning(false)
    setShowReveal(true)
  }

  const handleLogClick = (log: LogEntry) => {
    setSelectedLog(log)
    if (log.id === answerLog?.id) {
      setTimerRunning(false)
      setShowReveal(true)
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
    <section className="section bg-terminal-bg" id="futile-search">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Go ahead. Find the problem.
          </h2>
          <p className="text-terminal-muted text-lg mb-8">
            A user reports checkout is broken. Here are your logs. Find why.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showReveal ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Stats bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-terminal-muted" />
                  <Timer
                    isRunning={timerRunning}
                    onTimeUpdate={setElapsedSeconds}
                  />
                </div>
                {searchHistory.length > 0 && (
                  <span className="px-2 py-1 text-xs bg-terminal-accent/20 text-terminal-accent rounded-full">
                    {searchHistory.length} search{searchHistory.length !== 1 ? 'es' : ''}
                  </span>
                )}
                <span className="text-terminal-muted">
                  {filteredLogs.length} results
                </span>
                <span className="text-terminal-muted ml-auto text-xs">
                  Incidents like this happen 12x/week at the average company
                </span>
              </div>

              {/* Search box */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-terminal-accent" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Type to search logs..."
                  className={`search-input w-full pl-14 pr-4 py-4 rounded-lg text-lg ${
                    !hasStarted ? 'search-input-prominent' : ''
                  }`}
                />
              </div>

              {/* Search hints and give up button */}
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-terminal-muted">Try:</span>
                {['error', 'checkout', 'payment', 'timeout'].map((term) => (
                  <Button
                    key={term}
                    onClick={() => handleSearch(term)}
                    variant="secondary"
                    size="sm"
                    className="border-terminal-accent/50 text-terminal-accent hover:bg-terminal-accent/10"
                  >
                    {term}
                  </Button>
                ))}
                {hasStarted && elapsedSeconds < 30 && (
                  <>
                    <span className="text-terminal-muted">or</span>
                    <Button
                      onClick={handleGiveUp}
                      variant="secondary"
                      size="sm"
                    >
                      Give up
                    </Button>
                  </>
                )}
              </div>

              {/* Log viewer */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                  <span className="text-terminal-muted text-sm ml-2">logs — {logs.length} lines</span>
                </div>
                <div className="max-h-[400px] overflow-auto p-4 font-mono text-xs">
                  {filteredLogs.length === 0 ? (
                    <div className="text-terminal-muted text-center py-8">
                      No logs match your search
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        onClick={() => handleLogClick(log)}
                        className={`flex gap-2 py-0.5 cursor-pointer transition-colors rounded px-1 ${
                          selectedLog?.id === log.id
                            ? 'bg-terminal-accent/20'
                            : 'hover:bg-terminal-surface/50'
                        }`}
                      >
                        <span className="text-terminal-muted w-10 flex-shrink-0 text-right select-none">
                          {log.id + 1}
                        </span>
                        <span className={`flex-1 break-all ${getLevelColor(log.level)}`}>
                          {log.raw}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Give up button */}
              {hasStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 30 }} // Show after 30 seconds
                  className="flex justify-center"
                >
                  <Button variant="ghost" onClick={handleGiveUp}>
                    I give up — show me the answer
                  </Button>
                </motion.div>
              )}

            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Results summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                  <div className="text-terminal-muted text-sm">Time spent</div>
                  <div className="text-2xl font-bold text-terminal-error">
                    {formatSeconds(elapsedSeconds)}
                  </div>
                </div>
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                  <div className="text-terminal-muted text-sm">Searches attempted</div>
                  <div className="text-2xl font-bold text-terminal-warning">
                    {searchHistory.length}
                  </div>
                </div>
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                  <div className="text-terminal-muted text-sm">Root cause</div>
                  <div className="text-2xl font-bold text-terminal-error flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    {selectedLog?.id === answerLog?.id ? 'Found!' : 'Not found'}
                  </div>
                </div>
              </div>

              {/* The answer */}
              <div className="bg-terminal-surface border-2 border-terminal-accent rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-terminal-accent" />
                  <span className="text-terminal-accent font-medium">The answer was in line 848</span>
                </div>
                <div className="terminal-window">
                  <div className="p-4 font-mono text-sm">
                    <div className="flex gap-2">
                      <span className="text-terminal-accent">848</span>
                      <span className="text-terminal-error">{answerLog?.raw}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* The punchline */}
              <div className="border-t border-terminal-border pt-6">
                <p className="text-lg text-terminal-text mb-4">
                  <strong>Your team does this 12 times a week.</strong>
                </p>
                <a
                  href="#ai-analysis"
                  className="inline-flex items-center gap-2 text-terminal-accent hover:underline transition-colors"
                >
                  See how AI solves this →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
