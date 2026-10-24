import type { Metadata } from "next"
import React from "react"
import { Nunito_Sans, Source_Sans_3 } from "next/font/google"
import { getPayload } from "@/lib/payload"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { NewsletterSection } from "@/components/NewsletterSection"
import { organizationSchema, websiteSchema, jsonLdGraph } from "@/lib/seo"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOCALE } from "@/lib/site"
import "./globals.css"

export const dynamic = "force-dynamic"

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source",
  display: "swap",
})

const nunito = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  let siteName = SITE_NAME
  let siteDescription = SITE_DESCRIPTION
  let iconUrl = "/favicon.png"
  let logoUrl = `${SITE_URL}/mosaik-logo.png`
  let seoImageUrl = `${SITE_URL}/mosaik-logo.png`

  try {
    const payload = await getPayload()
    const settings = await payload.findGlobal({ slug: "site-settings" })
    if (settings?.siteName) siteName = settings.siteName
    if (settings?.siteDescription) siteDescription = settings.siteDescription
    if (typeof settings?.siteIcon === "object" && settings.siteIcon?.url) {
      iconUrl = settings.siteIcon.url
    }
    if (typeof settings?.logo === "object" && settings.logo?.url) {
      logoUrl = settings.logo.url
    }
    if (typeof settings?.defaultSeoImage === "object" && settings.defaultSeoImage?.url) {
      seoImageUrl = settings.defaultSeoImage.url
    } else {
      seoImageUrl = logoUrl
    }
  } catch {
    // Veritabanı bağlantısı derleme (build) sırasında henüz aktif değilse varsayılan değerleri kullan
  }

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
    category: "Verein",
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      url: SITE_URL,
      siteName,
      title: siteName,
      description: siteDescription,
      images: [
        {
          url: seoImageUrl,
          width: 1024,
          height: 353,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [seoImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organization = organizationSchema()
  const website = websiteSchema()

  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${sourceSans.variable} ${nunito.variable}`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdGraph(organization, website)),
          }}
        />
        <div className="mosaic-strip h-1 w-full opacity-70" />
        <Header />
        <main>{children}</main>
        <NewsletterSection />
        <Footer />
      </body>
    </html>
  )
}
