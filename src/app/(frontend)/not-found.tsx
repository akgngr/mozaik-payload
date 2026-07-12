import { Container } from '@/components/Container'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center px-4 py-16">
      <Container className="max-w-xl text-center">
        <GlassCard strong className="p-12">
          <p className="text-gradient text-6xl font-bold">404</p>
          <h1 className="mt-4 text-2xl font-bold text-ocean-900">Seite nicht gefunden</h1>
          <p className="mt-2 text-ocean-800/75">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
          <div className="mt-8">
            <Button href="/">Zurück zur Startseite</Button>
          </div>
        </GlassCard>
      </Container>
    </section>
  )
}
