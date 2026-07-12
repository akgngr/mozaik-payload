import type { GlobalConfig } from 'payload'

export const Donation: GlobalConfig = {
  slug: 'donation',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'heroTitle', type: 'text' },
    { name: 'heroSubtitle', type: 'text' },
    { name: 'heroText', type: 'textarea' },
    { name: 'paypalUrl', type: 'text' },
    {
      name: 'bank',
      type: 'group',
      fields: [
        { name: 'accountHolder', type: 'text' },
        { name: 'iban', type: 'text' },
        { name: 'bic', type: 'text' },
        { name: 'bankName', type: 'text' },
        { name: 'purpose', type: 'text' },
      ],
    },
    {
      name: 'impactCards',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'ctaTitle', type: 'text' },
    { name: 'ctaText', type: 'textarea' },
  ],
}
