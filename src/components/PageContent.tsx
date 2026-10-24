import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { SITE_URL, SITE_NAME, SITE_LOCALE } from '@/lib/site'
import { breadcrumbSchema, webPageSchema, jsonLdGraph } from '@/lib/seo'
import { Container } from './Container'
import { PageHero } from './PageHero'
import { RichText } from './RichText'

export const PageContent = async ({ slug }: { slug: string }) => {
  let page: any = null

  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    page = result.docs[0]
  } catch {
    // Database unreachable during build or downtime fallback
  }

  if (!page) {
    page = {
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      heroEyebrow: 'Mosaik Dialog und Kultur e.V.',
      heroSubtitle: '',
      content: null,
    }
  }

  const pageTitle = page.title === 'Über Uns' ? 'Über uns' : page.title

  const jsonLd = jsonLdGraph(
    webPageSchema({
      title: pageTitle,
      slug,
      description: page.heroSubtitle || page.seo?.metaDescription || null,
    }),
    breadcrumbSchema([
      { name: 'Startseite', path: '/' },
      { name: pageTitle, path: `/${slug}` },
    ]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero eyebrow={page.heroEyebrow} title={pageTitle} subtitle={page.heroSubtitle} />
      <section className="section">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mosaic-strip mb-10 h-1 w-24 rounded-full" aria-hidden />
            {page.content && <RichText data={page.content} />}
          </div>
        </Container>
      </section>
    </>
  )
}

export const getPageMetadata = async (slug: string): Promise<Metadata> => {
  let page: any = null

  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    page = result.docs[0]
  } catch {
    // Database unreachable during build or downtime fallback
  }

  if (!page) {
    return {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | ${SITE_NAME}`,
      alternates: { canonical: `/${slug}` },
    }
  }

  const title = page.seo?.metaTitle || page.title
  const description = page.seo?.metaDescription || undefined
  const canonical = `/${slug}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: description
      ? {
          type: 'website',
          locale: SITE_LOCALE,
          url: `${SITE_URL}${canonical}`,
          siteName: SITE_NAME,
          title,
          description,
        }
      : undefined,
    twitter: description
      ? { card: 'summary_large_image', title, description }
      : undefined,
  }
}
