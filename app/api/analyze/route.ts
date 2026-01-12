import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { trace, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('analyze-api')

// Rate limiting (simple in-memory store)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  return tracer.startActiveSpan('analyze-logs', async (span) => {
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown'

      span.setAttributes({
        'http.client_ip': ip,
        'analyze.rate_limited': false,
      })

      if (!checkRateLimit(ip)) {
        span.setAttributes({ 'analyze.rate_limited': true })
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Rate limited' })
        span.end()
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      const { logs } = await request.json()

      if (!logs || !Array.isArray(logs)) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid request' })
        span.end()
        return NextResponse.json(
          { error: 'Invalid request: logs array required' },
          { status: 400 }
        )
      }

      span.setAttribute('analyze.log_count', logs.length)

      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        span.setAttribute('analyze.fallback', true)
        span.setStatus({ code: SpanStatusCode.OK })
        span.end()
        return NextResponse.json({
          diagram: getFallbackDiagram(),
          analysis: getFallbackAnalysis(),
          fallback: true,
        })
      }

      const client = new Anthropic({ apiKey })

      const logSample = logs.slice(0, 200).map((log: { raw: string }) => log.raw).join('\n')

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Analyze these application logs and create a Mermaid flowchart showing the service architecture and the error flow. Identify the root cause of any issues.

LOGS:
${logSample}

Respond with ONLY a JSON object in this exact format:
{
  "diagram": "flowchart LR\\n    A[service1] --> B[service2]\\n    ...",
  "analysis": {
    "rootCause": "Brief description of root cause",
    "affectedServices": ["service1", "service2"],
    "severity": "critical|high|medium|low",
    "annotations": [
      {"service": "service-name", "message": "issue description", "severity": "error|warning|info"}
    ]
  }
}

The diagram should:
1. Show all services mentioned in the logs
2. Highlight the error path in red using :::error class
3. Use flowchart LR (left-to-right) layout
4. Include databases/external services if mentioned`,
          },
        ],
      })

      span.setAttribute('analyze.model_used', 'claude-sonnet-4-20250514')

      const content = message.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type')
      }

      try {
        const result = JSON.parse(content.text)
        span.setAttribute('analyze.success', true)
        span.setStatus({ code: SpanStatusCode.OK })
        span.end()
        return NextResponse.json(result)
      } catch {
        const diagramMatch = content.text.match(/```mermaid\n([\s\S]*?)```/)
        if (diagramMatch) {
          span.setAttribute('analyze.extracted_diagram', true)
          span.setStatus({ code: SpanStatusCode.OK })
          span.end()
          return NextResponse.json({
            diagram: diagramMatch[1],
            analysis: {
              rootCause: 'Analysis extracted from logs',
              affectedServices: [],
              severity: 'high',
              annotations: [],
            },
          })
        }

        span.setAttribute('analyze.fallback', true)
        span.setStatus({ code: SpanStatusCode.OK })
        span.end()
        return NextResponse.json({
          diagram: getFallbackDiagram(),
          analysis: getFallbackAnalysis(),
          fallback: true,
        })
      }
    } catch (error) {
      console.error('Analysis error:', error)
      span.recordException(error as Error)
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Analysis failed' })
      span.end()
      return NextResponse.json({
        diagram: getFallbackDiagram(),
        analysis: getFallbackAnalysis(),
        fallback: true,
        error: 'Analysis failed, showing demo data',
      })
    }
  })
}

function getFallbackDiagram(): string {
  return `flowchart LR
    subgraph Frontend
        FE[frontend]
    end

    subgraph Services
        CS[checkout-service]
        PG[payment-gateway]:::error
        AS[auth-service]
        IS[inventory-service]
    end

    subgraph Data
        DB[(postgres)]
        REDIS[(redis)]
    end

    subgraph External
        STRIPE[stripe-api]:::error
    end

    FE --> CS
    CS --> PG
    CS --> AS
    CS --> IS
    CS --> DB
    CS --> REDIS
    PG --> STRIPE

    classDef error fill:#f85149,stroke:#f85149,color:#fff

    linkStyle 1 stroke:#f85149,stroke-width:3px
    linkStyle 6 stroke:#f85149,stroke-width:3px`
}

function getFallbackAnalysis() {
  return {
    rootCause: 'Payment gateway timeout due to upstream Stripe API failure',
    affectedServices: ['checkout-service', 'payment-gateway', 'stripe-api'],
    severity: 'critical',
    annotations: [
      { service: 'payment-gateway', message: '3 retry attempts failed', severity: 'error' },
      { service: 'payment-gateway', message: 'Response time: 30,000ms (timeout)', severity: 'error' },
      { service: 'checkout-service', message: 'Connection pool exhausted', severity: 'warning' },
      { service: 'stripe-api', message: 'Upstream dependency unavailable', severity: 'error' },
    ],
  }
}
