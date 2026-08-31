import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'
import { SITE_URL } from '@/lib/site'

const staticRoutes = [
  { path: '', priority: 1, changeFrequency: 'daily' as const },
  { path: '/ueber-uns', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/aktivitaet', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/projekt', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/jugendarbeit', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/fluchtlingshilfe', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/zusammenleben', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kurse', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/spenden', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kontakt', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/datenschutzerklarung', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/impressum', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()

  const [projects, pages] = await Promise.all([
    payload.find({ collection: 'projects', limit: 500 }),
    payload.find({ collection: 'pages', where: { slug: { not_equals: 'ueber-uns' } }, limit: 500 }),
  ])

  const projectUrls = projects.docs.map((project) => ({
    url: `${SITE_URL}/projekt/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const pageUrls = pages.docs
    .filter((page) => page.slug)
    .map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const staticUrls = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  return [...staticUrls, ...projectUrls, ...pageUrls]
}
