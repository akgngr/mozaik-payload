import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { getPayload } from '@/lib/payload'
import { Container } from './Container'
import { MosaicPattern } from './MosaicPattern'
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TwitterIcon, YoutubeIcon } from './icons'

const socialIcons: Record<string, (props: { className?: string }) => ReactElement> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
}

const letters = ['M', 'O', 'S', 'A', 'I', 'K']

export const Footer = async () => {
  const payload = await getPayload()
  const footer = await payload.findGlobal({ slug: 'footer' })

  return (
    <footer className="relative overflow-hidden bg-ocean-900 text-white">
      <div className="mosaic-strip h-1.5 w-full" />
      <MosaicPattern className="pointer-events-none absolute bottom-0 right-0 w-48 select-none opacity-20 md:w-72" />
      <Container className="relative max-w-7xl">
        <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <Image src="/mosaik-emblem.png" alt="Logo" width={440} height={530} className="h-14 w-auto" />
              <span className="wordmark flex flex-col leading-none">
                <span className="font-display text-2xl tracking-wide">
                  {letters.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Dialog und Kultur e.V.
                </span>
              </span>
            </div>
            <p className="max-w-md leading-relaxed text-white/70">{footer.aboutText}</p>
            {footer.officeHours && (
              <div className="mt-8">
                <h3 className="mb-2 font-display text-lg text-citrus-300">Bürozeiten</h3>
                <p className="text-sm text-white/70">{footer.officeHours}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-5 font-display text-lg text-white">Offiziell</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {(footer.links || []).map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="transition-colors hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="mb-5 font-display text-lg text-white">Kontakt</h3>
            <ul className="space-y-4 text-sm text-white/70">
              {footer.phone && (
                <li className="flex items-center gap-3">
                  <PhoneIcon className="h-4 w-4 shrink-0 text-aqua-300" /> {footer.phone}
                </li>
              )}
              {footer.email && (
                <li className="flex items-center gap-3">
                  <MailIcon className="h-4 w-4 shrink-0 text-aqua-300" /> {footer.email}
                </li>
              )}
              {footer.address && (
                <li className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-aqua-300" /> {footer.address}
                </li>
              )}
            </ul>
            <div className="mt-8 flex gap-3">
              {(footer.socialLinks || []).map((social) => {
                const Icon = socialIcons[social.platform]
                if (!Icon) return null
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-brand-300 hover:text-brand-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Mosaik Dialog und Kultur e.V. — Alle Rechte vorbehalten.</p>
          <p>
            <span className="text-brand-300">Gemeinsam.</span>{' '}
            <span className="text-lav-300">Verstehen.</span>{' '}
            <span className="text-leaf-300">Verbinden.</span>
          </p>
        </div>
      </Container>
    </footer>
  )
}
