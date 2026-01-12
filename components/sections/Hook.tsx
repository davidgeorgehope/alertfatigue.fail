'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, AlertTriangle } from 'lucide-react'

export function Hook() {
  const [showNotification, setShowNotification] = useState(false)
  const [isVibrating, setIsVibrating] = useState(false)

  useEffect(() => {
    // Show notification after a short delay
    const timer = setTimeout(() => {
      setShowNotification(true)
      setIsVibrating(true)

      // Stop vibrating after 2 seconds
      setTimeout(() => setIsVibrating(false), 2000)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="section relative overflow-hidden" id="hook">
      <div className="max-w-3xl mx-auto w-full text-center relative z-10">
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            It&apos;s 3am.
            <br />
            <span className="text-terminal-error">Your phone is buzzing.</span>
            <br />
            Again.
          </h1>

          <div className="space-y-6 text-lg md:text-xl text-terminal-muted max-w-2xl mx-auto">
            <p>
              Another alert. Another context switch. Another 30 minutes gathering
              data before you even know if it&apos;s real.
            </p>
            <p>
              By the time you find the answer — <em>if</em> you find it — the
              incident is either resolved or escalated. You&apos;re exhausted. Your
              team is exhausted.
            </p>
            <p className="text-terminal-text font-medium">
              This isn&apos;t sustainable. But you&apos;ve accepted it as normal.
            </p>
            <p className="text-terminal-accent text-2xl font-bold mt-8">
              It doesn&apos;t have to be.
            </p>
          </div>
        </motion.div>

        {/* Alert counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-terminal-surface border border-terminal-border rounded-full"
        >
          <Bell className="w-4 h-4 text-terminal-warning" />
          <span className="text-terminal-muted text-sm">
            You&apos;ve been alerted{' '}
            <span className="text-terminal-warning font-bold">47 times</span> this
            week.{' '}
            <span className="text-terminal-success font-bold">4</span> were
            actionable.
          </span>
        </motion.div>
      </div>

      {/* Phone notification overlay */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 md:top-8 md:right-8"
          >
            <div
              className={`phone-notification rounded-2xl p-4 w-80 ${
                isVibrating ? 'animate-vibrate' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-terminal-error/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-terminal-error" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-terminal-muted">PagerDuty</span>
                    <span className="text-xs text-terminal-muted">now</span>
                  </div>
                  <p className="text-sm font-medium text-terminal-error mb-1">
                    CRITICAL: checkout-service
                  </p>
                  <p className="text-xs text-terminal-muted truncate">
                    latency &gt; 2000ms for 5 minutes
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-1 px-3 py-1.5 text-xs bg-terminal-error/20 text-terminal-error rounded-lg hover:bg-terminal-error/30 transition-colors"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-1 px-3 py-1.5 text-xs bg-terminal-surface text-terminal-muted rounded-lg hover:bg-terminal-border/50 transition-colors"
                >
                  Snooze
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terminal-error/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terminal-accent/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
