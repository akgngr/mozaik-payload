import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Header as HeaderType, SiteSetting } from '@/payload-types'
import { MobileMenu } from './MobileMenu'
import { Container } from './Container'

export const Header = async () => {
  let header: HeaderType | null = null
  let siteSettings: SiteSetting | null = null

  try {
    const payload = await getPayload()
    const [h, s] = await Promise.all([
      payload.findGlobal({ slug: 'header' }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])
    header = h
    siteSettings = s
  } catch {
    // fallback if database is not available
  }

  const navItems = (header?.navItems || []).map((item) => {
    let label = item.label
    if (label === 'Home') label = 'Startseite'
    if (label === 'Über Uns') label = 'Über uns'
    if (label === 'Projekt') label = 'Projekte'
    if (label === 'Aktivität') label = 'Aktivitäten'
    return {
      label,
      url: item.url,
    }
  })

  const logoUrl =
    (typeof siteSettings?.logo === 'object' && siteSettings.logo?.url) ||
    '/mosaik-logo.png'
  const logoAlt =
    (typeof siteSettings?.logo === 'object' && siteSettings.logo?.alt) ||
    siteSettings?.siteName ||
    'Mosaik Dialog und Kultur e.V.'
  const logoWidth =
    (typeof siteSettings?.logo === 'object' && siteSettings.logo?.width) ||
    1024
  const logoHeight =
    (typeof siteSettings?.logo === 'object' && siteSettings.logo?.height) ||
    353

  return (
    <header className="sticky top-0 z-40 border-b border-ocean-100/70 bg-white/95 backdrop-blur-md">
      <Container className="max-w-7xl">
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center py-1 group">
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              priority
            />
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
            {header?.ctaUrl && (
              <Link href={header.ctaUrl} className="btn-glass btn-primary px-6 py-3">
                {header.ctaLabel || 'Spenden'}
              </Link>
            )}
          </nav>

          <MobileMenu navItems={navItems} ctaLabel={header?.ctaLabel} ctaUrl={header?.ctaUrl} />
        </div>
      </Container>
    </header>
  )
}
