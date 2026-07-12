import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Container } from './Container'
import { GlassCard } from './GlassCard'
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
      <section className="px-4 py-16">
        <Container className="max-w-3xl">
          <GlassCard className="p-8 md:p-12">
            <RichText data={page.content} />
          </GlassCard>
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
