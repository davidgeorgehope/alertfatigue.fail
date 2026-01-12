import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Alert Fatigue | The 3am Problem',
  description: 'An interactive exploration of why your alerts aren\'t helping and what AI-powered log analysis can do about it.',
  openGraph: {
    title: 'Alert Fatigue | The 3am Problem',
    description: 'An interactive exploration of why your alerts aren\'t helping and what AI-powered log analysis can do about it.',
    url: 'https://alertfatigue.fail',
    siteName: 'alertfatigue.fail',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alert Fatigue | The 3am Problem',
    description: 'An interactive exploration of why your alerts aren\'t helping.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
