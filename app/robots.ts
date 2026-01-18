import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/index.md'],
    },
    sitemap: 'https://alertfatigue.fail/sitemap.xml',
  }
}
