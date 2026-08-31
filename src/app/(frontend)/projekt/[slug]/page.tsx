import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { SITE_URL, SITE_NAME, SITE_LOCALE } from '@/lib/site'
import { Container } from '@/components/Container'
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
  const title = project.title
  const description = project.excerpt || undefined
  const canonical = `/projekt/${slug}`
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

export default async function ProjectDetailPage({ params }: Args) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const image = typeof project.coverImage === 'object' ? project.coverImage : null
  const date =
    typeof project.publishedDate === 'string'
      ? new Date(project.publishedDate).toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null
  const gallery = (project.gallery || [])
    .map((item) => (typeof item.image === 'object' ? item.image : null))
    .filter((img): img is NonNullable<typeof img> => img !== null && Boolean(img.url))
    // dedupe by media id (the same image can appear twice in the CMS list)
    .filter((img, i, all) => all.findIndex((other) => other.id === img.id) === i)

  return (
    <>
      <PageHero eyebrow={project.partner} title={project.title} subtitle={project.excerpt} />
      <section className="section">
        <Container>
          <div className="mx-auto max-w-3xl">
            {image?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={image.alt || project.title}
                className="mb-10 h-80 w-full rounded-3xl border-8 border-white object-cover shadow-[var(--shadow-card)]"
              />
            )}
            {(date || project.partner) && (
              <p className="mb-8 flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-lav-500">
                {date && <span>{date}</span>}
              </p>
            )}
            <div className="mosaic-strip mb-10 h-1.5 w-24 rounded-full" aria-hidden />
            <RichText data={project.content} />

            {gallery.length > 0 && (
              <div className="mt-14">
                <h2 className="mb-6 font-display text-2xl text-ocean-900">Galerie</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {gallery.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${img.id ?? 'img'}-${i}`}
                      src={img.url || ''}
                      alt={img.alt || `${project.title} – Bild ${i + 1}`}
                      className={`w-full rounded-2xl object-cover shadow-[var(--shadow-card)] ${
                        gallery.length % 3 === 1 && i === gallery.length - 1
                          ? 'sm:col-span-2 aspect-[2/1]'
                          : 'aspect-[4/3]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
