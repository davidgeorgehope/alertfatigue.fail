'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

const faqs = [
  {
    question: 'Where should I start when investigating incidents?',
    answer: 'Make logs your first stop, not your last. Logs have the richest context—stop treating them as a last resort.',
  },
  {
    question: 'How can I avoid writing complex log parsing patterns?',
    answer: 'Let AI organize and parse your logs. You have better things to do than write Grok patterns manually.',
  },
  {
    question: 'How do I find important signals in noisy logs?',
    answer: "Surface signals automatically. Don't make humans hunt for needles—let the needles find you.",
  },
  {
    question: 'What should I alert on to reduce alert fatigue?',
    answer: 'Alert on causes, not just symptoms. "CPU is high" is a symptom. "Connection pool exhausted" is a cause.',
  },
  {
    question: 'What metrics should I track for incident response?',
    answer: 'Measure time to why, not just time to acknowledge. MTTA is vanity. Time to root cause is sanity.',
  },
]

export function Principles() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section className="section bg-terminal-surface/30" id="principles">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Frequently asked questions
          </h2>
          <p className="text-terminal-muted text-lg">
            How to escape alert fatigue and transform your incident response.
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-terminal-surface border border-terminal-border rounded-lg p-6 hover:border-terminal-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-terminal-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-terminal-accent font-bold">Q</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-terminal-text mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-terminal-muted">{faq.answer}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(`Q: ${faq.question}\nA: ${faq.answer}`, idx)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-terminal-bg rounded"
                  title="Copy to clipboard"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-terminal-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-terminal-muted" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-terminal-muted text-sm">
            Click any question to copy it. Share with your team.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
