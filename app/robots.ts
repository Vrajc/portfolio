import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://vraj-chauhan.tech/sitemap.xml',
    host: 'https://vraj-chauhan.tech',
  }
}
