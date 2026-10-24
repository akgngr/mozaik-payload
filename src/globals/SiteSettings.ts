import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website Einstellungen',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Logos & Icons',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Standard Logo (Header / Helle Hintergründe)',
              admin: {
                description: 'Hauptlogo für den Header und helle Bereiche (Standard: /mosaik-logo.png).',
              },
            },
            {
              name: 'logoLight',
              type: 'upload',
              relationTo: 'media',
              label: 'Helles Logo (Footer / Dunkle Hintergründe)',
              admin: {
                description: 'Helles/weißes Logo für den Footer und dunkle Flächen (Standard: /mosaik-logo-light.png).',
              },
            },
            {
              name: 'siteIcon',
              type: 'upload',
              relationTo: 'media',
              label: 'Website Icon / Favicon',
              admin: {
                description: 'Icon für den Browser-Tab (Favicon, z.B. 32x32 oder 512x512 PNG, ICO oder SVG).',
              },
            },
          ],
        },
        {
          label: 'Allgemein & SEO',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Website-Name',
              defaultValue: 'Mosaik Dialog und Kultur e.V.',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Website-Beschreibung (Meta Description)',
            },
            {
              name: 'defaultSeoImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Standard SEO-Bild (Social Media Sharing)',
              admin: {
                description: 'Vorschaubild für Social-Media-Links (OpenGraph / Twitter).',
              },
            },
          ],
        },
      ],
    },
  ],
}
