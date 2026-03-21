import type { MetadataRoute } from 'next'
import { PROJECTS } from '../src/data/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vraj-chauhan.tech'
  const now = new Date()

  const projectEntries: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${baseUrl}/project/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectEntries,
  ]
}
