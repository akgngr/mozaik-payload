import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { MobileMenu } from './MobileMenu'
import { Container } from './Container'

// Per-letter brand colors, matching the logo wordmark
const letters = ['M', 'O', 'S', 'A', 'I', 'K']

export const Header = async () => {
  const payload = await getPayload()
  const header = await payload.findGlobal({ slug: 'header' })

  const navItems = (header.navItems || []).map((item) => ({
    label: item.label === 'Home' ? 'Startseite' : item.label,
    url: item.url,
  }))

  return (
    <header className="sticky top-0 z-40 border-b border-cream-dark bg-cream/90 backdrop-blur-md">
      <Container className="max-w-7xl">
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <Image
              src="/mosaik-emblem.png"
              alt="Mosaik Dialog und Kultur e.V."
              width={440}
              height={530}
              className="h-14 w-auto sm:h-14 md:h-16"
              priority
            />
            <span className="flex flex-col leading-none">
              <span className="wordmark font-display text-2xl sm:text-2xl tracking-wide">
                {letters.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
              <span className="mt-1 text-[10px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-ocean-600">
                Dialog und Kultur e.V.
              </span>
            </span>
          </Link>



          <nav className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-7 text-[15px] font-semibold text-ocean-800">
              {navItems.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-400 after:transition-transform hover:text-brand-600 hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {header.ctaUrl && (
              <Link href={header.ctaUrl} className="btn-glass btn-primary px-6 py-3">
                {header.ctaLabel}
              </Link>
            )}
          </nav>

          <MobileMenu navItems={navItems} ctaLabel={header.ctaLabel} ctaUrl={header.ctaUrl} />
        </div>
      </Container>
    </header>
  )
}
