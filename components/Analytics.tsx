'use client'

import { useEffect } from 'react'
import { initAnalytics } from '@/lib/telemetry/client'

export function Analytics() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return null
}
