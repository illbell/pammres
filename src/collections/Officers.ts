import type { CollectionConfig, SelectFieldSingleValidation } from 'payload'

import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidatePages } from '../hooks/revalidate'

export const officerGroups = [
  { label: 'Executive Leadership', value: 'executive' },
  { label: 'Regional Vice Presidents', value: 'regional' },
  { label: 'Secretariat, Treasury & Governance Officers', value: 'governance' },
  { label: 'Social Media & Technology Officers', value: 'technology' },
] as const

const requireGroupWhenCurrent: SelectFieldSingleValidation = (value, { siblingData }) =>
  (siblingData as { current?: boolean })?.current === false || value
    ? true
    : 'Choose a group for current officers.'

/**
 * National officers shown on the About page, plus past officers (e.g. the
 * 2019 inaugural officers) shown in the governance archive.
 */
export const Officers: CollectionConfig = {
  slug: 'officers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'group', 'current', 'order'],
    description:
      'Current officers appear on the About page, grouped and sorted by "Order". Uncheck "Current officer" to move someone to the governance archive.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  hooks: revalidatePages(['/about']),
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'As it should appear, with honorifics, e.g. "Dr. Maribel R. Gaite".' },
    },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'institution', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Square headshot. Without one, the officer’s initials are shown.' },
    },
    {
      name: 'current',
      label: 'Current officer',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'group',
      type: 'select',
      options: [...officerGroups],
      admin: {
        position: 'sidebar',
        condition: (data) => data?.current !== false,
      },
      validate: requireGroupWhenCurrent,
    },
    {
      name: 'term',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'For past officers. Officers with the same term share one archive panel, titled with this text, e.g. "Founding & 2019 Inaugural Officers".',
        condition: (data) => data?.current === false,
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    slugField('name'),
  ],
}
