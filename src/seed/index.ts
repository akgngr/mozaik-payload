import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { richText } from './richtext'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const publicDir = path.resolve(dirname, '../../public')

const run = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding Mosaik Rüsselsheim content...')

  const media = async (file: string, alt: string) => {
    const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
    if (existing.docs[0]) return existing.docs[0]
    return payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(publicDir, file),
    })
  }

  const [slide1, courseImg, youthImg, integrationImg, projectImg] = await Promise.all([
    media('slide1.jpg', 'Mosaik Dialog und Kultur – Gemeinschaft'),
    media('dylan-gillis-KdeqA3aTnBY-unsplash.jpg', 'Deutschkurs – gemeinsames Lernen'),
    media('sincerely-media-dGxOgeXAXm8-unsplash.jpg', 'Jugendprogramm – kultureller Austausch'),
    media('alexas_fotos-x1CLah6pv6g-unsplash.jpg', 'Integration und Zusammenleben'),
    media('Kooperation-mit-Projekt-auf.jpg', 'Kooperation mit Projekt Aufbruch'),
  ])

  // Site settings
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Mosaik Dialog und Kultur e.V.',
      siteDescription:
        'Verein für Bildung, Jugendarbeit und interkulturellen Dialog in Rüsselsheim.',
    },
  })

  // Header
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { label: 'Home', url: '/' },
        { label: 'Über Uns', url: '/ueber-uns' },
        { label: 'Projekt', url: '/projekt' },
        { label: 'Aktivität', url: '/aktivitaet' },
        { label: 'Flüchtlingshilfe', url: '/fluchtlingshilfe' },
        { label: 'Kontakt', url: '/kontakt' },
      ],
      ctaLabel: 'Spenden',
      ctaUrl: '/spenden',
    },
  })

  // Footer
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      aboutText:
        'Der Verein Mosaik Dialog und Kultur e.V. in Rüsselsheim fördert Bildung, Jugendarbeit und interkulturellen Dialog durch Sprachkurse, Nachhilfe und kulturelle Aktivitäten.',
      officeHours: 'Mo. – Fr. 10:00–17:00 Uhr',
      links: [
        { label: 'Über Uns', url: '/ueber-uns' },
        { label: 'Datenschutzerklärung', url: '/datenschutzerklarung' },
        { label: 'Impressum', url: '/impressum' },
        { label: 'Kontakt', url: '/kontakt' },
      ],
      phone: '0179-7051273',
      email: 'kontakt@mosaik-ruesselsheim.de',
      address: 'Bahnhofstr. 20, 65428 Rüsselsheim',
      socialLinks: [
        { platform: 'facebook', url: 'https://www.facebook.com/mosaikruesselsheim' },
        { platform: 'instagram', url: 'https://www.instagram.com/mosaikruesselsheim' },
        { platform: 'youtube', url: 'https://www.youtube.com/channel/UCODuRWxvi22iFNEwEEpVaLg' },
        { platform: 'twitter', url: 'https://x.com/MosaikDialog' },
      ],
    },
  })

  // Homepage
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      heroEyebrow: 'Gemeinsam für Bildung, Toleranz und Frieden',
      heroTitle: 'Mosaik Dialog und Kultur e.V.',
      heroSubtitle:
        'Wir fördern Bildung, Jugendarbeit und interkulturellen Dialog in Rüsselsheim – mit Sprachkursen, Jugendprogrammen und Unterstützung für Geflüchtete.',
      heroImages: [{ image: slide1.id }, { image: courseImg.id }, { image: youthImg.id }],
      introTitle: 'Wer wir sind',
      introText:
        'Mosaik Dialog und Kultur ist ein eingetragener gemeinnütziger Verein in Rüsselsheim. Wir bringen Menschen unterschiedlicher Herkunft zusammen und setzen uns für Bildung, Toleranz und ein friedliches Zusammenleben ein.',
      highlightCards: [
        {
          icon: 'course',
          title: 'Sprachkurse',
          text: 'Deutschkurse und Nachhilfe für Menschen aller Altersgruppen.',
          link: '/kurse',
        },
        {
          icon: 'users',
          title: 'Jugendarbeit',
          text: 'Kulturelle Austausch- und Bildungsprogramme für Jugendliche.',
          link: '/jugendarbeit',
        },
        {
          icon: 'heart',
          title: 'Flüchtlingshilfe',
          text: 'Unterstützung und Orientierung für neu angekommene Geflüchtete.',
          link: '/fluchtlingshilfe',
        },
        {
          icon: 'building',
          title: 'Zusammenleben',
          text: 'Aktivitäten, die den interkulturellen Dialog in Rüsselsheim stärken.',
          link: '/zusammenleben',
        },
      ],
      ctaTitle: 'Ihre Unterstützung macht einen Unterschied!',
      ctaText:
        'Jede Spende hilft uns dabei, unsere Programme fortzuführen und noch mehr Menschen in unserer Gemeinschaft zu unterstützen.',
    },
  })

  // Donation
  await payload.updateGlobal({
    slug: 'donation',
    data: {
      heroTitle: 'Mosaik Dialog und Kultur',
      heroSubtitle: 'Gemeinsam für Bildung, Toleranz und Frieden',
      heroText:
        'Mosaik Dialog und Kultur ist ein eingetragener gemeinnütziger Verein in Rüsselsheim. Wir konzentrieren uns auf Bildung, Jugendprogramme, kulturelles Zusammenleben und Flüchtlingsunterstützung.',
      paypalUrl: 'https://paypal.me/mosaikruesselsheim',
      bank: {
        accountHolder: 'MOSAIK DIALOG UND KULTUR E.V.',
        iban: 'DE10 5085 2553 0016 0896 58',
        bic: 'HELADEF1GRG',
        bankName: 'Kreissparkasse Groß-Gerau',
        purpose: 'Spende',
      },
      impactCards: [
        {
          title: 'Sprachkurse',
          description: 'Ermöglichen Sie Neuankömmlingen den Zugang zu Deutschkursen.',
          image: courseImg.id,
        },
        {
          title: 'Jugendprogramme',
          description: 'Unterstützen Sie kulturelle Austauschprogramme für Jugendliche.',
          image: youthImg.id,
        },
        {
          title: 'Integration',
          description: 'Helfen Sie bei der Integration von Geflüchteten in unsere Gemeinschaft.',
          image: integrationImg.id,
        },
      ],
      ctaTitle: 'Ihre Unterstützung macht einen Unterschied!',
      ctaText:
        'Jede Spende hilft uns dabei, unsere Programme fortzuführen und noch mehr Menschen in unserer Gemeinschaft zu unterstützen.',
    },
  })

  // Contact info
  await payload.updateGlobal({
    slug: 'contact-info',
    data: {
      heroTitle: 'Kontaktieren Sie uns',
      heroText:
        'Haben Sie Fragen oder möchten Sie mehr über unsere Arbeit erfahren? Wir freuen uns auf Ihre Nachricht!',
      organisation: 'Mosaik Dialog und Kultur e.V.',
      addressLine1: 'Bahnhofstr. 20',
      addressLine2: '65428 Rüsselsheim',
      phone: '+49 179-7051273',
      email: 'kontakt@mosaik-ruesselsheim.de',
      officeHoursWeekday: 'Montag – Freitag: 10:00 – 17:00 Uhr',
      officeHoursWeekend: 'Samstag & Sonntag: Geschlossen',
      mapEmbedUrl: 'https://www.google.com/maps?q=Bahnhofstr.+20+65428+R%C3%BCsselsheim&output=embed',
    },
  })

  // Pages
  const pages = [
    {
      slug: 'ueber-uns',
      title: 'Über Uns',
      heroEyebrow: 'Der Verein',
      heroSubtitle: 'Bildung, Dialog und Zusammenhalt in Rüsselsheim.',
      content: richText([
        { h2: 'Unsere Geschichte' },
        {
          p: 'Mosaik Dialog und Kultur e.V. wurde von engagierten Menschen in Rüsselsheim gegründet, die sich für Bildung, Toleranz und ein friedliches Zusammenleben einsetzen. Seitdem sind wir zu einem festen Bestandteil des interkulturellen Lebens in der Stadt geworden.',
        },
        { h2: 'Unsere Mission' },
        {
          p: 'Wir fördern Bildung und interkulturellen Austausch durch Sprachkurse, Nachhilfe, Jugendprogramme und kulturelle Aktivitäten. Dabei stehen Offenheit, gegenseitiger Respekt und Chancengleichheit im Mittelpunkt unserer Arbeit.',
        },
        { h2: 'Unsere Werte' },
        {
          ul: [
            'Bildung für alle, unabhängig von Herkunft',
            'Interkultureller Dialog auf Augenhöhe',
            'Ehrenamtliches Engagement und Gemeinschaft',
            'Nachhaltige Unterstützung von Familien und Jugendlichen',
          ],
        },
      ]),
    },
    {
      slug: 'aktivitaet',
      title: 'Aktivität',
      heroEyebrow: 'Programm',
      heroSubtitle: 'Ein Einblick in unsere laufenden Aktivitäten.',
      content: richText([
        { h2: 'Unsere Aktivitäten' },
        {
          p: 'Regelmäßig organisieren wir Veranstaltungen, Workshops und kulturelle Treffen, die Menschen unterschiedlicher Herkunft zusammenbringen – von Sprachcafés über Familiennachmittage bis hin zu interkulturellen Festen.',
        },
        {
          ul: [
            'Sprachcafé – zwangloses Deutsch üben bei Kaffee und Tee',
            'Familiennachmittage mit Spiel- und Bastelangeboten',
            'Interkulturelle Feste und gemeinsames Kochen',
            'Ausflüge und Freizeitangebote für Jung und Alt',
          ],
        },
        { p: 'Aktuelle Termine erfragen Sie gerne direkt über unser Kontaktformular.' },
      ]),
    },
    {
      slug: 'fluchtlingshilfe',
      title: 'Flüchtlingshilfe',
      heroEyebrow: 'Unterstützung',
      heroSubtitle: 'Orientierung und Hilfe für neu angekommene Menschen.',
      content: richText([
        { h2: 'Wie wir helfen' },
        {
          p: 'Wir begleiten geflüchtete Menschen in den ersten Monaten nach ihrer Ankunft: bei Behördengängen, der Wohnungssuche, dem Zugang zu Sprachkursen und der Orientierung im Alltag.',
        },
        {
          ul: [
            'Begleitung bei Ämtern und Behördengängen',
            'Vermittlung von Deutsch- und Integrationskursen',
            'Patenschaften und persönliche Ansprechpartner',
            'Kleider- und Sachspenden für Neuankömmlinge',
          ],
        },
        { h2: 'Mitmachen' },
        {
          p: 'Möchten Sie sich ehrenamtlich engagieren oder benötigen Sie selbst Unterstützung? Nehmen Sie gerne Kontakt zu uns auf.',
        },
      ]),
    },
    {
      slug: 'jugendarbeit',
      title: 'Jugendarbeit',
      heroEyebrow: 'Für die nächste Generation',
      heroSubtitle: 'Bildung und kultureller Austausch für Jugendliche.',
      content: richText([
        { h2: 'Unsere Jugendprogramme' },
        {
          p: 'Wir bieten jungen Menschen einen sicheren Raum für Austausch, Lernen und persönliche Entwicklung – unabhängig von ihrer Herkunft.',
        },
        {
          ul: [
            'Hausaufgaben- und Nachhilfebetreuung',
            'Kulturelle Austauschprogramme und Workshops',
            'Freizeit- und Ferienangebote',
            'Berufsorientierung und Bewerbungscoaching',
          ],
        },
      ]),
    },
    {
      slug: 'kurse',
      title: 'Kurse',
      heroEyebrow: 'Bildungsangebot',
      heroSubtitle: 'Deutschkurse und Nachhilfe für alle Altersgruppen.',
      content: richText([
        { h2: 'Unser Kursangebot' },
        {
          p: 'Sprache ist der Schlüssel zur Teilhabe. Deshalb bieten wir Deutschkurse auf verschiedenen Niveaustufen sowie Nachhilfe in zahlreichen Schulfächern an.',
        },
        {
          ul: [
            'Deutschkurse für Anfänger und Fortgeschrittene',
            'Alphabetisierungskurse',
            'Nachhilfe in Mathematik, Deutsch und weiteren Fächern',
            'Prüfungsvorbereitung',
          ],
        },
        { p: 'Für aktuelle Kurszeiten und Anmeldung kontaktieren Sie uns gerne.' },
      ]),
    },
    {
      slug: 'zusammenleben',
      title: 'Zusammenleben',
      heroEyebrow: 'Miteinander',
      heroSubtitle: 'Interkultureller Dialog und Gemeinschaft in Rüsselsheim.',
      content: richText([
        { h2: 'Gemeinsam stärker' },
        {
          p: 'Ein gutes Zusammenleben entsteht durch Begegnung. Wir schaffen Räume, in denen Menschen unterschiedlicher Kulturen einander kennenlernen, voneinander lernen und gemeinsam die Stadtgesellschaft mitgestalten.',
        },
        {
          ul: [
            'Interkulturelle Nachbarschaftstreffen',
            'Gemeinsame Projekte mit lokalen Partnern',
            'Veranstaltungen zu Dialog und Verständigung',
          ],
        },
      ]),
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      content: richText([
        { h2: 'Angaben gemäß § 5 TMG' },
        { p: 'Mosaik Dialog und Kultur e.V.' },
        { p: 'Bahnhofstr. 20' },
        { p: '65428 Rüsselsheim' },
        { h3: 'Vertreten durch' },
        { p: 'Den Vorstand des Vereins (Angaben werden ergänzt).' },
        { h3: 'Kontakt' },
        { p: 'Telefon: 0179-7051273' },
        { p: 'E-Mail: kontakt@mosaik-ruesselsheim.de' },
        { h3: 'Registereintrag' },
        { p: 'Eintragung im Vereinsregister. Registergericht und Registernummer werden ergänzt.' },
        { h3: 'Streitschlichtung' },
        {
          p: 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        },
      ]),
    },
    {
      slug: 'datenschutzerklarung',
      title: 'Datenschutzerklärung',
      content: richText([
        { h2: '1. Verantwortlicher' },
        {
          p: 'Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Mosaik Dialog und Kultur e.V., Bahnhofstr. 20, 65428 Rüsselsheim, kontakt@mosaik-ruesselsheim.de.',
        },
        { h2: '2. Erhebung und Verarbeitung personenbezogener Daten' },
        {
          p: 'Wir erheben personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Website und unserer Angebote erforderlich ist, etwa wenn Sie uns über das Kontaktformular oder per E-Mail kontaktieren.',
        },
        { h2: '3. Ihre Rechte' },
        {
          ul: [
            'Recht auf Auskunft über Ihre gespeicherten Daten',
            'Recht auf Berichtigung oder Löschung',
            'Recht auf Einschränkung der Verarbeitung',
            'Recht auf Widerspruch gegen die Verarbeitung',
            'Recht auf Datenübertragbarkeit',
          ],
        },
        { h2: '4. Kontakt' },
        {
          p: 'Bei Fragen zum Datenschutz wenden Sie sich bitte an kontakt@mosaik-ruesselsheim.de. Diese Erklärung ist ein Muster und sollte vor Veröffentlichung rechtlich geprüft werden.',
        },
      ]),
    },
  ]

  for (const page of pages) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1 })
    if (existing.docs[0]) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data: page })
    } else {
      await payload.create({ collection: 'pages', data: page })
    }
  }

  // Projects
  const projects = [
    {
      slug: 'projekt-aufbruch',
      title: 'Kooperation mit Projekt Aufbruch',
      partner: 'Projekt Aufbruch',
      excerpt: 'Gemeinsame Bildungs- und Integrationsangebote für Familien in Rüsselsheim.',
      coverImage: projectImg.id,
      order: 1,
      content: richText([
        { h2: 'Über die Kooperation' },
        {
          p: 'In Zusammenarbeit mit Projekt Aufbruch bieten wir gemeinsame Bildungs- und Integrationsangebote für Familien in Rüsselsheim an. Ziel ist es, Ressourcen zu bündeln und noch mehr Menschen zu erreichen.',
        },
      ]),
    },
  ]

  for (const project of projects) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'projects', id: existing.docs[0].id, data: project })
    } else {
      await payload.create({ collection: 'projects', data: project })
    }
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

try {
  await run()
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
}
