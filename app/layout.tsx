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
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://alertfatigue.fail/#faq',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Where should I start when investigating incidents?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Make logs your first stop, not your last. Logs have the richest context—stop treating them as a last resort.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How can I avoid writing complex log parsing patterns?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Let AI organize and parse your logs. You have better things to do than write Grok patterns manually.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I find important signals in noisy logs?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "Surface signals automatically. Don't make humans hunt for needles—let the needles find you."
          }
        },
        {
          '@type': 'Question',
          'name': 'What should I alert on to reduce alert fatigue?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Alert on causes, not just symptoms. "CPU is high" is a symptom. "Connection pool exhausted" is a cause.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What metrics should I track for incident response?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Measure time to why, not just time to acknowledge. MTTA is vanity. Time to root cause is sanity.'
          }
        }
      ]
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
