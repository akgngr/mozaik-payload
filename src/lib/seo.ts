import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_ADDRESS,
  SITE_CONTACT,
} from './site'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
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
      url: `${SITE_URL}/mosaik-emblem.png`,
      width: 440,
      height: 530,
    },
    image: `${SITE_URL}/mosaik-emblem.png`,
    sameAs: [SITE_URL],
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
    inLanguage: 'de',
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
      item: `${SITE_URL}${item.path}`,
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

export function jsonLdGraph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
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
