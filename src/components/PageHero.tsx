import { Container } from './Container'

export const PageHero = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
}) => (
  <section className="px-4 pt-6">
    <Container>
      <div className="glass-strong rounded-[2.5rem] px-8 py-16 text-center md:py-20">
        {eyebrow && (
          <span className="mb-3 inline-block rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            {eyebrow}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-ocean-900 md:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-ocean-800/80">{subtitle}</p>}
      </div>
    </Container>
  </section>
)
