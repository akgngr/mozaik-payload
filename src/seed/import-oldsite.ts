/**
 * One-time import of the legacy Astro site (https://mosaik-russelsheim.de).
 * Source data: /tmp/oldsite.json + /tmp/oldsite-media (produced by crawl_mosaik.py)
 * Run: npx payload run src/seed/import-oldsite.ts
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Block = { type: 'h2' | 'h3' | 'p' | 'ul'; text?: string; items?: string[] }
type Img = { url: string; alt: string; file: string }
type PageEntry = { slug: string; title: string; blocks: Block[]; images: Img[] }
type ProjectEntry = {
  slug: string
  title: string
  date: string | null
  blocks: Block[]
  images: Img[]
  excerpt: string
}
type OldData = {
  pages: PageEntry[]
  projects: ProjectEntry[]
  media: Record<string, string>
  homepage: { heroImages: Img[]; heroTitles: string[]; activities: { title: string; text: string }[]; about: string }
  spenden: Record<string, string | null>
  kontakt: Record<string, string>
}

const MEDIA_DIR = '/tmp/oldsite-media'
const data: OldData = JSON.parse(fs.readFileSync('/tmp/oldsite.json', 'utf-8'))

const textNode = (text: string) => ({
  type: 'text',
  text,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const blocksToLexical = (blocks: Block[]): unknown => ({
  root: {
    type: 'root',
    children: blocks.map((block) => {
      if (block.type === 'ul') {
        return {
          type: 'list',
          listType: 'bullet',
          tag: 'ul',
          start: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: (block.items || []).map((item) => ({
            type: 'listitem',
            children: [textNode(item)],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            value: 1,
          })),
        }
      }
      if (block.type === 'h2' || block.type === 'h3') {
        return {
          type: 'heading',
          tag: block.type,
          children: [textNode(block.text || '')],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        }
      }
      return {
        type: 'paragraph',
        children: [textNode(block.text || '')],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      }
    }),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Importing legacy site content...')

  // ---------- media ----------
  // Reuse media already in the DB by alt text (from the initial seed run)
  const mediaCache = new Map<string, number>() // filename -> media id
  const findByAlt = async (alt: string) => {
    const r = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
    return r.docs[0]?.id as number | undefined
  }
  const seedAlts = [
    'Mosaik Dialog und Kultur – Gemeinschaft',
    'Deutschkurs – gemeinsames Lernen',
    'Jugendprogramm – kultureller Austausch',
    'Integration und Zusammenleben',
    'Kooperation mit Projekt Aufbruch',
  ]
  const seedIds: (number | undefined)[] = []
  for (const alt of seedAlts) seedIds.push(await findByAlt(alt))

  const uploadMedia = async (file: string, alt: string): Promise<number> => {
    if (mediaCache.has(file)) return mediaCache.get(file)!
    const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
    if (existing.docs[0]) {
      mediaCache.set(file, existing.docs[0].id as number)
      return existing.docs[0].id as number
    }
    const filePath = path.join(MEDIA_DIR, file)
    if (!fs.existsSync(filePath)) throw new Error(`Missing media file: ${filePath}`)
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath,
    })
    mediaCache.set(file, doc.id as number)
    return doc.id as number
  }

  // ---------- pages ----------
  for (const page of data.pages) {
    // old site slug "uber-uns" -> new route "ueber-uns"
    const slug = page.slug === 'uber-uns' ? 'ueber-uns' : page.slug
    const pageData = {
      title: page.title,
      slug,
      content: blocksToLexical(page.blocks) as never,
    }
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs[0]) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data: pageData })
    } else {
      await payload.create({ collection: 'pages', data: pageData })
    }
    payload.logger.info(`page: ${slug} (${page.blocks.length} blocks)`)
  }

  // ---------- projects (newest first) ----------
  const sorted = [...data.projects].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]
    const cover = p.images[0] ? await uploadMedia(p.images[0].file, p.images[0].alt || p.title) : undefined
    const gallery = []
    for (const img of p.images.slice(1)) {
      gallery.push({ image: await uploadMedia(img.file, img.alt || p.title) })
    }
    const projectData = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || null,
      coverImage: cover ?? null,
      publishedDate: p.date || null,
      order: i,
      content: blocksToLexical(p.blocks) as never,
      gallery,
    }
    const existing = await payload.find({ collection: 'projects', where: { slug: { equals: p.slug } }, limit: 1 })
    if (existing.docs[0]) {
      await payload.update({ collection: 'projects', id: existing.docs[0].id, data: projectData })
    } else {
      await payload.create({ collection: 'projects', data: projectData })
    }
    payload.logger.info(`project: ${p.slug} (imgs: ${p.images.length})`)
  }

  // ---------- globals ----------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Mosaik Dialog und Kultur e.V.',
      siteDescription:
        'Gemeinnütziger Verein für Bildung, Jugendarbeit und interkulturellen Dialog in Rüsselsheim.',
    },
  })

  // Homepage: real hero slides from the old site + real about text
  const heroImages = []
  for (const img of data.homepage.heroImages) {
    heroImages.push({ image: await uploadMedia(img.file, img.alt || 'Mosaik Dialog und Kultur') })
  }
  const activityIcons = ['course', 'users', 'heart', 'building'] as const
  const activityLinks = ['/kurse', '/jugendarbeit', '/fluchtlingshilfe', '/zusammenleben']
  const activityTitles = ['Kurse', 'Jugendarbeit', 'Flüchtlingshilfe', 'Dialog']
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      heroEyebrow: 'Gemeinsam für Bildung, Toleranz und Frieden',
      heroTitle: 'Mosaik Dialog und Kultur e.V.',
      heroSubtitle:
        'Der gemeinnützige Verein in Rüsselsheim – Bildung, Jugendarbeit und interkultureller Dialog, im Kreis Groß-Gerau und im Main-Taunus-Kreis.',
      heroImages,
      introTitle: 'Über Uns',
      introText:
        data.homepage.about ||
        'Der Verein Mosaik Dialog und Kultur ist ein gemeinnütziger, eingetragener Verein in Rüsselsheim. Unser Wirkungskreis umfasst den Kreis Groß-Gerau und den Main-Taunus-Kreis.',
      highlightCards: activityTitles.map((title, idx) => ({
        icon: activityIcons[idx],
        title,
        text:
          title === 'Dialog'
            ? 'Aktivitäten, die den interkulturellen Dialog in Rüsselsheim stärken.'
            : title === 'Kurse'
              ? 'Deutschkurse und Nachhilfe für Menschen aller Altersgruppen.'
              : title === 'Jugendarbeit'
                ? 'Kulturelle Austausch- und Bildungsprogramme für Jugendliche.'
                : 'Unterstützung und Orientierung für neu angekommene Geflüchtete.',
        link: activityLinks[idx],
      })),
      ctaTitle: 'Ihre Unterstützung macht einen Unterschied!',
      ctaText:
        'Jede Spende hilft uns dabei, unsere Programme fortzuführen und noch mehr Menschen in unserer Gemeinschaft zu unterstützen.',
    },
  })
  payload.logger.info('homepage global updated')

  await payload.updateGlobal({
    slug: 'donation',
    data: {
      heroTitle: 'Mosaik Dialog und Kultur',
      heroSubtitle: 'Gemeinsam für Bildung, Toleranz und Frieden',
      heroText:
        'Mosaik Dialog und Kultur ist ein eingetragener gemeinnütziger Verein in Rüsselsheim. Wir konzentrieren uns auf Bildung, Jugendprogramme, kulturelles Zusammenleben und Flüchtlingsunterstützung.',
      paypalUrl: null,
      bank: {
        accountHolder: 'MOZAIK DIALOG UND KULTUR E.V.',
        iban: 'DE10 5085 2553 0016 0896 58',
        bic: 'HELADEF1GRG',
        bankName: 'Kreissparkasse Groß-Gerau',
        purpose: 'Spende',
      },
      impactCards: [
        {
          title: 'Sprachkurse',
          description: 'Ermöglichen Sie Neuankömmlingen den Zugang zu Deutschkursen.',
          image: seedIds[1] ?? null,
        },
        {
          title: 'Jugendprogramme',
          description: 'Unterstützen Sie kulturelle Austauschprogramme für Jugendliche.',
          image: seedIds[2] ?? null,
        },
        {
          title: 'Integration',
          description: 'Helfen Sie bei der Integration von Geflüchteten in unsere Gemeinschaft.',
          image: seedIds[3] ?? null,
        },
      ],
      ctaTitle: 'Ihre Unterstützung macht einen Unterschied!',
      ctaText:
        'Jede Spende hilft uns dabei, unsere Programme fortzuführen und noch mehr Menschen in unserer Gemeinschaft zu unterstützen.',
    },
  })
  payload.logger.info('donation global updated')

  await payload.updateGlobal({
    slug: 'contact-info',
    data: {
      ...data.kontakt,
      heroTitle: 'Kontaktieren Sie uns',
      heroText: 'Haben Sie Fragen oder möchten Sie mehr über unsere Arbeit erfahren? Wir freuen uns auf Ihre Nachricht!',
    },
  })
  payload.logger.info('contact-info global updated')

  payload.logger.info('Import complete.')
  process.exit(0)
}

try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
