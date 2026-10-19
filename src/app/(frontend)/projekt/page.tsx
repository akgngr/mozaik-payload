import { getPayload } from '@/lib/payload'
import { staticPageMetadata, breadcrumbSchema, webPageSchema, jsonLdGraph } from '@/lib/seo'
import { Container } from '@/components/Container'
import { PageHero } from '@/components/PageHero'
import { InfiniteProjectList } from '@/components/InfiniteProjectList'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Projekte',
  description:
    'Unsere laufenden Projekte und Initiativen von Mosaik Dialog und Kultur e.V. – Sprachkurse, Nachhilfe, Jugend- und Flüchtlingshilfe im Kreis Groß-Gerau.',
  ...staticPageMetadata(
    '/projekt',
    'Projekte',
    'Unsere laufenden Projekte und Initiativen von Mosaik Dialog und Kultur e.V. – Sprachkurse, Nachhilfe, Jugend- und Flüchtlingshilfe im Kreis Groß-Gerau.',
  ),
}

export default async function ProjektIndexPage() {
  let result: any = { docs: [], hasNextPage: false }

  try {
    const payload = await getPayload()
    result = await payload.find({
      collection: 'projects',
      limit: 9,
      page: 1,
      sort: '-publishedDate',
    })
  } catch {
    // Database unreachable during build or downtime fallback
  }

  const jsonLd = jsonLdGraph(
    webPageSchema({
      title: 'Projekte',
      slug: 'projekt',
      description:
        'Unsere laufenden Projekte und Initiativen von Mosaik Dialog und Kultur e.V. – Sprachkurse, Nachhilfe, Jugend- und Flüchtlingshilfe im Kreis Groß-Gerau.',
    }),
    breadcrumbSchema([
      { name: 'Startseite', path: '/' },
      { name: 'Projekte', path: '/projekt' },
    ]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="Gemeinsam aktiv"
        title="Unsere Projekte"
        subtitle="Ein Überblick über unsere laufenden Kooperationen und Initiativen."
      />
      <section className="section">
        <Container>
          <InfiniteProjectList
            initialProjects={result.docs}
            initialHasNextPage={Boolean(result.hasNextPage)}
          />
        </Container>
      </section>
    </>
  )
}
