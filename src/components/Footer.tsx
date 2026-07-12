import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { getPayload } from '@/lib/payload'
import { Container } from './Container'
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TwitterIcon, YoutubeIcon } from './icons'

const socialIcons: Record<string, (props: { className?: string }) => ReactElement> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
}

export const Footer = async () => {
  const payload = await getPayload()
  const footer = await payload.findGlobal({ slug: 'footer' })

  return (
    <footer className="mt-24 px-4 pb-6">
      <Container>
        <div className="glass-dark rounded-[2.5rem] p-8 text-white md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Image src="/mosaikevlogo.png" alt="Logo" width={120} height={38} className="mb-4 h-9 w-auto brightness-0 invert" />
              <p className="text-sm leading-relaxed text-white/80">{footer.aboutText}</p>
              {footer.officeHours && (
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold">Bürozeiten</h3>
                  <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-ocean-300 to-brand-300" />
                  <p className="text-sm text-white/80">{footer.officeHours}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Offiziell</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {(footer.links || []).map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} className="transition-colors hover:text-brand-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Kontakt</h3>
              <ul className="space-y-3 text-sm text-white/80">
                {footer.phone && (
                  <li className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 shrink-0" /> {footer.phone}
                  </li>
                )}
                {footer.email && (
                  <li className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 shrink-0" /> {footer.email}
                  </li>
                )}
                {footer.address && (
                  <li className="flex items-center gap-2">
                    <PinIcon className="h-4 w-4 shrink-0" /> {footer.address}
                  </li>
                )}
              </ul>
              <div className="mt-6 flex gap-4">
                {(footer.socialLinks || []).map((social) => {
                  const Icon = socialIcons[social.platform]
                  if (!Icon) return null
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:scale-110 hover:bg-white/20"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
            © {new Date().getFullYear()} Mosaik Dialog und Kultur e.V. — Alle Rechte vorbehalten.
          </div>
        </div>
      </Container>
    </footer>
  )
}
