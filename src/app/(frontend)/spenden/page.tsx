import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { PageHero } from '@/components/PageHero'
import { Button } from '@/components/Button'
import { CopyButton } from '@/components/CopyButton'
import { MosaicPattern } from '@/components/MosaicPattern'

export const metadata = { title: 'Spenden' }

export default async function SpendenPage() {
  const payload = await getPayload()
  const donation = await payload.findGlobal({ slug: 'donation' })

  return (
    <>
      <PageHero eyebrow={donation.heroSubtitle} title={donation.heroTitle || 'Spenden'} subtitle={donation.heroText} />

      <section className="section">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Card className="p-8 md:p-12">
              <h2 className="text-center font-display text-3xl text-ocean-900">Unterstützen Sie uns</h2>

              {donation.paypalUrl && (
                <div className="mt-8 text-center">
                  <Button href={donation.paypalUrl} target="_blank">
                    Mit PayPal spenden
                  </Button>
                </div>
              )}

              {donation.bank && (
                <div className="mt-12">
                  <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold text-ocean-950">
                    <span className="mosaic-strip h-5 w-1.5 rounded-full" aria-hidden />
                    Bankverbindung
                  </h3>
                  <dl className="divide-y divide-ocean-100 rounded-2xl border border-ocean-100 bg-ocean-50/50 px-6 text-sm">
                    {donation.bank.accountHolder && (
                      <div className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                        <dt className="font-medium text-ocean-800/70">Kontoinhaber</dt>
                        <dd className="font-semibold text-ocean-950">{donation.bank.accountHolder}</dd>
                      </div>
                    )}
                    {donation.bank.iban && (
                      <div className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                        <dt className="font-medium text-ocean-800/70">IBAN</dt>
                        <dd className="flex min-w-0 items-center gap-2 font-semibold tracking-wide text-ocean-950">
                          <span className="break-all">{donation.bank.iban}</span>
                          <CopyButton value={donation.bank.iban} />
                        </dd>
                      </div>
                    )}
                    {donation.bank.bic && (
                      <div className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                        <dt className="font-medium text-ocean-800/70">BIC</dt>
                        <dd className="flex items-center gap-2 font-semibold text-ocean-950">
                          <span>{donation.bank.bic}</span>
                          <CopyButton value={donation.bank.bic} />
                        </dd>
                      </div>
                    )}
                    {donation.bank.bankName && (
                      <div className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                        <dt className="font-medium text-ocean-800/70">Bank</dt>
                        <dd className="font-semibold text-ocean-950">{donation.bank.bankName}</dd>
                      </div>
                    )}
                    {donation.bank.purpose && (
                      <div className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                        <dt className="font-medium text-ocean-800/70">Verwendungszweck</dt>
                        <dd className="font-semibold text-ocean-950">{donation.bank.purpose}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </Card>
          </div>
        </Container>
      </section>

      {donation.impactCards && donation.impactCards.length > 0 && (
        <section className="section pt-0">
          <Container>
            <h2 className="mb-12 text-center font-display text-4xl text-ocean-900 md:text-5xl">
              Ihre <span className="text-marker text-marker-teal">Wirkung</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {donation.impactCards.map((card, i) => {
                const image = typeof card.image === 'object' ? card.image : null
                return (
                  <Card key={i} className="overflow-hidden">
                    {image?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image.url} alt={image.alt || card.title} className="h-48 w-full object-cover" />
                    )}
                    <div className="p-7">
                      <h3 className="mb-2 text-xl font-semibold text-ocean-950">{card.title}</h3>
                      {card.description && (
                        <p className="leading-relaxed text-ocean-800/75">{card.description}</p>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {(donation.ctaTitle || donation.ctaText) && (
        <section className="relative overflow-hidden bg-ocean-900">
          <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-48 select-none opacity-20 md:w-72" />
          <Container className="relative py-24 text-center md:py-28">
            {donation.ctaTitle && (
              <h2 className="text-balance font-display text-4xl text-white md:text-5xl">
                {donation.ctaTitle}
              </h2>
            )}
            {donation.ctaText && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">{donation.ctaText}</p>
            )}
          </Container>
        </section>
      )}
    </>
  )
}
