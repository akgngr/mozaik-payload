import type { Metadata } from 'next'
import React from 'react'
import { Nunito_Sans, Source_Sans_3 } from 'next/font/google'
import { getPayload } from '@/lib/payload'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NewsletterSection } from '@/components/NewsletterSection'
import { organizationSchema, websiteSchema, jsonLdGraph } from '@/lib/seo'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOCALE } from '@/lib/site'
import './globals.css'

export const revalidate = 604800

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
  const siteName = settings.siteName || SITE_NAME
  const siteDescription = settings.siteDescription || SITE_DESCRIPTION

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    category: 'Verein',
    icons: { icon: '/favicon.png' },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url: SITE_URL,
      siteName,
      title: siteName,
      description: siteDescription,
      images: [
        {
          url: `${SITE_URL}/mosaik-emblem.png`,
          width: 440,
          height: 530,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
      images: [`${SITE_URL}/mosaik-emblem.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = organizationSchema()
  const website = websiteSchema()

  return (
    <html lang="de" className={`${sourceSans.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph(organization, website)) }}
        />
        <div className="mosaic-strip h-1.5 w-full" />
        <Header />
        <main>{children}</main>
        <NewsletterSection />
        <Footer />
      </body>
    </html>
  )
}


