import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { GlassCard } from '@/components/GlassCard'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'

type Args = { params: Promise<{ slug: string }> }

const getProject = async (slug: string) => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return { title: project.title, description: project.excerpt || undefined }
}

export default async function ProjectDetailPage({ params }: Args) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const image = typeof project.coverImage === 'object' ? project.coverImage : null

  return (
    <>
      <PageHero eyebrow={project.partner} title={project.title} subtitle={project.excerpt} />
      <section className="px-4 py-16">
        <Container className="max-w-3xl">
          <GlassCard className="overflow-hidden p-0">
            {image?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image.url} alt={image.alt || project.title} className="h-72 w-full object-cover" />
            )}
            <div className="p-8 md:p-12">
              <RichText data={project.content} />
            </div>
          </GlassCard>
        </Container>
      </section>
    </>
  )
}
