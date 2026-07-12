import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroEyebrow',
      type: 'text',
    },
    {
      name: 'heroTitle',
      type: 'text',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
    },
    {
      name: 'heroImages',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'introTitle',
      type: 'text',
    },
    {
      name: 'introText',
      type: 'textarea',
    },
    {
      name: 'highlightCards',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ['school', 'users', 'heart', 'course', 'building', 'help'],
          defaultValue: 'heart',
        },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'link', type: 'text' },
      ],
    },
    {
      name: 'ctaTitle',
      type: 'text',
    },
    {
      name: 'ctaText',
      type: 'textarea',
    },
  ],
}
