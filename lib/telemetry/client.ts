import type { AnalyticsEvent } from './types'

class AnalyticsTracker {
  private sessionId: string = ''
  private eventQueue: AnalyticsEvent[] = []
  private flushInterval: number = 5000
  private maxQueueSize: number = 50
  private scrollDepthMarkers: Set<number> = new Set()
  private pageStartTime: number = 0
  private visibleTime: number = 0
  private lastVisibilityChange: number = 0
  private isVisible: boolean = true
  private flushTimer: ReturnType<typeof setInterval> | null = null

  init() {
    if (typeof window === 'undefined') return

    this.sessionId = this.getOrCreateSessionId()
    this.pageStartTime = Date.now()
    this.lastVisibilityChange = Date.now()

    this.flushTimer = setInterval(() => this.flush(), this.flushInterval)

    this.trackPageView()

    document.addEventListener('click', this.handleClick.bind(this), { capture: true })

    this.setupScrollTracking()

    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))

    window.addEventListener('beforeunload', this.handleUnload.bind(this))
    window.addEventListener('pagehide', this.handleUnload.bind(this))
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''

    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  private trackPageView() {
    this.track({
      name: 'page_view',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      attributes: {
        'page.url': window.location.href,
        'page.referrer': document.referrer || 'direct',
        'page.title': document.title,
        'user_agent.original': navigator.userAgent,
        'screen.width': window.screen.width,
        'screen.height': window.screen.height,
      },
    })
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (!target) return

    const clickable = target.closest('button, a, [role="button"], [onclick]') as HTMLElement
    const element = clickable || target

    let elementType: 'button' | 'link' | 'other' = 'other'
    if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
      elementType = 'button'
    } else if (element.tagName === 'A') {
      elementType = 'link'
    }

    const textContent = (element.textContent || '').trim().slice(0, 100)

    this.track({
      name: 'click',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      attributes: {
        'element.tag': element.tagName.toLowerCase(),
        'element.id': element.id || '',
        'element.class': (typeof element.className === 'string' ? element.className : '').slice(0, 200),
        'element.text': textContent,
        'element.href': (element as HTMLAnchorElement).href || '',
        'element.type': elementType,
        'page.url': window.location.href,
        'click.x': event.clientX,
        'click.y': event.clientY,
      },
    })
  }

  private setupScrollTracking() {
    const depthMarkers = [25, 50, 75, 90, 100]
    let ticking = false

    const checkScrollDepth = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        ticking = false
        return
      }
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      depthMarkers.forEach((marker) => {
        if (scrollPercent >= marker && !this.scrollDepthMarkers.has(marker)) {
          this.scrollDepthMarkers.add(marker)
          this.track({
            name: 'scroll_depth',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            attributes: {
              'scroll.depth_percent': marker,
              'scroll.depth_pixels': scrollTop,
              'page.height': document.documentElement.scrollHeight,
              'page.url': window.location.href,
            },
          })
        }
      })
      ticking = false
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(checkScrollDepth)
          ticking = true
        }
      },
      { passive: true }
    )
  }

  private handleVisibilityChange() {
    const now = Date.now()
    if (document.visibilityState === 'hidden') {
      if (this.isVisible) {
        this.visibleTime += now - this.lastVisibilityChange
      }
      this.isVisible = false
    } else {
      this.isVisible = true
    }
    this.lastVisibilityChange = now
  }

  private handleUnload() {
    if (this.isVisible) {
      this.visibleTime += Date.now() - this.lastVisibilityChange
    }

    this.track({
      name: 'time_on_page',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      attributes: {
        'engagement.time_ms': Date.now() - this.pageStartTime,
        'page.url': window.location.href,
        'page.visible_time_ms': this.visibleTime,
      },
    })

    this.flush(true)
  }

  private track(event: AnalyticsEvent) {
    this.eventQueue.push(event)

    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flush()
    }
  }

  private async flush(useBeacon = false) {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    const payload = JSON.stringify({ events })

    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', payload)
    } else {
      try {
        await fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        })
      } catch {
        this.eventQueue = [...events.slice(-25), ...this.eventQueue].slice(0, this.maxQueueSize)
      }
    }
  }
}

let tracker: AnalyticsTracker | null = null

export function initAnalytics() {
  if (typeof window === 'undefined') return
  if (tracker) return

  tracker = new AnalyticsTracker()
  tracker.init()
}

export function getTracker() {
  return tracker
}
