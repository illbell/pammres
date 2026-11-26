import type { CollectionConfig } from 'payload'

import { authenticated, editorOrOwner } from '../access'

/** Largest accepted 2x2 photo, in bytes. */
export const MEMBER_PHOTO_MAX_BYTES = 2 * 1024 * 1024

/**
 * Members' 2x2 formal pictures. Kept apart from the public `media` collection
 * because they're personal data: only editors and the member who uploaded
 * the photo can see it. Uploads come through the member profile server action.
 */
export const MemberPhotos: CollectionConfig = {
  slug: 'member-photos',
  labels: { singular: 'Member photo', plural: 'Member photos' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'owner', 'createdAt'],
  },
  access: {
    read: editorOrOwner,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'member-photos',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
  ],
}
