import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { GlassCard } from '@/components/GlassCard'
import { PageHero } from '@/components/PageHero'

export const metadata = { title: 'Projekte' }

export default async function ProjektIndexPage() {
  const payload = await getPayload()
  const projects = await payload.find({ collection: 'projects', limit: 50, sort: 'order' })

  return (
    <>
      <PageHero
        eyebrow="Gemeinsam aktiv"
        title="Unsere Projekte"
        subtitle="Ein Überblick über unsere laufenden Kooperationen und Initiativen."
      />
      <section className="px-4 py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.docs.map((project) => {
              const image = typeof project.coverImage === 'object' ? project.coverImage : null
              return (
                <Link key={project.id} href={`/projekt/${project.slug}`}>
                  <GlassCard className="h-full overflow-hidden transition-transform hover:-translate-y-1">
                    {image?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image.url} alt={image.alt || project.title} className="h-48 w-full object-cover" />
                    )}
                    <div className="p-6">
                      {project.partner && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                          {project.partner}
                        </span>
                      )}
                      <h2 className="mb-2 mt-1 text-lg font-semibold text-ocean-900">{project.title}</h2>
                      {project.excerpt && <p className="text-sm text-ocean-800/75">{project.excerpt}</p>}
                    </div>
                  </GlassCard>
                </Link>
              )
            })}
            {projects.docs.length === 0 && (
              <p className="text-ocean-800/70">Aktuell sind keine Projekte hinterlegt.</p>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
