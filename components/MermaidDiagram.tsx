'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#101D2F',
    primaryTextColor: '#c9d1d9',
    primaryBorderColor: '#243147',
    lineColor: '#6A7FA0',
    secondaryColor: '#101D2F',
    tertiaryColor: '#101D2F',
    background: 'transparent',
    mainBkg: '#101D2F',
    nodeBorder: '#243147',
    clusterBkg: '#101D2F',
    clusterBorder: '#243147',
    titleColor: '#c9d1d9',
    edgeLabelBackground: '#0B1628',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
  },
})

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        console.error('Mermaid render error:', err)
        setError('Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className={`text-terminal-error text-center p-4 ${className}`}>
        {error}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// Pre-defined diagram for the demo (fallback if API fails)
export const defaultArchitectureDiagram = `
flowchart LR
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
        PG_DB[(postgres)]
        REDIS[(redis)]
    end

    subgraph External
        STRIPE[stripe-api]
    end

    FE --> CS
    CS --> PG
    CS --> AS
    CS --> IS
    CS --> PG_DB
    CS --> REDIS
    PG --> STRIPE

    classDef error fill:#f85149,stroke:#f85149,color:#fff

    linkStyle 1 stroke:#f85149,stroke-width:3px
`

export const errorAnnotations = [
  { service: 'payment-gateway', message: '3 retry attempts', severity: 'error' as const },
  { service: 'payment-gateway', message: 'Response time: 30,000ms (timeout)', severity: 'error' as const },
  { service: 'checkout-service', message: 'Connection pool: exhausted', severity: 'warning' as const },
  { service: 'Root cause', message: 'Upstream dependency failure', severity: 'error' as const },
]
