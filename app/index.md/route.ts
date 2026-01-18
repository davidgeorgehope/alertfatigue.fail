import { NextResponse } from 'next/server'
import { generateMarkdown, getMarkdownContentType } from '@/lib/markdown'

/**
 * Route handler for /index.md
 * Serves the Markdown version of the page
 */
export async function GET() {
  const markdown = generateMarkdown()

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': getMarkdownContentType(),
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
