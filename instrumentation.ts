export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setupServerTelemetry } = await import('./lib/telemetry/server')
    setupServerTelemetry()
  }
}
