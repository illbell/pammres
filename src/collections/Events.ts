import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { validateUrl } from '../fields/url'
import { revalidatePages } from '../hooks/revalidate'

export const eventTypes = [
  { label: 'Webinar', value: 'webinar' },
  { label: 'Workshop / training', value: 'workshop' },
  { label: 'Conference', value: 'conference' },
  { label: 'Colloquium', value: 'colloquium' },
  { label: 'Fellowship session', value: 'fellowship' },
  { label: 'Other', value: 'other' },
] as const

/**
 * Webinars, workshops and conferences, upcoming and past. Drafts let editors
 * prepare an event before it appears on the site.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startDate', 'featured', '_status'],
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
  defaultSort: '-startDate',
  hooks: revalidatePages(['/', '/events'], (doc) =>
    typeof doc.slug === 'string' ? [`/events/${doc.slug}`] : [],
  ),
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          index: true,
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          admin: { width: '50%', description: 'Venue, or e.g. "Online via Zoom".' },
        },
        {
          name: 'registrationUrl',
          label: 'Registration link',
          type: 'text',
          validate: validateUrl,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'One or two sentences for listings and the announcement bar.' },
    },
    { name: 'description', type: 'richText' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Photos from the event, for the past events gallery.' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'webinar',
      options: [...eventTypes],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'Feature in the home page announcement bar',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'The soonest upcoming featured event is announced, unless Site Settings sets its own announcement.',
      },
    },
    slugField('title'),
  ],
}
