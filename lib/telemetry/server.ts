import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

let sdk: NodeSDK | null = null

export function setupServerTelemetry() {
  if (sdk) return

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  if (!endpoint) {
    console.log('[OTEL] No OTEL_EXPORTER_OTLP_ENDPOINT configured, skipping telemetry setup')
    return
  }

  const headers = parseHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS || '')

  const traceExporter = new OTLPTraceExporter({
    url: `${endpoint}/v1/traces`,
    headers,
  })

  const metricExporter = new OTLPMetricExporter({
    url: `${endpoint}/v1/metrics`,
    headers,
  })

  sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME || 'alertfatigue-fail',
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-http': { enabled: true },
        '@opentelemetry/instrumentation-winston': { enabled: false },
      }),
    ],
  })

  sdk.start()
  console.log('[OTEL] Server telemetry initialized')

  process.on('SIGTERM', () => {
    sdk?.shutdown()
      .then(() => console.log('[OTEL] Telemetry shut down'))
      .catch((err) => console.error('[OTEL] Error shutting down', err))
  })
}

function parseHeaders(headerString: string): Record<string, string> {
  const headers: Record<string, string> = {}
  if (!headerString) return headers

  headerString.split(',').forEach((pair) => {
    const [key, ...valueParts] = pair.split('=')
    const value = valueParts.join('=')
    if (key && value) headers[key.trim()] = value.trim()
  })
  return headers
}
