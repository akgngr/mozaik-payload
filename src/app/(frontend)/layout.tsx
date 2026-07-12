import type { Metadata } from 'next'
import React from 'react'
import { getPayload } from '@/lib/payload'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return {
    title: {
      default: settings.siteName || 'Mosaik Dialog und Kultur e.V.',
      template: `%s | ${settings.siteName || 'Mosaik Dialog und Kultur e.V.'}`,
    },
    description: settings.siteDescription || undefined,
    icons: { icon: '/favicon.svg' },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
