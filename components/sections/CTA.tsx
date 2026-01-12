'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTA() {
  return (
    <section className="section bg-terminal-bg" id="cta">
      <div className="max-w-3xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            This is what Elastic Streams does.
          </h2>

          <p className="text-terminal-muted text-lg mb-8">
            Everything you just experienced. Available now. Works on your existing logs.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="https://www.elastic.co/elasticsearch/streams"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="glow" size="lg">
              Try Elastic Streams
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
          <a
            href="https://www.elastic.co/observability-labs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="lg">
              Read the blog posts
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </motion.div>

        {/* Author info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-terminal-border pt-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-terminal-accent to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
              D
            </div>
            <div className="text-center">
              <p className="text-terminal-text font-medium">
                Built by David
              </p>
              <p className="text-terminal-muted text-sm">
                Director of Product Marketing, Observability @ Elastic
              </p>
              <p className="text-terminal-muted text-xs mt-1">
                Who thinks about this stuff way too much.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-muted hover:text-terminal-accent transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-muted hover:text-terminal-accent transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-terminal-border"
        >
          <p className="text-terminal-muted text-xs">
            alertfatigue.fail — An interactive exploration of modern observability.
          </p>
          <p className="text-terminal-muted text-xs mt-1">
            Built with Next.js, Tailwind CSS, and too much caffeine.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
