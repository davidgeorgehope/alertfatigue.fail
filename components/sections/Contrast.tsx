'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

const realityA = [
  { step: 'Alert fires', time: '0:00', cumulative: 0 },
  { step: 'Check on-call alert', time: '0:30', cumulative: 0.5 },
  { step: 'Open Grafana', time: '1:00', cumulative: 1 },
  { step: 'Check metrics dashboard', time: '3:00', cumulative: 3 },
  { step: 'Open Datadog', time: '5:00', cumulative: 5 },
  { step: 'Search traces', time: '8:00', cumulative: 8 },
  { step: 'Give up, open Splunk', time: '12:00', cumulative: 12 },
  { step: 'Search logs: "error"', time: '15:00', cumulative: 15 },
  { step: 'Search logs: "checkout"', time: '18:00', cumulative: 18 },
  { step: 'Search logs: "payment"', time: '22:00', cumulative: 22 },
  { step: 'Find something maybe relevant', time: '28:00', cumulative: 28 },
  { step: 'Confirm root cause', time: '34:00', cumulative: 34 },
]

const realityB = [
  { step: 'Alert fires', time: '0:00', cumulative: 0 },
  { step: 'Open logs', time: '0:15', cumulative: 0.25 },
  { step: 'See Significant Event: "payment-gateway timeout"', time: '0:20', cumulative: 0.33 },
  { step: 'Click → see context, related logs, timeline', time: '0:45', cumulative: 0.75 },
  { step: 'Root cause confirmed', time: '1:30', cumulative: 1.5 },
]

export function Contrast() {
  return (
    <section className="section bg-terminal-bg" id="contrast">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Same incident. Two realities.
          </h2>
          <p className="text-terminal-muted text-lg">
            That 3am alert. Two ways to handle it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reality A - The old way */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-terminal-surface border border-terminal-error/30 rounded-lg overflow-hidden"
          >
            <div className="p-4 border-b border-terminal-border flex items-center gap-2">
              <XCircle className="w-5 h-5 text-terminal-error" />
              <span className="font-semibold text-terminal-text">Reality A: Today</span>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {realityA.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-terminal-muted font-mono w-12 flex-shrink-0">
                      {item.time}
                    </span>
                    <div className="flex-1 h-2 bg-terminal-bg rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.cumulative / 34) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="h-full bg-terminal-error/50 rounded-full"
                      />
                    </div>
                    <span className="text-terminal-muted text-xs flex-1">{item.step}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-terminal-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-terminal-error" />
                  <span className="text-terminal-error font-bold text-2xl">34 minutes</span>
                </div>
                <span className="text-terminal-muted text-sm">to root cause</span>
              </div>
            </div>
          </motion.div>

          {/* Reality B - With AI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-terminal-surface border border-terminal-success/30 rounded-lg overflow-hidden"
          >
            <div className="p-4 border-b border-terminal-border flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-terminal-success" />
              <span className="font-semibold text-terminal-text">Reality B: With AI-powered logs</span>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {realityB.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-terminal-muted font-mono w-12 flex-shrink-0">
                      {item.time}
                    </span>
                    <div className="flex-1 h-2 bg-terminal-bg rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.cumulative / 1.5) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="h-full bg-terminal-success/50 rounded-full"
                      />
                    </div>
                    <span className="text-terminal-text text-xs flex-1">{item.step}</span>
                  </motion.div>
                ))}
              </div>

              {/* Empty space to align with Reality A */}
              <div className="h-[168px]" />

              <div className="mt-6 pt-4 border-t border-terminal-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-terminal-success" />
                  <span className="text-terminal-success font-bold text-2xl">90 seconds</span>
                </div>
                <span className="text-terminal-muted text-sm">to root cause</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* The punchline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 p-6 bg-terminal-surface border border-terminal-border rounded-lg">
            <div className="text-center">
              <div className="text-terminal-error font-bold text-3xl">34:00</div>
              <div className="text-terminal-muted text-sm">before</div>
            </div>
            <div className="text-terminal-muted text-2xl">→</div>
            <div className="text-center">
              <div className="text-terminal-success font-bold text-3xl">1:30</div>
              <div className="text-terminal-muted text-sm">after</div>
            </div>
            <div className="text-terminal-muted text-2xl">=</div>
            <div className="text-center">
              <div className="text-terminal-accent font-bold text-3xl">23x</div>
              <div className="text-terminal-muted text-sm">faster</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
