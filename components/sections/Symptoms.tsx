'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  RotateCcw,
  Search,
  Hash,
  X,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Activity,
  Terminal,
  MessageSquare,
  Database,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Tool definitions with their simulated UIs
interface Tool {
  id: string
  name: string
  icon: LucideIcon
  time: number
  thought: string
  url: string
  favicon: string
}

const tools: Tool[] = [
  {
    id: 'grafana',
    name: 'Grafana',
    icon: BarChart3,
    time: 3,
    thought: "Something's wrong... but what?",
    url: 'grafana.internal/d/checkout-service',
    favicon: '📊',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    icon: Activity,
    time: 5,
    thought: "Slow, but where's the actual error?",
    url: 'app.datadoghq.com/apm/traces',
    favicon: '🐕',
  },
  {
    id: 'splunk',
    name: 'Splunk',
    icon: Terminal,
    time: 7,
    thought: '2,847 results. Great.',
    url: 'splunk.internal/en-US/app/search',
    favicon: '🔍',
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    time: 4,
    thought: 'Nobody knows anything yet.',
    url: 'app.slack.com/client/incidents',
    favicon: '💬',
  },
  {
    id: 'grafana2',
    name: 'Grafana',
    icon: BarChart3,
    time: 3,
    thought: 'Back to square one...',
    url: 'grafana.internal/d/error-rates',
    favicon: '📊',
  },
  {
    id: 'kibana',
    name: 'Kibana',
    icon: Database,
    time: 8,
    thought: 'Which error actually matters?!',
    url: 'kibana.internal/app/discover',
    favicon: '🔎',
  },
]

// Grafana-style metrics panel
function GrafanaSimulator({ variant = 1 }: { variant?: number }) {
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 100)
    return () => clearTimeout(t)
  }, [])

  const title = variant === 1 ? 'checkout-service CPU %' : 'checkout-service Error Rate'
  const dataPoints = variant === 1
    ? [20, 22, 21, 23, 25, 24, 28, 45, 78, 92, 88, 85, 82]
    : [0.1, 0.2, 0.1, 0.3, 0.2, 0.4, 2.1, 8.5, 12.3, 15.2, 14.8, 13.1, 11.9]
  const maxVal = Math.max(...dataPoints)

  return (
    <div className="bg-[#111217] rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-300 text-sm font-medium">{title}</span>
        <span className="text-xs text-gray-500">Last 15 min</span>
      </div>
      <div className="h-32 flex items-end gap-1">
        {dataPoints.map((val, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: drawn ? `${(val / maxVal) * 100}%` : 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`flex-1 rounded-t ${
              val > maxVal * 0.7 ? 'bg-red-500' : val > maxVal * 0.4 ? 'bg-orange-500' : 'bg-green-500'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>03:00</span>
        <span className="text-red-400">↑ Spike at 03:07</span>
        <span>03:15</span>
      </div>
    </div>
  )
}

// Datadog-style trace view
function DatadogSimulator() {
  return (
    <div className="bg-[#1a1a2e] rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-purple-300 text-sm font-medium">Trace: checkout-flow</span>
        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Slow</span>
      </div>
      <div className="space-y-2">
        {[
          { name: 'frontend', duration: '12ms', width: '10%', color: 'bg-blue-500' },
          { name: 'api-gateway', duration: '8ms', width: '8%', color: 'bg-blue-400' },
          { name: 'checkout-service', duration: '2,847ms', width: '95%', color: 'bg-red-500' },
          { name: '├─ auth-service', duration: '45ms', width: '15%', color: 'bg-green-500', indent: true },
          { name: '├─ inventory', duration: '120ms', width: '25%', color: 'bg-green-500', indent: true },
          { name: '└─ payment-gateway', duration: '2,650ms', width: '90%', color: 'bg-red-500', indent: true },
        ].map((span, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-2 ${span.indent ? 'ml-4' : ''}`}
          >
            <span className="text-xs text-gray-400 w-32 truncate">{span.name}</span>
            <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: span.width }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                className={`h-full ${span.color} rounded`}
              />
            </div>
            <span className={`text-xs w-16 text-right ${span.duration.includes('2,') ? 'text-red-400' : 'text-gray-500'}`}>
              {span.duration}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 text-yellow-500" />
        <span>payment-gateway is slow, but no error logged</span>
      </div>
    </div>
  )
}

// Splunk-style log search
function SplunkSimulator() {
  const logs = [
    { time: '03:07:12', level: 'ERROR', msg: 'Connection reset by peer' },
    { time: '03:07:13', level: 'WARN', msg: 'Retry attempt 1/3 failed' },
    { time: '03:07:14', level: 'ERROR', msg: 'Request timeout after 30000ms' },
    { time: '03:07:14', level: 'ERROR', msg: 'Connection refused: payment-svc' },
    { time: '03:07:15', level: 'WARN', msg: 'Circuit breaker OPEN' },
  ]

  return (
    <div className="bg-black rounded-lg p-4 h-full font-mono">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-green-500" />
        <div className="flex-1 bg-gray-900 rounded px-3 py-1.5 text-sm text-green-400 border border-green-500/30">
          index=prod error checkout | head 100
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-2">
        <span className="text-green-400">2,847</span> results (0.234 seconds)
      </div>
      <div className="space-y-1 text-xs max-h-28 overflow-hidden">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-2"
          >
            <span className="text-gray-600">{log.time}</span>
            <span className={log.level === 'ERROR' ? 'text-red-500' : 'text-yellow-500'}>
              {log.level}
            </span>
            <span className="text-gray-400 truncate">{log.msg}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        ... and 2,842 more results
      </div>
    </div>
  )
}

// Slack-style channel view
function SlackSimulator() {
  const messages = [
    { user: 'alice', avatar: 'A', time: '3:05 AM', msg: 'Anyone else seeing checkout issues?', color: 'bg-blue-500' },
    { user: 'bob', avatar: 'B', time: '3:06 AM', msg: 'Checking now...', color: 'bg-green-500' },
    { user: 'carol', avatar: 'C', time: '3:07 AM', msg: 'Metrics look weird but idk', color: 'bg-purple-500' },
    { user: 'dave', avatar: 'D', time: '3:08 AM', msg: 'Payment team is OOO until Monday', color: 'bg-orange-500' },
  ]

  return (
    <div className="bg-[#1a1d21] rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
        <Hash className="w-4 h-4 text-gray-400" />
        <span className="text-white font-medium">incidents</span>
        <span className="text-xs text-gray-500">12 members</span>
      </div>
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex gap-2"
          >
            <div className={`w-8 h-8 rounded ${msg.color} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
              {msg.avatar}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-white text-sm font-medium">{msg.user}</span>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
              <p className="text-gray-300 text-sm">{msg.msg}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Kibana-style discover view
function KibanaSimulator() {
  const errors = [
    { time: '03:07:14.123', service: 'checkout', msg: 'Connection timeout to payment-gateway' },
    { time: '03:07:14.456', service: 'payment', msg: 'SSL handshake failed' },
    { time: '03:07:14.789', service: 'checkout', msg: 'Upstream request failed' },
    { time: '03:07:15.012', service: 'inventory', msg: 'Cache miss for product-123' },
    { time: '03:07:15.234', service: 'checkout', msg: 'Transaction rollback initiated' },
  ]

  return (
    <div className="bg-[#0b1219] rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-pink-400" />
        <div className="flex-1 bg-[#1d2531] rounded px-3 py-1.5 text-sm text-gray-300 border border-pink-500/30">
          service:checkout AND level:error
        </div>
      </div>
      <div className="flex items-center gap-4 mb-2 text-xs">
        <span className="text-pink-400">512 hits</span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-500">Selected fields: @timestamp, service, message</span>
      </div>
      <div className="space-y-1 text-xs">
        {errors.map((err, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-2 py-1 border-b border-gray-800"
          >
            <span className="text-gray-600 w-24 flex-shrink-0">{err.time}</span>
            <span className="text-cyan-400 w-16 flex-shrink-0">{err.service}</span>
            <span className="text-gray-400 truncate">{err.msg}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        Showing 5 of 512 documents
      </div>
    </div>
  )
}

export function Symptoms() {
  const [step, setStep] = useState(-1) // -1 = not started
  const [totalTime, setTotalTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [openTabs, setOpenTabs] = useState<string[]>([])

  const isComplete = step >= tools.length

  const handleNext = async () => {
    if (step < tools.length - 1) {
      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 600))
      setIsLoading(false)

      const nextStep = step + 1
      setStep(nextStep)
      setTotalTime((prev) => prev + tools[nextStep].time)

      // Add to tabs if not already there
      const toolName = tools[nextStep].name
      if (!openTabs.includes(toolName)) {
        setOpenTabs((prev) => [...prev, toolName])
      }
    } else if (step === tools.length - 1) {
      setStep(tools.length) // Complete
    }
  }

  const handleStart = () => {
    setStep(0)
    setTotalTime(tools[0].time)
    setOpenTabs([tools[0].name])
  }

  const handleReset = () => {
    setStep(-1)
    setTotalTime(0)
    setOpenTabs([])
  }

  const renderToolUI = () => {
    if (step < 0) return null
    const currentTool = tools[Math.min(step, tools.length - 1)]

    switch (currentTool.id) {
      case 'grafana':
        return <GrafanaSimulator variant={1} />
      case 'datadog':
        return <DatadogSimulator />
      case 'splunk':
        return <SplunkSimulator />
      case 'slack':
        return <SlackSimulator />
      case 'grafana2':
        return <GrafanaSimulator variant={2} />
      case 'kibana':
        return <KibanaSimulator />
      default:
        return null
    }
  }

  return (
    <section className="section bg-terminal-surface/30" id="symptoms">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            Alert fatigue is a{' '}
            <span className="text-terminal-accent">system problem.</span>
          </h2>

        </motion.div>

        {/* Interactive tool journey - Browser simulation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[#202124] border border-[#3c4043] rounded-lg overflow-hidden shadow-2xl"
        >
          {/* Browser chrome - Tab bar */}
          <div className="bg-[#202124] pt-2 px-2">
            <div className="flex items-center gap-1">
              {/* Window controls */}
              <div className="flex items-center gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
              </div>

              {/* Tabs */}
              <div className="flex items-end gap-0.5 flex-1 overflow-x-auto ml-2">
                {step < 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#292b2e] rounded-t-lg text-sm text-gray-400">
                    <span>New Tab</span>
                  </div>
                ) : (
                  openTabs.map((tab, i) => {
                    const tool = tools.find(t => t.name === tab)
                    const tabIndex = tools.findIndex((t, idx) => t.name === tab && tools.slice(0, idx).filter(x => x.name === tab).length === openTabs.slice(0, i).filter(x => x === tab).length)
                    const isActive = step >= 0 && tools[step]?.name === tab &&
                      openTabs.slice(0, i + 1).filter(x => x === tab).length === openTabs.slice(0, step + 1).filter(x => x === tools[step]?.name).length
                    const actuallyActive = i === openTabs.length - 1 || (step < openTabs.length && openTabs[step] === tab && i === step)
                    const isCurrentTab = tools[step]?.name === tab && i === openTabs.filter((t, idx) => idx <= step && t === tab).length - 1

                    return (
                      <motion.div
                        key={`${tab}-${i}`}
                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: 'auto' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm min-w-[120px] max-w-[180px] ${
                          isCurrentTab
                            ? 'bg-[#292b2e] text-white'
                            : 'bg-[#202124] text-gray-500 hover:bg-[#292b2e]/50'
                        }`}
                      >
                        <span className="text-xs">{tool?.favicon}</span>
                        <span className="truncate flex-1">{tab}</span>
                        <X className="w-3.5 h-3.5 opacity-50 hover:opacity-100 flex-shrink-0" />
                      </motion.div>
                    )
                  })
                )}
                {/* New tab button */}
                <div className="flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-[#292b2e] rounded-lg cursor-pointer mb-0.5">
                  <span className="text-lg leading-none">+</span>
                </div>
              </div>

              {/* Time counter */}
              <div className="flex items-center gap-2 px-3 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="font-mono">
                  <span className={`font-bold ${totalTime > 20 ? 'text-red-400' : totalTime > 10 ? 'text-yellow-400' : 'text-white'}`}>
                    {totalTime}
                  </span>
                  <span className="text-xs ml-1">min</span>
                </span>
              </div>
            </div>
          </div>

          {/* URL Bar */}
          <div className="bg-[#292b2e] px-3 py-2 flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1 bg-[#202124] rounded-full px-4 py-1.5 flex items-center">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-gray-400 text-sm font-mono">
                {step >= 0 ? tools[step]?.url : 'about:blank'}
              </span>
            </div>
            {step >= 0 && (
              <Button onClick={handleReset} variant="ghost" className="text-gray-500 hover:text-gray-300 p-1">
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Tool UI area */}
          <div className="p-4 min-h-[320px] bg-[#292b2e]">
            <AnimatePresence mode="wait">
              {step < 0 ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <TrendingUp className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-xl text-white mb-2">Incident Alert: checkout-service</h3>
                  <p className="text-gray-400 mb-6">Latency spike detected. Time to investigate.</p>
                  <Button onClick={handleStart} size="lg">
                    Start Investigation
                  </Button>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 bg-[#292b2e]"
                >
                  <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <p className="text-gray-400">Loading {tools[step + 1]?.name}...</p>
                </motion.div>
              ) : isComplete ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-red-500">{totalTime}</span>
                  </div>
                  <h3 className="text-xl text-red-500 font-bold mb-2">
                    Root cause: still unknown.
                  </h3>
                  <p className="text-gray-400 mb-2">
                    {openTabs.length} tabs. {totalTime} minutes. Zero answers.
                  </p>
                  <p className="text-gray-500 text-sm">
                    This happens 12x/week at the average company.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={tools[step].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-64"
                >
                  {renderToolUI()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with thought and next button */}
          {step >= 0 && !isComplete && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-4 border-t border-[#3c4043] bg-[#202124] flex items-center justify-between"
            >
              <p className="text-base italic text-yellow-400/90 flex-1">
                &ldquo;{tools[step].thought}&rdquo;
              </p>
              <Button onClick={handleNext} variant="glow" size="md">
                {step < tools.length - 1 ? `Try ${tools[step + 1].name} →` : 'Give up'}
              </Button>
            </motion.div>
          )}

          {/* Progress dots */}
          {step >= 0 && (
            <div className="flex justify-center gap-2 py-3 bg-[#202124]">
              {tools.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < step ? 'bg-gray-600' : i === step ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
