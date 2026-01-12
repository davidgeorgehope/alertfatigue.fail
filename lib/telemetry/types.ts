export interface AnalyticsEvent {
  name: string
  timestamp: number
  sessionId: string
  attributes: Record<string, string | number | boolean>
}

export interface PageViewEvent extends AnalyticsEvent {
  name: 'page_view'
  attributes: {
    'page.url': string
    'page.referrer': string
    'page.title': string
    'user_agent.original': string
    'screen.width': number
    'screen.height': number
  }
}

export interface ClickEvent extends AnalyticsEvent {
  name: 'click'
  attributes: {
    'element.tag': string
    'element.id': string
    'element.class': string
    'element.text': string
    'element.href': string
    'element.type': 'button' | 'link' | 'other'
    'page.url': string
    'click.x': number
    'click.y': number
  }
}

export interface ScrollEvent extends AnalyticsEvent {
  name: 'scroll_depth'
  attributes: {
    'scroll.depth_percent': number
    'scroll.depth_pixels': number
    'page.height': number
    'page.url': string
  }
}

export interface TimeOnPageEvent extends AnalyticsEvent {
  name: 'time_on_page'
  attributes: {
    'engagement.time_ms': number
    'page.url': string
    'page.visible_time_ms': number
  }
}
