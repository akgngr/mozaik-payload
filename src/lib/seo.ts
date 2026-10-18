import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_ADDRESS,
  SITE_CONTACT,
} from './site'

export function organizationSchema(socialLinks?: { platform: string; url: string }[]) {
  const sameAs = [SITE_URL]
  if (socialLinks && socialLinks.length > 0) {
    socialLinks.forEach((s) => {
      if (s.url && !sameAs.includes(s.url)) sameAs.push(s.url)
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'Organization'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: SITE_CONTACT.email,
    telephone: SITE_CONTACT.phone,
    foundingDate: '2015',
    address: {
      '@type': 'PostalAddress',
      ...SITE_ADDRESS,
    },
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/mosaik-logo.png`,
      width: 1024,
      height: 353,
      caption: SITE_NAME,
    },
    image: `${SITE_URL}/mosaik-logo.png`,
    sameAs,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONTACT.phone,
        email: SITE_CONTACT.email,
        contactType: 'customer service',
        areaServed: 'DE',
        availableLanguage: ['de', 'tr', 'en'],
      },
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Rüsselsheim am Main' },
      { '@type': 'AdministrativeArea', name: 'Kreis Groß-Gerau' },
      { '@type': 'AdministrativeArea', name: 'Main-Taunus-Kreis' },
    ],
    knowsAbout: [
      'Interkultureller Dialog',
      'Bildung & Nachhilfe',
      'Jugendarbeit',
      'Sprachförderung',
      'Flüchtlingshilfe',
      'Integration',
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'de-DE',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function projectArticleSchema(project: {
  title: string
  slug: string
  excerpt?: string | null
  publishedDate?: string | null
  updatedAt?: string | null
  imageUrl?: string | null
  authorName?: string | null
}) {
  const url = `${SITE_URL}/projekt/${project.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}/#article`,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    headline: project.title,
    description: project.excerpt || undefined,
    url,
    inLanguage: 'de-DE',
    mainEntityOfPage: url,
    datePublished: project.publishedDate || undefined,
    dateModified: project.updatedAt || project.publishedDate || undefined,
    image: project.imageUrl || `${SITE_URL}/mosaik-logo.png`,
    author: {
      '@type': 'Organization',
      name: project.authorName || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  }
}

export function eventSchema(event: {
  title: string
  description?: string | null
  startDate: string
  endDate?: string | null
  location?: string | null
  url?: string | null
  imageUrl?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || undefined,
    startDate: event.startDate,
    endDate: event.endDate || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location || 'Mosaik Begegnungszentrum',
      address: {
        '@type': 'PostalAddress',
        ...SITE_ADDRESS,
      },
    },
    image: event.imageUrl || `${SITE_URL}/mosaik-logo.png`,
    organizer: {
      '@id': `${SITE_URL}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: event.url || `${SITE_URL}/aktivitaet`,
    },
  }
}

export function aboutPageSchema() {
  const url = `${SITE_URL}/ueber-uns`
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}/#aboutpage`,
    url,
    name: `Über uns | ${SITE_NAME}`,
    description: `Lernen Sie ${SITE_NAME} kennen – Geschichte, Werte und gesellschaftliches Engagement in Rüsselsheim.`,
    inLanguage: 'de-DE',
    mainEntity: {
      '@id': `${SITE_URL}/#organization`,
    },
  }
}

export function contactPageSchema() {
  const url = `${SITE_URL}/kontakt`
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${url}/#contactpage`,
    url,
    name: `Kontakt | ${SITE_NAME}`,
    description: `Kontaktieren Sie ${SITE_NAME} in Rüsselsheim – Adresse, Telefon, E-Mail und Anfahrt.`,
    inLanguage: 'de-DE',
    mainEntity: {
      '@id': `${SITE_URL}/#organization`,
    },
  }
}

export function donatePageSchema() {
  const url = `${SITE_URL}/spenden`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}/#donatepage`,
    url,
    name: `Spenden | ${SITE_NAME}`,
    description: `Unterstützen Sie ${SITE_NAME} bei Bildung, Jugendarbeit und Integration mit Ihrer Spende.`,
    inLanguage: 'de-DE',
    potentialAction: {
      '@type': 'DonateAction',
      recipient: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  }
}

export function webPageSchema(page: {
  title: string
  slug: string
  description?: string | null
}) {
  const url = `${SITE_URL}/${page.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}/#webpage`,
    url,
    name: `${page.title} | ${SITE_NAME}`,
    description: page.description || undefined,
    inLanguage: 'de-DE',
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  }
}

export function jsonLdGraph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  }
}

export function staticPageMetadata(
  path: string,
  title: string,
  description?: string,
): {
  alternates: { canonical: string }
  openGraph?: Record<string, unknown>
  twitter?: Record<string, unknown>
} {
  const canonical = path
  return {
    alternates: { canonical },
    openGraph: description
      ? {
          type: 'website',
          locale: SITE_LOCALE,
          url: `${SITE_URL}${canonical}`,
          siteName: SITE_NAME,
          title,
          description,
        }
      : undefined,
    twitter: description
      ? { card: 'summary_large_image', title, description }
      : undefined,
  }
}
