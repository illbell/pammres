import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidatePages } from '../hooks/revalidate'

export const pillarIcons = [
  { label: 'Globe', value: 'globe' },
  { label: 'Impact (heart)', value: 'impact' },
  { label: 'Growth (sprout)', value: 'growth' },
  { label: 'Network', value: 'network' },
] as const

/**
 * PAMMRES's four strategic theme groups. The home page shows them as the
 * "Strategic Pillars" (summary); the About page lists each leader and mandate.
 * Leaders are free text because not every theme leader is a national officer.
 */
export const ThemeGroups: CollectionConfig = {
  slug: 'theme-groups',
  labels: { singular: 'Theme group', plural: 'Theme groups' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'leaderName'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'number',
  hooks: revalidatePages(['/', '/about']),
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'number',
          type: 'number',
          required: true,
          unique: true,
          min: 1,
          admin: { width: '20%' },
        },
        { name: 'title', type: 'text', required: true, admin: { width: '80%' } },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown on the home page pillar card.' },
    },
    {
      name: 'mandate',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown on the About page under the leader.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'leaderName', label: 'Leader', type: 'text', required: true },
        { name: 'leaderInstitution', label: 'Leader’s institution', type: 'text' },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'globe',
      options: [...pillarIcons],
      admin: { position: 'sidebar' },
    },
  ],
}
