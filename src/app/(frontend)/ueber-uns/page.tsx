import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { getPageMetadata } from '@/components/PageContent'
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


export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('ueber-uns')
}

// Brand values shown as colored tiles
const werte = [
  {
    Icon: HandshakeIllustIcon,
    label: 'Begegnung',
    text: 'Wir schaffen Räume für echte Begegnung zwischen Menschen aller Herkunft.',
    bg: 'bg-brand-400',
    text_color: 'text-white',
    ring: 'ring-brand-300',
  },
  {
    Icon: GlobeIllustIcon,
    label: 'Vielfalt',
    text: 'Unsere Stärke liegt in der Vielfalt der Kulturen, Sprachen und Perspektiven.',
    bg: 'bg-lav-400',
    text_color: 'text-white',
    ring: 'ring-lav-300',
  },
  {
    Icon: DialogIllustIcon,
    label: 'Dialog',
    text: 'Offener Austausch und gegenseitiges Zuhören sind die Basis unserer Arbeit.',
    bg: 'bg-aqua-500',
    text_color: 'text-white',
    ring: 'ring-aqua-300',
  },
  {
    Icon: SproutIllustIcon,
    label: 'Wachstum',
    text: 'Wir begleiten Menschen auf ihrem Weg in ein selbstbestimmtes Leben.',
    bg: 'bg-leaf-500',
    text_color: 'text-white',
    ring: 'ring-leaf-300',
  },
  {
    Icon: SolidarityIllustIcon,
    label: 'Solidarität',
    text: 'Füreinander eintreten — besonders für Menschen in schwierigen Situationen.',
    bg: 'bg-salmon-400',
    text_color: 'text-white',
    ring: 'ring-salmon-300',
  },
  {
    Icon: CreativityIllustIcon,
    label: 'Kreativität',
    text: 'Kultur, Kunst und kreative Projekte verbinden Menschen über Grenzen hinweg.',
    bg: 'bg-citrus-400',
    text_color: 'text-ocean-900',
    ring: 'ring-citrus-300',
  },
]


const stats = [
  { value: '2015', label: 'Gegründet', color: 'text-brand-500' },
  { value: '6', label: 'Sprachen', color: 'text-lav-500' },
  { value: '500+', label: 'Menschen pro Jahr', color: 'text-aqua-600' },
  { value: '∞', label: 'Herzen', color: 'text-salmon-500' },
]

export default async function UeberUnsPage() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'ueber-uns' } },
    limit: 1,
  })
  const page = result.docs[0]
  if (!page) notFound()

  return (
    <>
      {/* ── HERO ── Mosaic-tile split layout */}
      <section className="relative overflow-hidden">
        {/* Colorful diagonal background */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'linear-gradient(135deg, #eefaf9 0%, #f7f4fc 40%, #fef3f3 70%, #fff9ec 100%)',
          }}
        />
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #a8e5e2 0%, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #ded2f2 0%, transparent 70%)' }}
          aria-hidden
        />

        <Container className="relative py-24 md:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: text */}
            <div>
              {page.heroEyebrow && (
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-brand-200 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-600 shadow-sm backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-brand-400" aria-hidden />
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

            {/* Right: colorful stats mosaic */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div
                    className="mosaic-strip absolute inset-x-0 top-0 h-1.5 rounded-t-3xl"
                    aria-hidden
                  />
                  <p className={`font-display text-5xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="mt-2 text-sm font-semibold text-ocean-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── DIVIDER STRIP ── */}
      <div className="mosaic-strip h-2 w-full" aria-hidden />

      {/* ── MISSION ── Centered rich text on cream */}
      {page.content && (
        <section className="relative overflow-hidden py-24">
          <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-64 select-none opacity-15" />
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
                Wer wir sind
              </p>
              <h2 className="mb-10 font-display text-4xl text-ocean-900 md:text-5xl">
                Unsere{' '}
                <span className="text-marker text-marker-teal">Geschichte</span>
              </h2>
              <div className="prose prose-lg prose-ocean max-w-none text-ocean-800">
                <RichText data={page.content} />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── WERTE ── 6 colorful value cards */}
      <section className="relative overflow-hidden py-24">
        {/* Subtle background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #eefaf9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f7f4fc 0%, transparent 50%)',
          }}
        />
        <Container className="relative max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-lav-500">
              Was uns antreibt
            </p>
            <h2 className="font-display text-4xl text-ocean-900 md:text-5xl">
              Unsere{' '}
              <span className="text-marker text-marker-lav">Werte</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {werte.map((w, i) => (
              <div
                key={w.label}
                className={`group relative overflow-hidden rounded-3xl ${w.bg} p-8 shadow-lg ring-1 ${w.ring} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Decorative circle */}
                <div
                  className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10"
                  aria-hidden
                />
                <w.Icon
                  className={`mb-4 h-14 w-14 ${w.text_color}`}
                  aria-label={w.label}
                />
                <h3 className={`mb-3 font-display text-2xl font-extrabold ${w.text_color}`}>
                  {w.label}
                </h3>
                <p className={`leading-relaxed ${w.text_color} opacity-90 text-sm`}>{w.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── TAGLINE BAND ── Full-width dark strip with mosaic wordmark feel */}
      <section className="relative overflow-hidden bg-ocean-950 py-24">
        <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-72 select-none opacity-10" />
        <Container className="relative text-center">
          <Image
            src="/mosaik-emblem.png"
            alt="Mosaik Emblem"
            width={440}
            height={530}
            className="mx-auto mb-8 h-16 w-auto drop-shadow-[0_4px_24px_rgba(64,182,179,0.4)]"
          />
          <p className="mx-auto max-w-2xl text-balance font-display text-3xl font-extrabold leading-snug text-white md:text-4xl">
            Ein{' '}
            <span className="text-brand-300">Mosaik</span>{' '}
            aus Menschen,{' '}
            <span className="text-lav-300">Kulturen</span>{' '}
            und{' '}
            <span className="text-citrus-300">Träumen</span>
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
