import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <Container className="max-w-xl text-center">
        <Card className="p-12">
          <p className="font-display text-7xl text-brand-600">404</p>
          <h1 className="mt-4 text-2xl font-semibold text-ocean-950">Seite nicht gefunden</h1>
          <p className="mt-2 text-ocean-800/75">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
          <div className="mt-8">
            <Button href="/">Zurück zur Startseite</Button>
          </div>
        </Card>
      </Container>
    </section>
  )
}
