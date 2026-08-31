import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Slideshow } from '@/components/Slideshow'
import { MosaicPattern } from '@/components/MosaicPattern'
import { Animated } from '@/components/Animated'
import { HomeEventsSection } from '@/components/HomeEventsSection'
import { FaqAccordion, type FaqItem } from '@/components/FaqAccordion'
import { jsonLdGraph, faqSchema, organizationSchema, websiteSchema } from '@/lib/seo'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOCALE } from '@/lib/site'
import {
  ArrowRightIcon,
  iconMap,
  HandshakeIllustIcon,
  GlobeIllustIcon,
  DialogIllustIcon,
  SproutIllustIcon,
  SolidarityIllustIcon,
  CreativityIllustIcon,
} from '@/components/icons'
import type { Media, Event as EventType } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const home = await payload.findGlobal({ slug: 'homepage' })

  const heroTitle = home.heroTitle || SITE_NAME
  const title = `${heroTitle} | Bildung & Integration`
  const description = home.heroSubtitle || SITE_DESCRIPTION

  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: `${SITE_URL}/mosaik-emblem.png`, width: 440, height: 530, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/mosaik-emblem.png`],
    },
  }
}

// FAQ based on the organisation's real data (no fabricated facts)
const faqItems: FaqItem[] = [
  {
    question: 'Was ist Mosaik Dialog und Kultur e.V.?',
    answer:
      'Mosaik Dialog und Kultur ist ein eingetragener gemeinnütziger Verein mit Sitz in Rüsselsheim. Sein Ziel ist die Förderung von Bildung, Jugendarbeit und interkulturellem Dialog.',
  },
  {
    question: 'Welche Angebote und Programme gibt es?',
    answer:
      'Der Verein bietet Sprachkurse, Nachhilfe, Sprachcafés, interkulturelle Kochabende, Familien-Kreativnachmittage, Bewerbungstrainings und Nachbarschaftsdialoge an. Das Angebot richtet sich an Kinder, Jugendliche und Erwachsene.',
  },
  {
    question: 'Wo ist der Verein tätig?',
    answer:
      'Der Standort ist in der Bahnhofstr. 20 in 65428 Rüsselsheim. Der Wirkungskreis umfasst den Kreis Groß-Gerau und den Main-Taunus-Kreis.',
  },
  {
    question: 'Wann ist das Büro geöffnet?',
    answer:
      'Das Büro ist von Montag bis Freitag zwischen 10:00 und 17:00 Uhr erreichbar. Am Wochenende bleibt es geschlossen.',
  },
  {
    question: 'Wie kann ich den Verein unterstützen?',
    answer:
      'Sie können den Verein mit einer Spende unterstützen. Überweisen Sie dazu an IBAN DE10 5085 2553 0016 0896 58 (Kreissparkasse Groß-Gerau) mit dem Verwendungszweck „Spende“.',
  },
  {
    question: 'Seit wann besteht der Verein?',
    answer: 'Der Verein Mosaik Dialog und Kultur wurde im Jahr 2015 gegründet.',
  },
  {
    question: 'Wie erreiche ich den Verein?',
    answer:
      'Erreichbar sind Sie unter der E-Mail-Adresse kontakt@mosaik-russelsheim.de oder telefonisch unter +49 179-7051273.',
  },
]


// Pastel accents cycling through the brand palette
const accentColors = [
  { icon: 'bg-brand-50 text-brand-600', bar: 'bg-brand-400', link: 'text-brand-600' },
  { icon: 'bg-aqua-50 text-aqua-600', bar: 'bg-aqua-400', link: 'text-aqua-600' },
  { icon: 'bg-lav-50 text-lav-600', bar: 'bg-lav-400', link: 'text-lav-600' },
  { icon: 'bg-salmon-50 text-salmon-600', bar: 'bg-salmon-400', link: 'text-salmon-600' },
  { icon: 'bg-citrus-50 text-citrus-600', bar: 'bg-citrus-400', link: 'text-citrus-600' },
  { icon: 'bg-leaf-50 text-leaf-600', bar: 'bg-leaf-400', link: 'text-leaf-600' },
]

// Fallback demo events if CMS is empty
const initialDemoEvents: Partial<EventType>[] = [
  {
    id: 1,
    title: 'Interkulturelles Sprachcafé',
    category: 'education',
    eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: 'Mosaik Begegnungszentrum, Bahnhofstr. 20, Rüsselsheim',
    excerpt:
      'Zwangloses Deutsch sprechen bei Kaffee, Tee und Gebäck. Für alle Niveaustufen offen.',
    isHighlight: true,
  },
  {
    id: 2,
    title: 'Familien-Kreativnachmittag',
    category: 'youth',
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    location: 'Mosaik e.V., Bahnhofstr. 20, Rüsselsheim',
    excerpt:
      'Gemeinsam malen, basteln und spielen für Kinder und Eltern. Ein bunter Nachmittag.',
    isHighlight: false,
  },
  {
    id: 3,
    title: 'Interkultureller Kochabend: Rezepte aus aller Welt',
    category: 'culture',
    eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    location: 'Gemeinschaftsküche Rüsselsheim',
    excerpt:
      'Wir kochen zusammen traditionelle Gerichte und tauschen Geschichten aus.',
    isHighlight: true,
  },
]

const werteList = [
  { Icon: HandshakeIllustIcon, label: 'Begegnung', color: 'text-brand-500', bg: 'bg-brand-50' },
  { Icon: GlobeIllustIcon,     label: 'Vielfalt',   color: 'text-lav-500',  bg: 'bg-lav-50'  },
  { Icon: DialogIllustIcon,    label: 'Dialog',     color: 'text-aqua-600', bg: 'bg-aqua-50' },
  { Icon: SproutIllustIcon,    label: 'Wachstum',   color: 'text-leaf-600', bg: 'bg-leaf-50' },
  { Icon: SolidarityIllustIcon,label: 'Solidarität',color: 'text-salmon-600',bg: 'bg-salmon-50'},
  { Icon: CreativityIllustIcon,label: 'Kreativität',color: 'text-citrus-600',bg:'bg-citrus-50'},
]

export default async function HomePage() {
  const payload = await getPayload()
  const [home, projects, eventsResult] = await Promise.all([
    payload.findGlobal({ slug: 'homepage' }),
    payload.find({ collection: 'projects', limit: 3, sort: '-publishedDate' }),
    payload.find({ collection: 'events', limit: 3, sort: 'eventDate' }),
  ])

  const upcomingEvents =
    eventsResult.docs.length > 0
      ? eventsResult.docs
      : (initialDemoEvents as EventType[])


  const media = (home.heroImages || [])
    .map((item) => item.image)
    .filter((img): img is Media => typeof img === 'object' && img !== null)
  const slides = media.map((img) => ({ url: img.url || '', alt: img.alt || '' }))
  const secondaryImage = media[1] ?? media[0] ?? null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqItems)),
        }}
      />
      {/* ── HERO ── */}
      <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden">
        <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-48 select-none opacity-20 md:w-72" />
        <Container className="relative max-w-7xl">
          <div className="grid items-center gap-14 py-16 md:py-20 lg:grid-cols-2">
            <div>
              {home.heroEyebrow && (
                <Animated variant="fade-up" delay={0}>
                  <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border-2 border-brand-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-400" aria-hidden />
                    {home.heroEyebrow}
                  </span>
                </Animated>
              )}
              <Animated variant="fade-up" delay={80}>
                <h1 className="text-balance font-display text-5xl leading-[1.02] text-ocean-900 md:text-6xl xl:text-7xl">
                  {home.heroTitle || 'Mosaik Dialog und Kultur e.V.'}
                </h1>
              </Animated>
              {home.heroSubtitle && (
                <Animated variant="fade-up" delay={180}>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-ocean-700/90">
                    {home.heroSubtitle}
                  </p>
                </Animated>
              )}
              <Animated variant="fade-up" delay={260}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="/spenden" variant="primary">
                    Jetzt spenden <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                  <Button href="/ueber-uns" variant="secondary">
                    Über uns
                  </Button>
                </div>
              </Animated>
            </div>


            {/* Photo collage */}
            <Animated variant="fade-left" delay={200}>
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white shadow-[var(--shadow-card-hover)]">
                  <div className="aspect-[4/3]">
                    <Slideshow slides={slides} />
                  </div>
                </div>
                {secondaryImage?.url && slides.length > 1 && (
                  <div className="absolute -bottom-10 -left-4 hidden w-48 rotate-[-6deg] overflow-hidden rounded-3xl border-8 border-white shadow-[var(--shadow-card-hover)] sm:block lg:-left-10 lg:w-56">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={secondaryImage.url}
                      alt={secondaryImage.alt || ''}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                )}
                <div className="absolute -right-5 -top-8 hidden h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-[var(--shadow-card)] md:flex">
                  <Image src="/mosaik-emblem.png" alt="" width={440} height={530} className="h-full w-auto" />
                </div>
              </div>
            </Animated>
          </div>
        </Container>
      </section>

      <div className="mosaic-strip h-1.5 w-full" aria-hidden />

      {/* ── ÜBER UNS TEASER ── Clean split layout with icon row */}
      {(home.introTitle || home.introText) && (
        <section className="section relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{ background: 'linear-gradient(135deg, #eefaf9 0%, #faf6ef 55%, #f7f4fc 100%)' }}
          />
          <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-56 select-none opacity-12" />

          <Container className="relative max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">

              {/* Left — text */}
              <div>
                <Animated variant="fade-right">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
                    Über uns
                  </p>
                </Animated>
                {home.introTitle && (
                  <Animated variant="fade-right" delay={80}>
                    <h2 className="text-balance font-display text-4xl text-ocean-900 md:text-5xl">
                      {home.introTitle}
                    </h2>
                  </Animated>
                )}
                {home.introText && (
                  <Animated variant="fade-right" delay={160}>
                    <p className="mt-6 text-lg leading-relaxed text-ocean-700/90">
                      {home.introText}
                    </p>
                  </Animated>
                )}
                <Animated variant="fade-up" delay={240}>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {['Begegnung', 'Vielfalt', 'Dialog', 'Wachstum'].map((v, i) => {
                      const cls = [
                        'bg-brand-100 text-brand-700',
                        'bg-lav-100 text-lav-700',
                        'bg-aqua-100 text-aqua-700',
                        'bg-leaf-100 text-leaf-700',
                      ][i]
                      return (
                        <span key={v} className={`rounded-full px-4 py-1.5 text-sm font-bold ${cls}`}>{v}</span>
                      )
                    })}
                  </div>
                </Animated>
                <Animated variant="fade-up" delay={320}>
                  <div className="mt-8">
                    <Link href="/ueber-uns" className="btn-glass btn-primary inline-flex">
                      Mehr über uns <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </Animated>
              </div>

              {/* Right — 2×3 icon grid, clean light cards */}
              <div className="grid grid-cols-3 gap-4">
                {werteList.map((item, i) => (
                  <Animated key={item.label} variant="scale-up" delay={i * 70}>
                    <div
                      className={`flex flex-col items-center gap-3 rounded-2xl ${item.bg} p-5 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
                    >
                      <item.Icon className={`h-10 w-10 ${item.color}`} />
                      <span className={`text-center text-xs font-bold ${item.color}`}>{item.label}</span>
                    </div>
                  </Animated>
                ))}
              </div>

            </div>
          </Container>
        </section>
      )}

      {/* ── UPCOMING EVENTS (Aktivitäten Teaser) ── */}
      <HomeEventsSection events={upcomingEvents} />

      {/* ── HIGHLIGHT CARDS ── */}

      {home.highlightCards && home.highlightCards.length > 0 && (
        <section className="section relative overflow-hidden bg-white">
          <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-48 select-none opacity-20 md:w-72" />
          <Container className="max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {home.highlightCards.map((card, i) => {
                const accent = accentColors[i % accentColors.length]
                const Icon = iconMap[card.icon || 'heart']
                const content = (
                  <Animated key={i} variant="fade-up" delay={i * 90}>
                    <Card className="group relative h-full overflow-hidden p-8">
                      <span className={`absolute inset-x-0 top-0 h-2 ${accent.bar}`} aria-hidden />
                      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${accent.icon}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-3 font-display text-xl text-ocean-900">{card.title}</h3>
                      {card.text && <p className="leading-relaxed text-ocean-700/85">{card.text}</p>}
                      {card.link && (
                        <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold ${accent.link}`}>
                          Mehr erfahren{' '}
                          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </Card>
                  </Animated>
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

      {/* ── PROJECTS ── */}
      {projects.docs.length > 0 && (
        <section className="section relative overflow-hidden">
          <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-48 select-none opacity-20 md:w-72" />
          <Container className="max-w-7xl">
            <Animated variant="fade-up">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-lav-500">
                    Aktuelles
                  </p>
                  <h2 className="font-display text-4xl text-ocean-900 md:text-5xl">
                    Unsere <span className="text-marker text-marker-lav">Projekte</span>
                  </h2>
                </div>
                <Link
                  href="/projekt"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors hover:text-brand-500"
                >
                  Alle Projekte <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </Animated>
            <div className="grid gap-6 md:grid-cols-3">
              {projects.docs.map((project, i) => {
                const image = typeof project.coverImage === 'object' ? project.coverImage : null
                const accent = accentColors[i % accentColors.length]
                return (
                  <Animated key={project.id} variant="fade-up" delay={i * 100}>
                    <Link href={`/projekt/${project.slug}`} className="group block h-full">
                      <Card className="h-full overflow-hidden">
                        {image?.url && (
                          <div className="relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image.url}
                              alt={image.alt || project.title}
                              className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className={`absolute inset-x-0 bottom-0 h-2 ${accent.bar}`} aria-hidden />
                          </div>
                        )}
                        <div className="p-7">
                          {project.partner && (
                            <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${accent.icon}`}>
                              {project.partner}
                            </span>
                          )}
                          <h3 className="mb-2 font-display text-xl text-ocean-900">{project.title}</h3>
                          {project.excerpt && (
                            <p className="leading-relaxed text-ocean-700/85">{project.excerpt}</p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </Animated>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── CTA BAND ── */}
      {(home.ctaTitle || home.ctaText) && (
        <section className="relative overflow-hidden bg-ocean-900">
          <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-48 select-none opacity-20 md:w-72" />
          <Container className="relative py-24 text-center md:py-32">
            <Animated variant="scale-up">
              <Image
                src="/mosaik-emblem.png"
                alt=""
                width={440}
                height={530}
                className="mx-auto mb-8 h-20 w-auto drop-shadow-lg"
              />
            </Animated>
            {home.ctaTitle && (
              <Animated variant="fade-up" delay={120}>
                <h2 className="text-balance font-display text-4xl text-white md:text-5xl">
                  {home.ctaTitle}
                </h2>
              </Animated>
            )}
            {home.ctaText && (
              <Animated variant="fade-up" delay={220}>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
                  {home.ctaText}
                </p>
              </Animated>
            )}
            <Animated variant="fade-up" delay={320}>
              <div className="mt-10">
                <Button href="/spenden">
                  Jetzt spenden <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </Animated>
          </Container>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="section relative overflow-hidden bg-white">
        <MosaicPattern className="pointer-events-none absolute bottom-0 left-0 w-48 select-none opacity-15 md:w-64" />
        <Container className="max-w-7xl">
          <div className="mx-auto max-w-3xl">
            <Animated variant="fade-up">
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
                Häufige Fragen
              </p>
              <h2 className="text-balance text-center font-display text-4xl text-ocean-900 md:text-5xl">
                Was macht Mosaik Dialog und Kultur e.V.?
              </h2>
            </Animated>
            <Animated variant="fade-up" delay={80}>
              <p className="mt-6 text-center text-lg leading-relaxed text-ocean-700/90">
                Mosaik Dialog und Kultur ist ein <strong>gemeinnütziger Verein</strong> in
                Rüsselsheim. Er fördert <strong>Bildung, Jugendarbeit und interkulturellen Dialog</strong>{' '}
                im Kreis Groß-Gerau und im Main-Taunus-Kreis.
              </p>
            </Animated>
            <Animated variant="fade-up" delay={160}>
              <div className="mt-10">
                <FaqAccordion items={faqItems} />
              </div>
            </Animated>
          </div>
        </Container>
      </section>
    </>
  )
}


