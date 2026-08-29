import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
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

export const getPageMetadata = async (slug: string) => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const page = result.docs[0]
  if (!page) return {}
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || undefined,
  }
}
