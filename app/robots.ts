import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://shutdownusa.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/analytics'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}