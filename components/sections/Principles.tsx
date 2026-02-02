'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const faqs: { question: string; answer: string }[] = [
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

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyAllFaqs = async () => {
    try {
      const allText = faqs
        .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
        .join('\n\n')
      await navigator.clipboard.writeText(allText)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch (err) {
      console.error('Failed to copy all:', err)
    }
  }

  return (
    <div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="group bg-terminal-surface border border-terminal-border rounded-lg hover:border-terminal-accent/50 transition-colors"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-terminal-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-terminal-accent font-bold text-sm">Q</span>
              </div>
              <h3 className="flex-1 text-base font-semibold text-terminal-text">
                {faq.question}
              </h3>
              <motion.div
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-terminal-muted flex-shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pl-[4.25rem] flex items-start gap-3">
                    <p className="text-terminal-muted flex-1">{faq.answer}</p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(`Q: ${faq.question}\nA: ${faq.answer}`, idx)
                      }}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-terminal-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-terminal-muted" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={copyAllFaqs}
          variant="secondary"
          size="sm"
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4 text-terminal-success mr-2" />
              <span className="text-terminal-success">Copied all FAQs!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-terminal-muted mr-2" />
              <span className="text-terminal-muted">Copy all FAQs</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
