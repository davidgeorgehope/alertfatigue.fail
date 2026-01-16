import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://alertfatigue.fail'),
  title: 'Alert Fatigue: The 3am Problem | Why Your Alerts Fail',
  description: 'Discover why 47 alerts at 3am means only 4 are actionable. Interactive exploration of alert fatigue and how AI-powered log analysis transforms observability. Try Elastic Streams.',
  keywords: ['alert fatigue', 'observability', 'log analysis', 'AI monitoring', 'Elastic', 'DevOps', 'SRE', 'on-call', 'incident response'],
  authors: [{ name: 'David', url: 'https://www.elastic.co' }],
  openGraph: {
    title: 'Alert Fatigue: The 3am Problem | Why Your Alerts Fail',
    description: 'Discover why 47 alerts at 3am means only 4 are actionable. Interactive exploration of alert fatigue and how AI-powered log analysis transforms observability.',
    url: 'https://alertfatigue.fail',
    siteName: 'alertfatigue.fail',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alert Fatigue: The 3am Problem | Why Your Alerts Fail',
    description: 'Discover why 47 alerts at 3am means only 4 are actionable. See how AI transforms observability.',
    site: '@elastic',
    creator: '@elastic',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.elastic.co/#organization',
      'name': 'Elastic',
      'url': 'https://www.elastic.co',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.elastic.co/favicon.ico'
      }
    },
    {
      '@type': 'WebPage',
      '@id': 'https://alertfatigue.fail/#webpage',
      'url': 'https://alertfatigue.fail',
      'name': 'Alert Fatigue: The 3am Problem',
      'description': 'Discover why 47 alerts at 3am means only 4 are actionable. Interactive exploration of alert fatigue and how AI-powered log analysis transforms observability.',
      'datePublished': '2024-12-20',
      'dateModified': '2024-12-20',
      'author': {
        '@type': 'Person',
        'name': 'David',
        'jobTitle': 'Director of Product Marketing, Observability',
        'worksFor': { '@id': 'https://www.elastic.co/#organization' }
      },
      'isPartOf': {
        '@type': 'WebSite',
        'url': 'https://alertfatigue.fail',
        'name': 'alertfatigue.fail'
      }
    },
    {
      '@type': 'Article',
      '@id': 'https://alertfatigue.fail/#article',
      'headline': 'Alert Fatigue: The 3am Problem',
      'description': 'An interactive exploration of why your alerts aren\'t helping and what AI-powered log analysis can do about it.',
      'datePublished': '2024-12-20',
      'dateModified': '2024-12-20',
      'author': {
        '@type': 'Person',
        'name': 'David',
        'jobTitle': 'Director of Product Marketing, Observability',
        'worksFor': { '@id': 'https://www.elastic.co/#organization' }
      },
      'publisher': { '@id': 'https://www.elastic.co/#organization' },
      'mainEntityOfPage': { '@id': 'https://alertfatigue.fail/#webpage' }
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
