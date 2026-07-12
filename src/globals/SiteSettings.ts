import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Mosaik Dialog und Kultur e.V.',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
    },
    {
      name: 'defaultSeoImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
