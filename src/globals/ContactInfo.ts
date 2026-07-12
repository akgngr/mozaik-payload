import type { GlobalConfig } from 'payload'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'heroTitle', type: 'text' },
    { name: 'heroText', type: 'textarea' },
    { name: 'organisation', type: 'text' },
    { name: 'addressLine1', type: 'text' },
    { name: 'addressLine2', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'officeHoursWeekday', type: 'text' },
    { name: 'officeHoursWeekend', type: 'text' },
    { name: 'mapEmbedUrl', type: 'text' },
  ],
}
