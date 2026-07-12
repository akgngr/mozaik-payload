import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Slideshow } from '@/components/Slideshow'
import { ArrowRightIcon, iconMap } from '@/components/icons'
import type { Media } from '@/payload-types'

export default async function HomePage() {
  const payload = await getPayload()
  const [home, projects] = await Promise.all([
    payload.findGlobal({ slug: 'homepage' }),
    payload.find({ collection: 'projects', limit: 3, sort: 'order' }),
  ])

  const slides = (home.heroImages || [])
    .map((item) => item.image)
    .filter((img): img is Media => typeof img === 'object' && img !== null)
    .map((img) => ({ url: img.url || '', alt: img.alt || '' }))

  return (
    <>
      <section className="px-4 pt-6">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-0">
              <Slideshow slides={slides} />
            </div>
            <div className="relative flex min-h-[70vh] flex-col items-start justify-end gap-6 p-8 md:p-16">
              {home.heroEyebrow && (
                <span className="glass-strong inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  {home.heroEyebrow}
                </span>
              )}
              <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
                {home.heroTitle}
              </h1>
              {home.heroSubtitle && (
                <p className="max-w-xl text-lg text-white/85 md:text-xl">{home.heroSubtitle}</p>
              )}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button href="/spenden" variant="primary">
                  Jetzt spenden <ArrowRightIcon className="h-4 w-4" />
                </Button>
                <Button href="/ueber-uns" variant="secondary" className="text-white">
                  Über uns
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {(home.introTitle || home.introText) && (
        <section className="px-4 py-20">
          <Container className="max-w-3xl text-center">
            {home.introTitle && (
              <h2 className="text-3xl font-bold text-ocean-900 md:text-4xl">
                <span className="text-gradient">{home.introTitle}</span>
              </h2>
            )}
            {home.introText && <p className="mt-5 text-lg leading-relaxed text-ocean-800/80">{home.introText}</p>}
          </Container>
        </section>
      )}

      {home.highlightCards && home.highlightCards.length > 0 && (
        <section className="px-4 pb-20">
          <Container>
            <div className="grid gap-6 md:grid-cols-3">
              {home.highlightCards.map((card, i) => {
                const Icon = iconMap[card.icon || 'heart']
                const content = (
                  <GlassCard key={i} className="group h-full p-8 transition-transform hover:-translate-y-1">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-brand-500 text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-ocean-900">{card.title}</h3>
                    {card.text && <p className="text-ocean-800/75">{card.text}</p>}
                    {card.link && (
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                        Mehr erfahren <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </GlassCard>
                )
                return card.link ? (
                  <Link key={i} href={card.link} className="block h-full">
                    {content}
                  </Link>
                ) : (
                  content
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {projects.docs.length > 0 && (
        <section className="px-4 pb-20">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-ocean-900">
                Unsere <span className="text-gradient">Projekte</span>
              </h2>
              <Link href="/projekt" className="hidden text-sm font-semibold text-brand-600 md:inline-flex items-center gap-1">
                Alle Projekte <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
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
                        <h3 className="mb-2 text-lg font-semibold text-ocean-900">{project.title}</h3>
                        {project.excerpt && <p className="text-sm text-ocean-800/75">{project.excerpt}</p>}
                      </div>
                    </GlassCard>
                  </Link>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {(home.ctaTitle || home.ctaText) && (
        <section className="px-4 pb-24">
          <Container>
            <div className="glass-dark rounded-[2.5rem] p-10 text-center text-white md:p-16">
              {home.ctaTitle && <h2 className="text-3xl font-bold md:text-4xl">{home.ctaTitle}</h2>}
              {home.ctaText && <p className="mx-auto mt-4 max-w-2xl text-white/80">{home.ctaText}</p>}
              <div className="mt-8">
                <Button href="/spenden">
                  Jetzt spenden <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
