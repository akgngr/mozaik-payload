import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { MobileMenu } from './MobileMenu'
import { Container } from './Container'

export const Header = async () => {
  const payload = await getPayload()
  const header = await payload.findGlobal({ slug: 'header' })

  const navItems = (header.navItems || []).map((item) => ({
    label: item.label,
    url: item.url,
  }))

  return (
    <header className="sticky top-4 z-40 px-4">
      <Container>
        <div className="glass-strong flex items-center justify-between rounded-full px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/mosaikevlogo.png" alt="Mosaik Logo" width={140} height={44} className="h-9 w-auto md:h-11" priority />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <ul className="flex items-center gap-6 text-sm font-medium text-ocean-800">
              {navItems.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="transition-colors hover:text-brand-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {header.ctaUrl && (
              <Link href={header.ctaUrl} className="btn-glass btn-primary px-6 py-2.5 text-sm">
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
