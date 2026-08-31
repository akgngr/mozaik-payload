import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { staticPageMetadata } from '@/lib/seo'
import { Container } from '@/components/Container'
import { PageHero } from '@/components/PageHero'
import { EventCalendarView } from '@/components/EventCalendarView'
import { MosaicPattern } from '@/components/MosaicPattern'
import type { Event as EventType } from '@/payload-types'

export const revalidate = 86400

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

// Fallback initial sample events if Payload has no events yet
const initialDemoEvents: Partial<EventType>[] = [
  {
    id: 1,
    title: 'Interkulturelles Sprachcafé',
    category: 'education',
    eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: 'Mosaik Begegnungszentrum, Bahnhofstr. 20, Rüsselsheim',
    excerpt:
      'Zwangloses Deutsch sprechen bei Kaffee, Tee und Gebäck. Für alle Niveaustufen offen. Keine Anmeldung erforderlich.',
    isHighlight: true,
  },
  {
    id: 2,
    title: 'Familien-Kreativnachmittag',
    category: 'youth',
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    location: 'Mosaik e.V., Bahnhofstr. 20, Rüsselsheim',
    excerpt:
      'Gemeinsam malen, basteln und spielen für Kinder und Eltern. Ein bunter Nachmittag für die ganze Familie.',
    isHighlight: false,
  },
  {
    id: 3,
    title: 'Interkultureller Kochabend: Rezepte aus aller Welt',
    category: 'culture',
    eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    location: 'Gemeinschaftsküche Rüsselsheim',
    excerpt:
      'Wir kochen zusammen traditionelle Gerichte aus verschiedenen Kulturkreisen und tauschen Geschichten aus.',
    isHighlight: true,
  },
  {
    id: 4,
    title: 'Bewerbungstraining & Lebenslauf-Check für Jugendliche',
    category: 'workshop',
    eventDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Mosaik e.V. Seminarraum',
    excerpt:
      'Tipps und praktische Übungen für Praktikums- und Ausbildungsplatzbewerbungen mit erfahrenen Mentoren.',
    isHighlight: false,
  },
  {
    id: 5,
    title: 'Nachbarschafts-Dialog: Zusammenleben im Quartier',
    category: 'dialog',
    eventDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
    location: 'Bürgerhaus Rüsselsheim',
    excerpt:
      'Ein offener Austausch über Gemeinschaftsprojekte, Ideen und Initiativen für ein lebendiges Miteinander.',
    isHighlight: false,
  },
]

export default async function AktivitaetPage() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'events',
    limit: 9,
    page: 1,
    sort: 'eventDate',
  })

  // Use CMS events, fallback to demo events if empty
  const events =
    result.docs.length > 0
      ? result.docs
      : (initialDemoEvents as EventType[])

  return (
    <>
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
            initialHasNextPage={Boolean(result.hasNextPage)}
          />
        </Container>
      </section>
    </>
  )
}
