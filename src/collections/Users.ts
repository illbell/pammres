import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/**
 * Site editors: the only accounts that can sign in to /admin. Access is
 * explicit (editors only) so signed-in members can never read or create
 * editor accounts.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    unlock: authenticated,
    admin: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    // Email added by default
  ],
}
