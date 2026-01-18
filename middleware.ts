import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for content negotiation
 * Redirects to /index.md when Accept: text/markdown is requested on root
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply content negotiation to the root path
  if (pathname === '/') {
    const acceptHeader = request.headers.get('accept') || ''

    // Check if the client prefers Markdown
    // Parse Accept header to handle quality values (e.g., "text/markdown;q=0.9")
    const acceptTypes = acceptHeader.split(',').map((type) => type.trim().split(';')[0])

    if (acceptTypes.includes('text/markdown')) {
      // Rewrite to the Markdown route
      const url = request.nextUrl.clone()
      url.pathname = '/index.md'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only run middleware on the root path
    '/',
  ],
}
