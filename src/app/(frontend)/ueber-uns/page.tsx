import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { getPageMetadata } from '@/components/PageContent'
import { aboutPageSchema, breadcrumbSchema, jsonLdGraph } from '@/lib/seo'
import { Container } from '@/components/Container'
import { MosaicPattern } from '@/components/MosaicPattern'
import { RichText } from '@/components/RichText'
import {
  ArrowRightIcon,
  HandshakeIllustIcon,
  GlobeIllustIcon,
  DialogIllustIcon,
  SproutIllustIcon,
  SolidarityIllustIcon,
  CreativityIllustIcon,
} from '@/components/icons'
import { notFound } from 'next/navigation'


export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('ueber-uns')
}

// Brand values shown as refined cards with logo-derived accents
const werte = [
  {
    Icon: HandshakeIllustIcon,
    label: 'Begegnung',
    text: 'Wir schaffen Räume für echte Begegnung zwischen Menschen aller Herkunft.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-brand-600',
    bar: 'bg-brand-500',
  },
  {
    Icon: GlobeIllustIcon,
    label: 'Vielfalt',
    text: 'Unsere Stärke liegt in der Vielfalt der Kulturen, Sprachen und Perspektiven.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  {
    Icon: DialogIllustIcon,
    label: 'Dialog',
    text: 'Offener Austausch und gegenseitiges Zuhören sind die Basis unserer Arbeit.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-brand-600',
    bar: 'bg-brand-500',
  },
  {
    Icon: SproutIllustIcon,
    label: 'Wachstum',
    text: 'Wir begleiten Menschen auf ihrem Weg in ein selbstbestimmtes Leben.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
    bar: 'bg-emerald-600',
  },
  {
    Icon: SolidarityIllustIcon,
    label: 'Solidarität',
    text: 'Füreinander eintreten — besonders für Menschen in schwierigen Situationen.',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-700',
    bar: 'bg-rose-600',
  },
  {
    Icon: CreativityIllustIcon,
    label: 'Kreativität',
    text: 'Kultur, Kunst und kreative Projekte verbinden Menschen über Grenzen hinweg.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    bar: 'bg-amber-500',
  },
]

const stats = [
  { value: '2015', label: 'Gegründet', color: 'text-ocean-900' },
  { value: '6', label: 'Sprachen', color: 'text-brand-600' },
  { value: '500+', label: 'Menschen pro Jahr', color: 'text-amber-700' },
  { value: '∞', label: 'Herzen', color: 'text-rose-600' },
]

export default async function UeberUnsPage() {
  let page: any = null

  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'ueber-uns' } },
      limit: 1,
    })
    page = result.docs[0]
  } catch {
    // Database unreachable during build or downtime fallback
  }

  if (!page) {
    page = {
      title: 'Über uns',
      heroEyebrow: 'Gemeinschaft & Kultur',
      heroSubtitle: 'Mosaik Dialog und Kultur e.V.',
      content: null,
    }
  }

  const jsonLd = jsonLdGraph(
    aboutPageSchema(),
    breadcrumbSchema([
      { name: 'Startseite', path: '/' },
      { name: 'Über uns', path: '/ueber-uns' },
    ]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── HERO ── Clean layout */}
      <section className="relative overflow-hidden">
        {/* Subtle background */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'linear-gradient(135deg, #f8fafc 0%, #faf9f6 50%, #f1f5f9 100%)',
          }}
        />

        <Container className="relative py-24 md:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: text */}
            <div>
              {page.heroEyebrow && (
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-ocean-200 bg-white/90 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-600 shadow-sm backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden />
                  {page.heroEyebrow}
                </span>
              )}
              <h1 className="text-balance font-display text-5xl leading-tight text-ocean-900 md:text-7xl">
                {page.title}
              </h1>
              {page.heroSubtitle && (
                <p className="mt-6 max-w-xl text-xl leading-relaxed text-ocean-700/85">
                  {page.heroSubtitle}
                </p>
              )}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/kontakt" className="btn-glass btn-primary">
                  Kontakt aufnehmen <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link href="/spenden" className="btn-glass btn-secondary">
                  Uns unterstützen
                </Link>
              </div>
            </div>

            {/* Right: stats mosaic */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group relative overflow-hidden rounded-3xl bg-white p-8 border border-ocean-100 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <p className={`font-display text-5xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="mt-2 text-sm font-semibold text-ocean-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── DIVIDER STRIP ── */}
      <div className="mosaic-strip h-1 w-full opacity-60" aria-hidden />

      {/* ── MISSION ── Centered rich text */}
      {page.content && (
        <section className="relative overflow-hidden py-24">
          <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-64 select-none opacity-10" />
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                Wer wir sind
              </p>
              <h2 className="mb-10 font-display text-4xl text-ocean-900 md:text-5xl">
                Unsere{' '}
                <span className="text-marker">Geschichte</span>
              </h2>
              <div className="prose prose-lg prose-ocean max-w-none text-ocean-800">
                <RichText data={page.content} />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── WERTE ── 6 refined value cards */}
      <section className="relative overflow-hidden py-24 bg-white/60 border-t border-ocean-100/60">
        <Container className="relative max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Was uns antreibt
            </p>
            <h2 className="font-display text-4xl text-ocean-900 md:text-5xl">
              Unsere <span className="text-marker">Werte</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {werte.map((w) => (
              <div
                key={w.label}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 border border-ocean-100 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:border-ocean-300"
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${w.bar}`} aria-hidden />
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${w.iconBg}`}>
                  <w.Icon
                    className={`h-7 w-7 ${w.iconColor}`}
                    aria-label={w.label}
                  />
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-ocean-900">
                  {w.label}
                </h3>
                <p className="leading-relaxed text-ocean-700/85 text-sm">{w.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── TAGLINE BAND ── Full-width dark strip */}
      <section className="relative overflow-hidden bg-ocean-950 py-24">
        <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-72 select-none opacity-10" />
        <Container className="relative text-center">
          <Image
            src="/mosaik-emblem.png"
            alt="Mosaik Dialog und Kultur e.V. Emblem"
            width={564}
            height={564}
            className="mx-auto mb-8 h-20 w-auto object-contain drop-shadow-md"
          />
          <p className="mx-auto max-w-2xl text-balance font-display text-3xl font-extrabold leading-snug text-white md:text-4xl">
            Ein{' '}
            <span className="text-amber-400">Mosaik</span>{' '}
            aus Menschen,{' '}
            <span className="text-blue-300">Kulturen</span>{' '}
            und{' '}
            <span className="text-emerald-400">Träumen</span>
            {' '}— das sind wir.
          </p>
          <div className="mx-auto mt-10 flex justify-center">
            <Link href="/aktivitaet" className="btn-glass btn-primary">
              Unsere Aktivitäten <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
