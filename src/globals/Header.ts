import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Spenden',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/spenden',
    },
  ],
}
