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
        className="glass flex h-11 w-11 items-center justify-center rounded-full text-ocean-800"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && (
        <div className="glass-strong absolute left-1/2 top-24 z-30 w-11/12 -translate-x-1/2 rounded-3xl p-6">
          <nav className="flex flex-col gap-4 text-lg font-medium text-ocean-800">
            {navItems.map((item) => (
              <Link key={item.url} href={item.url} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {ctaUrl && (
              <Link
                href={ctaUrl}
                onClick={() => setOpen(false)}
                className="btn-glass btn-primary mt-2 w-full text-center"
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
