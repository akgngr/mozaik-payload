import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { GlassCard } from '@/components/GlassCard'
import { PageHero } from '@/components/PageHero'
import { Button } from '@/components/Button'

export const metadata = { title: 'Spenden' }

export default async function SpendenPage() {
  const payload = await getPayload()
  const donation = await payload.findGlobal({ slug: 'donation' })

  return (
    <>
      <PageHero eyebrow={donation.heroSubtitle} title={donation.heroTitle || 'Spenden'} subtitle={donation.heroText} />

      <section className="px-4 py-16">
        <Container className="max-w-2xl">
          <GlassCard className="p-8 md:p-12" strong>
            <h2 className="mb-8 text-center text-2xl font-bold text-ocean-900">Unterstützen Sie uns</h2>

            {donation.paypalUrl && (
              <div className="mb-10 text-center">
                <Button href={donation.paypalUrl} target="_blank">
                  Mit PayPal spenden
                </Button>
              </div>
            )}

            {donation.bank && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-ocean-900">Bankverbindung</h3>
                <div className="glass rounded-2xl p-6 text-sm text-ocean-800/90">
                  {donation.bank.accountHolder && (
                    <p className="mb-2">
                      <strong>Kontoinhaber:</strong> {donation.bank.accountHolder}
                    </p>
                  )}
                  {donation.bank.iban && (
                    <p className="mb-2">
                      <strong>IBAN:</strong> {donation.bank.iban}
                    </p>
                  )}
                  {donation.bank.bic && (
                    <p className="mb-2">
                      <strong>BIC:</strong> {donation.bank.bic}
                    </p>
                  )}
                  {donation.bank.bankName && (
                    <p className="mb-2">
                      <strong>Bank:</strong> {donation.bank.bankName}
                    </p>
                  )}
                  {donation.bank.purpose && (
                    <p>
                      <strong>Verwendungszweck:</strong> {donation.bank.purpose}
                    </p>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        </Container>
      </section>

      {donation.impactCards && donation.impactCards.length > 0 && (
        <section className="px-4 py-16">
          <Container>
            <h2 className="mb-10 text-center text-3xl font-bold text-ocean-900">
              Ihre <span className="text-gradient">Wirkung</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {donation.impactCards.map((card, i) => {
                const image = typeof card.image === 'object' ? card.image : null
                return (
                  <GlassCard key={i} className="overflow-hidden">
                    {image?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image.url} alt={image.alt || card.title} className="h-44 w-full object-cover" />
                    )}
                    <div className="p-6">
                      <h3 className="mb-2 text-lg font-semibold text-ocean-900">{card.title}</h3>
                      {card.description && <p className="text-sm text-ocean-800/75">{card.description}</p>}
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {(donation.ctaTitle || donation.ctaText) && (
        <section className="px-4 py-20">
          <Container>
            <div className="glass-dark rounded-[2.5rem] p-10 text-center text-white md:p-16">
              {donation.ctaTitle && <h2 className="text-3xl font-bold md:text-4xl">{donation.ctaTitle}</h2>}
              {donation.ctaText && <p className="mx-auto mt-4 max-w-2xl text-white/80">{donation.ctaText}</p>}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
