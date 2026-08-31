import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { SITE_URL, SITE_NAME, SITE_LOCALE } from '@/lib/site'
import { Container } from './Container'
import { PageHero } from './PageHero'
import { RichText } from './RichText'

export const PageContent = async ({ slug }: { slug: string }) => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return (
    <>
      <PageHero eyebrow={page.heroEyebrow} title={page.title} subtitle={page.heroSubtitle} />
      <section className="section">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mosaic-strip mb-10 h-1 w-24 rounded-full" aria-hidden />
            <RichText data={page.content} />
          </div>
        </Container>
      </section>
    </>
  )
}

export const getPageMetadata = async (slug: string): Promise<Metadata> => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const page = result.docs[0]
  if (!page) return {}
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
