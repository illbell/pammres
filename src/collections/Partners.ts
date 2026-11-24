import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { validateUrl } from '../fields/url'
import { revalidatePages } from '../hooks/revalidate'

export const partnerTypes = [
  { label: 'Higher education institution', value: 'hei' },
  { label: 'Basic education', value: 'basic-education' },
  { label: 'Government agency', value: 'government' },
  { label: 'International organization', value: 'international' },
  { label: 'NGO / other', value: 'other' },
] as const

/** Member institutions and partners (home page logo strip; later the Linkages page). */
export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortName', 'type', 'showOnHome', 'order'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  hooks: revalidatePages(['/', '/contact']),
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '65%' } },
        {
          name: 'shortName',
          label: 'Abbreviation',
          type: 'text',
          required: true,
          admin: { width: '35%', description: 'e.g. DLSU, UP Diliman' },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Transparent PNG or SVG works best. Without one, the name is shown.' },
    },
    { name: 'url', label: 'Website', type: 'text', validate: validateUrl },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'hei',
      options: [...partnerTypes],
      admin: { position: 'sidebar' },
    },
    {
      name: 'showOnHome',
      label: 'Show in home page logo strip',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    slugField('shortName'),
  ],
}
