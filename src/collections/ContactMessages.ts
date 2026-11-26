import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const contactTopics = [
  { label: 'General question', value: 'general' },
  { label: 'Membership', value: 'membership' },
  { label: 'Regional or school chapters', value: 'chapters' },
  { label: 'Mentorship program', value: 'mentorship' },
  { label: 'Events and training', value: 'events' },
  // Value kept as "publications" so earlier messages stay valid.
  { label: 'Research and publications', value: 'publications' },
  { label: 'Hosting a workshop or sponsorship', value: 'partnerships' },
] as const

/**
 * Messages sent through the website's contact form. The form saves them with
 * the Local API from a server action, so no public create access is needed:
 * only logged-in editors can read, create, update or delete through the API.
 */
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Contact message', plural: 'Contact messages' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'topic', 'status', 'createdAt'],
    description: 'Messages sent through the contact form on the website.',
  },
  access: {
    // Editors only: messages hold visitors' personal data, so members must not see them.
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 120 },
        { name: 'email', type: 'email', required: true },
      ],
    },
    { name: 'affiliation', type: 'text', maxLength: 200 },
    {
      name: 'topic',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [...contactTopics],
    },
    { name: 'message', type: 'textarea', required: true, maxLength: 5000 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
