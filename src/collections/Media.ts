import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

/** Public images (event covers, partner logos). Only editors can upload or change them. */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
