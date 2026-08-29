import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'eventDate', 'location'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Veranstaltungstitel',
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'workshop',
      options: [
        { label: 'Sprache & Bildung', value: 'education' },
        { label: 'Kultur & Fest', value: 'culture' },
        { label: 'Jugend & Familie', value: 'youth' },
        { label: 'Dialog & Treffpunkt', value: 'dialog' },
        { label: 'Workshop & Kurs', value: 'workshop' },
      ],
      label: 'Kategorie',
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      label: 'Datum & Startzeit',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'd. MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Endzeit (optional)',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'd. MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Mosaik e.V., Bahnhofstr. 20, 65428 Rüsselsheim',
      label: 'Veranstaltungsort',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Kurzbeschreibung',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Bild',
    },
    {
      name: 'isHighlight',
      type: 'checkbox',
      label: 'Als Highlight hervorheben',
      defaultValue: false,
    },
  ],
}
