import { Container } from './Container'
import { MosaicPattern } from './MosaicPattern'

export const PageHero = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
}) => (
  <section className="relative overflow-hidden border-b border-cream-dark">
    <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-48 select-none opacity-20 md:w-72" />
    <Container className="relative py-20 md:py-28">
      <div className="max-w-3xl">
        {eyebrow && (
          <span className="mb-5 inline-block rounded-full border-2 border-brand-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            {eyebrow}
          </span>
        )}
        <h1 className="text-balance font-display text-5xl leading-[1.02] text-ocean-900 md:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ocean-700/90">{subtitle}</p>
        )}
      </div>
    </Container>
  </section>
)
