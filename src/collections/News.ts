import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidatePages } from '../hooks/revalidate'

/**
 * News and announcements for the News page (client revision, 2026-11-26).
 * Drafts let editors prepare a post before it appears on the site.
 */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News post', plural: 'News' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', '_status'],
  },
  versions: { drafts: true },
  access: {
    read: publishedOrAuthenticated,
    // Draft history is editors-only (Payload's default lets any signed-in user, including members, read it)
    readVersions: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-publishedDate',
  hooks: revalidatePages(['/news'], (doc) =>
    typeof doc.slug === 'string' ? [`/news/${doc.slug}`] : [],
  ),
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'One or two sentences for the News listing.' },
    },
    { name: 'content', type: 'richText' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'publishedDate',
      label: 'Date',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    slugField('title'),
  ],
}
