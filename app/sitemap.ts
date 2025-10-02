import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shutdownusa.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ]
}