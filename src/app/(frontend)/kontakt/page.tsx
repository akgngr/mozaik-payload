import { getPayload } from '@/lib/payload'
import { staticPageMetadata } from '@/lib/seo'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { PageHero } from '@/components/PageHero'
import { ContactForm } from '@/components/ContactForm'
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/icons'

export const metadata = {
  title: 'Kontakt',
  description:
    'Kontaktieren Sie Mosaik Dialog und Kultur e.V. in Rüsselsheim – Telefon, E-Mail, Adresse und Öffnungszeiten auf einen Blick.',
  ...staticPageMetadata(
    '/kontakt',
    'Kontakt',
    'Kontaktieren Sie Mosaik Dialog und Kultur e.V. in Rüsselsheim – Telefon, E-Mail, Adresse und Öffnungszeiten auf einen Blick.',
  ),
}

export default async function KontaktPage() {
  const payload = await getPayload()
  const contact = await payload.findGlobal({ slug: 'contact-info' })

  return (
    <>
      <PageHero title={contact.heroTitle || 'Kontaktieren Sie uns'} subtitle={contact.heroText} />

      <section className="section">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="p-8 md:p-10">
              <h2 className="mb-2 font-display text-3xl text-ocean-950">Kontaktformular</h2>
              <p className="mb-8 text-sm text-ocean-800/70">
                Wir melden uns so schnell wie möglich zurück.
              </p>
              <ContactForm email={contact.email || 'kontakt@mosaik-ruesselsheim.de'} />
            </Card>

            <div className="space-y-6">
              <Card className="p-8">
                <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold text-ocean-950">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <PinIcon className="h-5 w-5" />
                  </span>
                  Unsere Adresse
                </h3>
                <div className="space-y-1 leading-relaxed text-ocean-800/80">
                  {contact.organisation && <p>{contact.organisation}</p>}
                  {contact.addressLine1 && <p>{contact.addressLine1}</p>}
                  {contact.addressLine2 && <p>{contact.addressLine2}</p>}
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold text-ocean-950">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  Kontaktdaten
                </h3>
                <div className="space-y-3 leading-relaxed text-ocean-800/80">
                  {contact.phone && (
                    <p className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-aqua-500" />
                      <a
                        href={`tel:${contact.phone.replace(/\s|-/g, '')}`}
                        className="transition-colors hover:text-aqua-600"
                      >
                        {contact.phone}
                      </a>
                    </p>
                  )}
                  {contact.email && (
                    <p className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-aqua-500" />
                      <a href={`mailto:${contact.email}`} className="transition-colors hover:text-aqua-600">
                        {contact.email}
                      </a>
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold text-ocean-950">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-citrus-50 text-citrus-600">
                    <ClockIcon className="h-5 w-5" />
                  </span>
                  Öffnungszeiten
                </h3>
                <div className="space-y-1 leading-relaxed text-ocean-800/80">
                  {contact.officeHoursWeekday && <p>{contact.officeHoursWeekday}</p>}
                  {contact.officeHoursWeekend && <p>{contact.officeHoursWeekend}</p>}
                </div>
              </Card>
            </div>
          </div>

          {contact.mapEmbedUrl && (
            <Card className="mt-8 overflow-hidden !p-0">
              <iframe
                src={contact.mapEmbedUrl}
                className="h-96 w-full"
                loading="lazy"
                title="Standort Karte"
              />
            </Card>
          )}
        </Container>
      </section>
    </>
  )
}
