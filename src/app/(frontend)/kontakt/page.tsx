import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { GlassCard } from '@/components/GlassCard'
import { PageHero } from '@/components/PageHero'
import { ContactForm } from '@/components/ContactForm'
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/icons'

export const metadata = { title: 'Kontakt' }

export default async function KontaktPage() {
  const payload = await getPayload()
  const contact = await payload.findGlobal({ slug: 'contact-info' })

  return (
    <>
      <PageHero title={contact.heroTitle || 'Kontaktieren Sie uns'} subtitle={contact.heroText} />

      <section className="px-4 py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <GlassCard className="p-8">
              <h2 className="mb-6 text-xl font-bold text-ocean-900">Kontaktformular</h2>
              <ContactForm email={contact.email || 'kontakt@mosaik-ruesselsheim.de'} />
            </GlassCard>

            <div className="space-y-6">
              <GlassCard className="p-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-ocean-900">
                  <PinIcon className="h-5 w-5 text-brand-600" /> Unsere Adresse
                </h3>
                <div className="space-y-1 text-ocean-800/80">
                  {contact.organisation && <p>{contact.organisation}</p>}
                  {contact.addressLine1 && <p>{contact.addressLine1}</p>}
                  {contact.addressLine2 && <p>{contact.addressLine2}</p>}
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="mb-4 text-lg font-bold text-ocean-900">Kontaktdaten</h3>
                <div className="space-y-2 text-ocean-800/80">
                  {contact.phone && (
                    <p className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-brand-600" />
                      <a href={`tel:${contact.phone.replace(/\s|-/g, '')}`} className="hover:text-brand-600">
                        {contact.phone}
                      </a>
                    </p>
                  )}
                  {contact.email && (
                    <p className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-brand-600" /> {contact.email}
                    </p>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-ocean-900">
                  <ClockIcon className="h-5 w-5 text-brand-600" /> Öffnungszeiten
                </h3>
                <div className="space-y-1 text-ocean-800/80">
                  {contact.officeHoursWeekday && <p>{contact.officeHoursWeekday}</p>}
                  {contact.officeHoursWeekend && <p>{contact.officeHoursWeekend}</p>}
                </div>
              </GlassCard>
            </div>
          </div>

          {contact.mapEmbedUrl && (
            <GlassCard className="mt-8 overflow-hidden p-0">
              <iframe
                src={contact.mapEmbedUrl}
                className="h-96 w-full"
                loading="lazy"
                title="Standort Karte"
              />
            </GlassCard>
          )}
        </Container>
      </section>
    </>
  )
}
