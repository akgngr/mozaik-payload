'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CloseIcon, MenuIcon } from './icons'

type NavItem = { label: string; url: string }

export const MobileMenu = ({
  navItems,
  ctaLabel,
  ctaUrl,
}: {
  navItems: NavItem[]
  ctaLabel?: string | null
  ctaUrl?: string | null
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        aria-label="Menü öffnen"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-ocean-200 text-ocean-800 transition-colors hover:border-ocean-400"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-ocean-100 bg-white px-6 pb-8 pt-4 shadow-[0_24px_48px_rgba(15,44,80,0.12)]">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setOpen(false)}
                className="border-b border-ocean-50 py-4 text-lg font-medium text-ocean-800 transition-colors hover:text-brand-600"
              >
                {item.label}
              </Link>
            ))}
            {ctaUrl && (
              <Link
                href={ctaUrl}
                onClick={() => setOpen(false)}
                className="btn-glass btn-primary mt-6 w-full text-center"
              >
                {ctaLabel}
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
