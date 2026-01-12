import { NextRequest, NextResponse } from 'next/server'
import { trace, SpanKind, Attributes } from '@opentelemetry/api'
import type { AnalyticsEvent } from '@/lib/telemetry/types'

const tracer = trace.getTracer('client-analytics')

export async function POST(request: NextRequest) {
  try {
    const { events } = (await request.json()) as { events: AnalyticsEvent[] }

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 })
    }

    for (const event of events) {
      const span = tracer.startSpan(`analytics.${event.name}`, {
        kind: SpanKind.INTERNAL,
        startTime: event.timestamp,
        attributes: {
          'analytics.event_name': event.name,
          'analytics.session_id': event.sessionId,
          ...flattenAttributes(event.attributes),
        },
      })
      span.end(event.timestamp + 1)
    }

    return NextResponse.json({ received: events.length })
  } catch (error) {
    console.error('Telemetry error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

function flattenAttributes(attrs: Record<string, unknown>): Attributes {
  const result: Attributes = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value
    }
  }
  return result
}
