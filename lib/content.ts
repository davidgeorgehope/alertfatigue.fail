/**
 * Centralized content data for alertfatigue.fail
 * Single source of truth for Markdown generation
 */

export const siteMetadata = {
  title: 'Alert Fatigue: The 3am Problem',
  description: 'An interactive exploration of why your alerts fail and how AI-powered log analysis transforms incident response.',
  url: 'https://alertfatigue.fail',
  author: {
    name: 'David',
    title: 'Director of Product Marketing, Observability',
    company: 'Elastic',
    companyUrl: 'https://www.elastic.co',
  },
  datePublished: '2024-12-20',
  dateModified: new Date().toISOString().split('T')[0],
}

export interface Section {
  id: string
  title: string
  content: string[]
  content2?: string[]
  bullets?: string[]
  stats?: { label: string; value: string }[]
  faqs?: { question: string; answer: string }[]
  links?: { label: string; url: string }[]
  author?: { name: string; title: string; tagline: string }
  interactive?: {
    description: string
    keyInsights: string[]
  }
}

export const sections: Section[] = [
  {
    id: 'hook',
    title: "It's 3am. Your phone is buzzing. Again.",
    content: [
      "Another alert. Another context switch. Another 30 minutes gathering data before you even know if it's real.",
      "By the time you find the answer, the incident is either resolved or escalated. You're exhausted. Your team is exhausted.",
      "You've accepted this as normal.",
      "There's a better way.",
    ],
    stats: [
      { label: 'Alerts this week', value: '47' },
      { label: 'Actionable', value: '4' },
    ],
  },
  {
    id: 'symptoms',
    title: 'Alert fatigue is a system problem.',
    content: [
      "When an incident hits, engineers cycle through multiple tools trying to find the root cause.",
    ],
    interactive: {
      description: 'Interactive browser simulation showing the typical incident investigation journey through multiple observability tools.',
      keyInsights: [
        'Grafana (3 min) — "Something\'s wrong... but what?"',
        'Datadog (5 min) — "Slow, but where\'s the actual error?"',
        'Splunk (7 min) — "2,847 results. Great."',
        'Slack (4 min) — "Nobody knows anything yet."',
        'Grafana again (3 min) — "Back to square one..."',
        'Kibana (8 min) — "Which error actually matters?!"',
        'Total time: 30 minutes. Root cause: Still unknown.',
        'This happens 12x/week at the average company.',
      ],
    },
  },
  {
    id: 'log-problem',
    title: 'The answer is in your logs. Somewhere.',
    content: [
      "Your logs contain the answer to every incident. The problem is finding it.",
      "5,000 lines per second. Good luck.",
    ],
    interactive: {
      description: 'Animated terminal showing logs streaming at high velocity, illustrating the impossibility of manual log analysis.',
      keyInsights: [
        'Logs stream at 5,000+ lines per second',
        'The signal is buried in noise',
        'Manual searching is futile at this scale',
      ],
    },
  },
  {
    id: 'futile-search',
    title: 'Go ahead. Find the problem.',
    content: [
      "A user reports checkout is broken. Here are your logs. Find why.",
      "Incidents like this happen 12x/week at the average company.",
    ],
    interactive: {
      description: 'Interactive log search challenge where users try to find the root cause in 1,000 log lines.',
      keyInsights: [
        'The answer is buried in line 848',
        'Most engineers give up before finding it',
        'Average time spent: 30+ minutes',
        'Your team does this 12 times a week',
      ],
    },
  },
  {
    id: 'ai-analysis',
    title: 'Your logs contain a service map.',
    content: [
      "An LLM can read every log line and tell you what's happening.",
      "Your logs record every interaction, every call, every failure. Hidden in that chaos:",
    ],
    bullets: [
      'Which services talk to which',
      'Normal patterns',
      "Where things are breaking right now",
    ],
    content2: [
      "Buried in unstructured text across dozens of sources. LLMs extract it automatically.",
    ],
    interactive: {
      description: 'Demo showing AI analyzing chaotic logs and generating a service architecture diagram with annotated errors.',
      keyInsights: [
        'AI processes logs in seconds, not minutes',
        'Automatically maps service dependencies',
        'Identifies root cause: Payment gateway timeout',
        'Time to insight: ~3 seconds vs 34+ minutes manual',
        'Searches required: 0',
      ],
    },
  },
  {
    id: 'log-sorting',
    title: 'Logs that sort themselves.',
    content: [
      "Your logs are chaos. Different formats, different services, different schemas, all in the same bucket.",
      "AI organizes them automatically.",
      "Using log format fingerprinting, AI recognizes the structure of each log line and groups similar logs together.",
      "No manual tagging. No brittle pipelines. No regex.",
      "94% accuracy. Automatic. Instant.",
    ],
    interactive: {
      description: 'Toggle between chaotic mixed logs and AI-organized categories (K8s Events, App Logs, Auth, Database, HTTP Access, System).',
      keyInsights: [
        'Log format fingerprinting identifies structure automatically',
        'Groups similar logs without configuration',
        '94% accuracy on first pass',
        'No regex patterns needed',
      ],
    },
  },
  {
    id: 'grok-demo',
    title: 'Stop fighting with Grok.',
    content: [
      "Even when you find the right logs, the data you need is buried in a message blob.",
      "timestamp? Buried. log.level? Buried. user.id? Buried.",
      "Traditionally, you'd write Grok patterns. Regex. Ingest pipelines. Pray you don't break production.",
      "AI writes them for you.",
    ],
    interactive: {
      description: 'Demo showing AI automatically parsing a raw log line into structured fields.',
      keyInsights: [
        'Raw log: "2024-12-20T03:14:24.312Z ERROR checkout-service Database connection pool exhausted active_connections=20 waiting_requests=147"',
        'Extracted fields: @timestamp, log.level, service.name, message, connections.active, connections.waiting',
        'Time to parse: 10 seconds',
        'No regex. No guessing. No 2-hour debugging sessions.',
      ],
    },
  },
  {
    id: 'significant-events',
    title: 'Stop hunting. Start knowing.',
    content: [
      "Even organized, parsed logs are still a lot of logs.",
      "You need the error, the anomaly, the thing that broke.",
      "Significant Events surfaces them automatically.",
      "AI identifies the signals you care about:",
    ],
    bullets: [
      'Errors and exceptions',
      'Anomalous patterns',
      'Critical warnings',
      'State changes',
    ],
    content2: [
      "The needle finds you.",
      "Before you're paged. Before the user complains. Before the 3am wake-up.",
    ],
    interactive: {
      description: 'Display of automatically surfaced significant events with expandable details.',
      keyInsights: [
        'ERROR: OOM in checkout-service pod-7f8d9 — Container exceeded memory limit',
        'WARNING: Connection pool exhausted (20/20 active) — Database connections maxed',
        'ANOMALY: payment-gateway latency 4x normal — Response times increased from ~200ms to ~800ms',
        'These were surfaced automatically. No query. No search. No hunting.',
      ],
    },
  },
  {
    id: 'contrast',
    title: 'Same incident. Two realities.',
    content: [
      "That 3am alert. Two ways to handle it.",
    ],
    stats: [
      { label: 'Reality A: Today', value: '34 minutes to root cause' },
      { label: 'Reality B: With AI', value: '90 seconds to root cause' },
      { label: 'Improvement', value: '23x faster' },
    ],
    interactive: {
      description: 'Side-by-side timeline comparison of traditional vs AI-powered incident response.',
      keyInsights: [
        'Reality A (Today): Alert → On-call alert → Grafana → Datadog → Splunk → Multiple searches → 34 minutes',
        'Reality B (AI): Alert → Open logs → See Significant Event → Click for context → 90 seconds',
        '23x faster time to root cause',
      ],
    },
  },
  {
    id: 'principles',
    title: 'Frequently asked questions',
    content: [
      'How to escape alert fatigue and transform your incident response.',
    ],
    faqs: [
      {
        question: 'Where should I start when investigating incidents?',
        answer: "Make logs your first stop, not your last. Logs have the richest context—stop treating them as a last resort.",
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
    ],
  },
  {
    id: 'cta',
    title: 'This is what Elastic Streams does.',
    content: [
      'Available now. Works on your existing logs.',
    ],
    links: [
      { label: 'Try Elastic Streams', url: 'https://www.elastic.co/elasticsearch/streams' },
      { label: 'Read the blog posts', url: 'https://www.elastic.co/observability-labs' },
    ],
    author: {
      name: 'David',
      title: 'Director of Product Marketing, Observability @ Elastic',
      tagline: 'Observability enthusiast.',
    },
  },
]

// Helper to check section types
export function hasFaqs(section: Section): boolean {
  return 'faqs' in section && section.faqs !== undefined
}

export function hasLinks(section: Section): boolean {
  return 'links' in section && section.links !== undefined
}

export function hasContent2(section: Section): boolean {
  return 'content2' in section && section.content2 !== undefined
}
