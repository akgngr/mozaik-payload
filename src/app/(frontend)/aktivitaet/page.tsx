import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { staticPageMetadata, eventSchema, breadcrumbSchema, jsonLdGraph } from '@/lib/seo'
import { Container } from '@/components/Container'
import { PageHero } from '@/components/PageHero'
import { EventCalendarView } from '@/components/EventCalendarView'
import { MosaicPattern } from '@/components/MosaicPattern'
import type { Event as EventType } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aktivitäten & Veranstaltungskalender',
  description:
    'Aktuelle Termine, Sprachcafés, Kulturfeste, Workshops und Aktivitäten von Mosaik e.V. in Rüsselsheim. Mit 1-Klick-Kalendererinnerung.',
  ...staticPageMetadata(
    '/aktivitaet',
    'Aktivitäten & Veranstaltungskalender',
    'Aktuelle Termine, Sprachcafés, Kulturfeste, Workshops und Aktivitäten von Mosaik e.V. in Rüsselsheim. Mit 1-Klick-Kalendererinnerung.',
  ),
}

function makeCleanEventDate(daysAhead: number, hours: number, minutes: number = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString()
}

// Fallback initial sample events if Payload has no events yet
const initialDemoEvents: Partial<EventType>[] = [
  {
    id: 1,
    title: 'Interkulturelles Sprachcafé',
    category: 'education',
    eventDate: makeCleanEventDate(3, 15, 0),
    location: 'Mosaik Begegnungszentrum, Bahnhofstraße 20, Rüsselsheim',
    excerpt:
      'Zwangloses Deutsch sprechen bei Kaffee, Tee und Gebäck. Für alle Niveaustufen offen. Keine Anmeldung erforderlich.',
    isHighlight: true,
  },
  {
    id: 2,
    title: 'Familien-Kreativnachmittag',
    category: 'youth',
    eventDate: makeCleanEventDate(7, 14, 0),
    location: 'Mosaik e.V., Bahnhofstraße 20, Rüsselsheim',
    excerpt:
      'Gemeinsam malen, basteln und spielen für Kinder und Eltern. Ein bunter Nachmittag für die ganze Familie.',
    isHighlight: false,
  },
  {
    id: 3,
    title: 'Interkultureller Kochabend: Rezepte aus aller Welt',
    category: 'culture',
    eventDate: makeCleanEventDate(12, 18, 0),
    location: 'Gemeinschaftsküche Rüsselsheim',
    excerpt:
      'Wir kochen zusammen traditionelle Gerichte aus verschiedenen Kulturkreisen und tauschen Geschichten aus.',
    isHighlight: true,
  },
  {
    id: 4,
    title: 'Bewerbungstraining & Lebenslauf-Check für Jugendliche',
    category: 'workshop',
    eventDate: makeCleanEventDate(16, 16, 0),
    location: 'Mosaik e.V. Seminarraum',
    excerpt:
      'Tipps und praktische Übungen für Praktikums- und Ausbildungsplatzbewerbungen mit erfahrenen Mentoren.',
    isHighlight: false,
  },
  {
    id: 5,
    title: 'Nachbarschafts-Dialog: Zusammenleben im Quartier',
    category: 'dialog',
    eventDate: makeCleanEventDate(22, 17, 0),
    location: 'Bürgerhaus Rüsselsheim',
    excerpt:
      'Ein offener Austausch über Gemeinschaftsprojekte, Ideen und Initiativen für ein lebendiges Miteinander.',
    isHighlight: false,
  },
]

export default async function AktivitaetPage() {
  let events = initialDemoEvents as EventType[]
  let hasNextPage = false

  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'events',
      limit: 9,
      page: 1,
      sort: 'eventDate',
      where: {
        eventDate: {
          greater_than_equal: new Date().toISOString(),
        },
      },
    })
    if (result.docs.length > 0) {
      events = result.docs
      hasNextPage = Boolean(result.hasNextPage)
    }
  } catch {
    // Veritabanı bağlantısı derleme sırasında yoksa demo etkinlikleri kullan
  }

  const eventSchemas = events.map((e) =>
    eventSchema({
      title: e.title,
      description: e.excerpt || undefined,
      startDate: e.eventDate,
      endDate: e.endDate || undefined,
      location: e.location || undefined,
      imageUrl:
        typeof e.image === 'object' && e.image !== null && 'url' in e.image
          ? (e.image.url as string)
          : undefined,
    }),
  )

  const jsonLd = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Startseite', path: '/' },
      { name: 'Aktivitäten', path: '/aktivitaet' },
    ]),
    ...eventSchemas,
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="Veranstaltungskalender"
        title="Aktivitäten & Termine"
        subtitle="Entdecken Sie unsere anstehenden Veranstaltungen, Kurse und Workshops. Fügen Sie Termine mit einem Klick zu Ihrem persönlichen Kalender hinzu."
      />

      <section className="section relative overflow-hidden">
        <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-64 select-none opacity-15" />
        <Container>
          <EventCalendarView
            initialEvents={events}
            initialHasNextPage={hasNextPage}
          />
        </Container>
      </section>
    </>
  )
}
