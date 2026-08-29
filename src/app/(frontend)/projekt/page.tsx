import { getPayload } from '@/lib/payload'
import { Container } from '@/components/Container'
import { PageHero } from '@/components/PageHero'
import { InfiniteProjectList } from '@/components/InfiniteProjectList'

export const metadata = { title: 'Projekte' }

export default async function ProjektIndexPage() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'projects',
    limit: 9,
    page: 1,
    sort: '-publishedDate',
  })

  return (
    <>
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
