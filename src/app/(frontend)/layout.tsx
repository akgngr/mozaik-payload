import type { Metadata } from 'next'
import React from 'react'
import { Nunito_Sans, Source_Sans_3 } from 'next/font/google'
import { getPayload } from '@/lib/payload'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NewsletterSection } from '@/components/NewsletterSection'
import './globals.css'

export const dynamic = 'force-dynamic'

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-source',
  display: 'swap',
})

const nunito = Nunito_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-nunito',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return {
    title: {
      default: settings.siteName || 'Mosaik Dialog und Kultur e.V.',
      template: `%s | ${settings.siteName || 'Mosaik Dialog und Kultur e.V.'}`,
    },
    description: settings.siteDescription || undefined,
    icons: { icon: '/favicon.png' },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${sourceSans.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        <div className="mosaic-strip h-1.5 w-full" />
        <Header />
        <main>{children}</main>
        <NewsletterSection />
        <Footer />
      </body>
    </html>
  )
}


