// Realistic log dataset for the interactive demo
// The "answer" is embedded at line ~847: upstream_timeout_ms=30000 target=payment-gateway

export interface LogEntry {
  id: number
  timestamp: string
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  service: string
  message: string
  raw: string
  category: 'k8s' | 'app' | 'auth' | 'database' | 'http' | 'system'
}

const services = [
  'checkout-service',
  'payment-gateway',
  'auth-service',
  'user-service',
  'inventory-service',
  'cart-service',
  'notification-service',
  'api-gateway',
  'order-service',
  'shipping-service',
]

const k8sServices = [
  'kube-scheduler',
  'kube-controller-manager',
  'etcd',
  'coredns',
  'ingress-nginx',
]

// Templates for different log types
const logTemplates = {
  debug: [
    'Processing request id={requestId}',
    'Cache lookup for key={cacheKey}',
    'Executing query: SELECT * FROM {table} WHERE id={id}',
    'Serializing response payload size={size}',
    'Validating request parameters',
    'Loading configuration from environment',
    'Connection pool stats: active={active} idle={idle}',
    'Rate limiter check: bucket={bucket} remaining={remaining}',
  ],
  info: [
    'Request completed status=200 duration={duration}ms',
    'User {userId} logged in successfully',
    'Order {orderId} created total={total}',
    'Payment processed amount={amount} currency=USD',
    'Cache hit rate={rate}%',
    'Health check passed',
    'Deployment {version} rolled out successfully',
    'Scheduled job {jobName} completed',
    'Session created for user={userId}',
    'Inventory updated product={productId} quantity={qty}',
  ],
  warn: [
    'High memory usage: {usage}% of limit',
    'Slow query detected duration={duration}ms query={query}',
    'Rate limit approaching threshold={threshold}',
    'Retry attempt {attempt}/3 for {operation}',
    'Connection pool running low available={available}',
    'Certificate expiring in {days} days',
    'Deprecated API endpoint accessed path={path}',
    'Queue depth exceeding threshold current={depth}',
  ],
  error: [
    'Failed to process request error="{error}"',
    'Database connection failed host={host} error="{error}"',
    'Authentication failed for user={userId}',
    'Payment declined order={orderId} reason="{reason}"',
    'Service unavailable endpoint={endpoint}',
    'Timeout waiting for response from {service}',
    'Invalid request payload: {error}',
    'Circuit breaker opened for {service}',
    'Out of memory: killed process {pid}',
  ],
  k8s: [
    'Pod {pod} scheduled on node {node}',
    'Container {container} started in pod {pod}',
    'Liveness probe failed for {pod}',
    'Readiness probe failed for {pod}',
    'OOMKilled: container {container} exceeded memory limit',
    'CrashLoopBackOff: {pod} restarting',
    'Pulling image {image}',
    'Successfully pulled image {image}',
    'Created container {container}',
    'Volume {volume} mounted to {pod}',
  ],
}

// Seeded PRNG (mulberry32) for deterministic output across server/client
function createSeededRandom(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let seededRandom = createSeededRandom(42)

// Random ID generators
const randomId = () => {
  let result = ''
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(seededRandom() * chars.length)]
  }
  return result
}
const randomInt = (min: number, max: number) => Math.floor(seededRandom() * (max - min + 1)) + min
const randomFloat = (min: number, max: number) => (seededRandom() * (max - min) + min).toFixed(2)

// Generate a random timestamp within a 2-hour incident window
function generateTimestamp(baseTime: Date, offsetMs: number): string {
  const time = new Date(baseTime.getTime() + offsetMs)
  return time.toISOString().replace('T', ' ').substring(0, 23) + 'Z'
}

// Fill in template placeholders
function fillTemplate(template: string): string {
  return template
    .replace('{requestId}', randomId())
    .replace('{cacheKey}', `cache:${randomId()}`)
    .replace('{table}', ['users', 'orders', 'products', 'sessions'][randomInt(0, 3)])
    .replace('{id}', randomInt(1000, 9999).toString())
    .replace('{size}', randomInt(100, 50000).toString())
    .replace('{active}', randomInt(5, 20).toString())
    .replace('{idle}', randomInt(0, 10).toString())
    .replace('{bucket}', ['api', 'auth', 'checkout'][randomInt(0, 2)])
    .replace('{remaining}', randomInt(0, 100).toString())
    .replace('{duration}', randomInt(10, 3000).toString())
    .replace('{userId}', `user-${randomInt(100, 999)}`)
    .replace('{orderId}', `ORD-${randomInt(10000, 99999)}`)
    .replace('{total}', randomFloat(10, 500))
    .replace('{amount}', randomFloat(10, 500))
    .replace('{rate}', randomInt(70, 99).toString())
    .replace('{version}', `v${randomInt(1, 3)}.${randomInt(0, 9)}.${randomInt(0, 99)}`)
    .replace('{jobName}', ['cleanup', 'sync', 'report', 'backup'][randomInt(0, 3)])
    .replace('{productId}', `PROD-${randomInt(1000, 9999)}`)
    .replace('{qty}', randomInt(-10, 100).toString())
    .replace('{usage}', randomInt(70, 95).toString())
    .replace('{query}', 'SELECT * FROM orders WHERE...')
    .replace('{threshold}', randomInt(80, 95).toString())
    .replace('{attempt}', randomInt(1, 3).toString())
    .replace('{operation}', ['database', 'cache', 'external-api'][randomInt(0, 2)])
    .replace('{available}', randomInt(1, 5).toString())
    .replace('{days}', randomInt(7, 30).toString())
    .replace('{path}', ['/api/v1/users', '/api/v1/orders', '/api/v1/products'][randomInt(0, 2)])
    .replace('{depth}', randomInt(1000, 5000).toString())
    .replace('{error}', ['connection refused', 'timeout', 'invalid response', 'permission denied'][randomInt(0, 3)])
    .replace('{host}', ['db-primary', 'db-replica', 'redis-master'][randomInt(0, 2)])
    .replace('{reason}', ['insufficient funds', 'card declined', 'fraud detected'][randomInt(0, 2)])
    .replace('{endpoint}', ['payment-gateway', 'auth-service', 'inventory-service'][randomInt(0, 2)])
    .replace('{service}', ['payment-gateway', 'auth-service', 'inventory-service'][randomInt(0, 2)])
    .replace('{pod}', `${services[randomInt(0, services.length - 1)]}-${randomId().substring(0, 5)}`)
    .replace('{node}', `node-${randomInt(1, 5)}`)
    .replace('{container}', ['app', 'sidecar', 'init'][randomInt(0, 2)])
    .replace('{image}', `gcr.io/project/${services[randomInt(0, services.length - 1)]}:latest`)
    .replace('{volume}', ['config', 'secrets', 'data'][randomInt(0, 2)])
    .replace('{pid}', randomInt(1000, 9999).toString())
}

// Generate different log formats
function generateLogFormats(entry: { timestamp: string; level: string; service: string; message: string }): string {
  const format = randomInt(0, 4)

  switch (format) {
    case 0: // JSON format
      return JSON.stringify({
        '@timestamp': entry.timestamp,
        level: entry.level,
        service: entry.service,
        message: entry.message,
      })
    case 1: // Common log format
      return `${entry.timestamp} [${entry.level}] ${entry.service}: ${entry.message}`
    case 2: // Kubernetes style
      return `${entry.timestamp} ${entry.level.toLowerCase().charAt(0)} ${entry.service} ${entry.message}`
    case 3: // Structured with key=value
      return `ts=${entry.timestamp} level=${entry.level.toLowerCase()} svc=${entry.service} msg="${entry.message}"`
    default: // Plain
      return `${entry.timestamp} ${entry.level} [${entry.service}] ${entry.message}`
  }
}

// Determine category based on service and message
function determineCategory(service: string, message: string): LogEntry['category'] {
  if (k8sServices.includes(service) || message.includes('Pod') || message.includes('Container')) {
    return 'k8s'
  }
  if (message.includes('auth') || message.includes('login') || message.includes('session') || service === 'auth-service') {
    return 'auth'
  }
  if (message.includes('database') || message.includes('query') || message.includes('connection pool')) {
    return 'database'
  }
  if (message.includes('Request') || message.includes('status=') || message.includes('endpoint')) {
    return 'http'
  }
  if (message.includes('memory') || message.includes('CPU') || message.includes('disk')) {
    return 'system'
  }
  return 'app'
}

// Generate the full log dataset
export function generateLogs(): LogEntry[] {
  // Reset seed for deterministic output (fixes SSR hydration mismatch)
  seededRandom = createSeededRandom(42)
  const logs: LogEntry[] = []
  const baseTime = new Date('2024-12-20T03:00:00.000Z')
  const totalLogs = 1000

  // Distribution: 40% DEBUG, 35% INFO, 15% WARN, 10% ERROR
  const levelDistribution = [
    { level: 'DEBUG' as const, weight: 40, templates: logTemplates.debug },
    { level: 'INFO' as const, weight: 35, templates: logTemplates.info },
    { level: 'WARN' as const, weight: 15, templates: logTemplates.warn },
    { level: 'ERROR' as const, weight: 10, templates: logTemplates.error },
  ]

  for (let i = 0; i < totalLogs; i++) {
    const offsetMs = (i / totalLogs) * 2 * 60 * 60 * 1000 // Spread over 2 hours
    const timestamp = generateTimestamp(baseTime, offsetMs + randomInt(0, 1000))

    // Add some K8s logs
    if (randomInt(0, 10) === 0) {
      const template = logTemplates.k8s[randomInt(0, logTemplates.k8s.length - 1)]
      const service = k8sServices[randomInt(0, k8sServices.length - 1)]
      const message = fillTemplate(template)

      const entry = { timestamp, level: 'INFO' as const, service, message }
      logs.push({
        id: i,
        ...entry,
        raw: generateLogFormats(entry),
        category: 'k8s',
      })
      continue
    }

    // THE ANSWER - embed at position ~847
    if (i === 847) {
      const criticalLog = {
        timestamp,
        level: 'ERROR' as const,
        service: 'checkout-service',
        message: 'upstream request failed upstream_timeout_ms=30000 target=payment-gateway retry_count=3 correlation_id=req-7f8a2b',
      }
      logs.push({
        id: i,
        ...criticalLog,
        raw: `${timestamp} ERROR [checkout-service] upstream request failed upstream_timeout_ms=30000 target=payment-gateway retry_count=3 correlation_id=req-7f8a2b`,
        category: 'app',
      })
      continue
    }

    // Add related logs near the answer to make it harder to find
    if (i >= 840 && i <= 855 && i !== 847) {
      const relatedLogs = [
        { level: 'DEBUG' as const, service: 'checkout-service', message: `Processing checkout for order ORD-${randomInt(10000, 99999)}` },
        { level: 'INFO' as const, service: 'payment-gateway', message: `Payment request received amount=${randomFloat(10, 500)}` },
        { level: 'WARN' as const, service: 'cart-service', message: 'Cart validation slow duration=1200ms' },
        { level: 'DEBUG' as const, service: 'inventory-service', message: 'Stock check completed items=5' },
        { level: 'INFO' as const, service: 'notification-service', message: 'Email queued template=order_confirmation' },
        { level: 'DEBUG' as const, service: 'api-gateway', message: 'Routing request to checkout-service' },
        { level: 'INFO' as const, service: 'auth-service', message: `Token validated for user-${randomInt(100, 999)}` },
        { level: 'WARN' as const, service: 'payment-gateway', message: 'Connection pool at 80% capacity' },
      ]
      const related = relatedLogs[randomInt(0, relatedLogs.length - 1)]
      const entry = { timestamp, ...related }
      logs.push({
        id: i,
        ...entry,
        raw: generateLogFormats(entry),
        category: determineCategory(related.service, related.message),
      })
      continue
    }

    // Regular log generation
    const rand = randomInt(0, 99)
    let cumulative = 0
    let selectedLevel = levelDistribution[0]

    for (const level of levelDistribution) {
      cumulative += level.weight
      if (rand < cumulative) {
        selectedLevel = level
        break
      }
    }

    const template = selectedLevel.templates[randomInt(0, selectedLevel.templates.length - 1)]
    const service = services[randomInt(0, services.length - 1)]
    const message = fillTemplate(template)

    const entry = { timestamp, level: selectedLevel.level, service, message }
    logs.push({
      id: i,
      ...entry,
      raw: generateLogFormats(entry),
      category: determineCategory(service, message),
    })
  }

  return logs
}

// Pre-generated logs for consistent experience
let cachedLogs: LogEntry[] | null = null

export function getLogs(): LogEntry[] {
  if (!cachedLogs) {
    cachedLogs = generateLogs()
  }
  return cachedLogs
}

// Search logs client-side
export function searchLogs(logs: LogEntry[], query: string): LogEntry[] {
  if (!query.trim()) return logs

  const lowerQuery = query.toLowerCase()
  return logs.filter(
    (log) =>
      log.raw.toLowerCase().includes(lowerQuery) ||
      log.message.toLowerCase().includes(lowerQuery) ||
      log.service.toLowerCase().includes(lowerQuery)
  )
}

// Get the answer log
export function getAnswerLog(logs: LogEntry[]): LogEntry | undefined {
  return logs.find((log) => log.id === 847)
}

// Group logs by category
export function groupLogsByCategory(logs: LogEntry[]): Record<LogEntry['category'], LogEntry[]> {
  const groups: Record<LogEntry['category'], LogEntry[]> = {
    k8s: [],
    app: [],
    auth: [],
    database: [],
    http: [],
    system: [],
  }

  for (const log of logs) {
    groups[log.category].push(log)
  }

  return groups
}

// Get significant events (pre-defined for demo)
export function getSignificantEvents(logs: LogEntry[]): LogEntry[] {
  const significantIds = [847, 234, 567] // Pre-defined "significant" events

  // Add some additional error logs as significant
  const errors = logs.filter((log) => log.level === 'ERROR').slice(0, 3)
  const warnings = logs.filter((log) => log.level === 'WARN' && log.message.includes('pool')).slice(0, 2)

  const significant = [
    ...logs.filter((log) => significantIds.includes(log.id)),
    ...errors,
    ...warnings,
  ]

  // Dedupe and limit
  const seen = new Set<number>()
  return significant.filter((log) => {
    if (seen.has(log.id)) return false
    seen.add(log.id)
    return true
  }).slice(0, 5)
}
