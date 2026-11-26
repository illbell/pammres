import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

// Membership categories and fees (client revision, 2026-11-26). These are
// the categories offered on the site and in the application form.
export const membershipCategories = [
  { label: 'Regular Member (individual)', value: 'regular' },
  { label: 'Student (individual)', value: 'student' },
  { label: 'Institutional Member', value: 'institutional' },
] as const

/** Membership fee per category, in Philippine pesos. */
export const membershipFees: Record<(typeof membershipCategories)[number]['value'], number> = {
  regular: 500,
  student: 300,
  institutional: 2000,
}

// Categories from before the revision. Kept as admin-only options so earlier
// applications stay valid; the form no longer offers them.
const legacyMembershipCategories = [
  { label: 'Full Member (old category)', value: 'full' },
  { label: 'Associate / Emergent Scholar (old category)', value: 'associate' },
] as const

export const memberRegions = [
  { label: 'Luzon', value: 'luzon' },
  { label: 'Visayas', value: 'visayas' },
  { label: 'Mindanao', value: 'mindanao' },
  { label: 'Outside the Philippines', value: 'abroad' },
] as const

export const paymentMethods = [
  { label: 'Bank transfer', value: 'bank-transfer' },
  { label: 'GCash', value: 'gcash' },
  { label: 'Not paid yet', value: 'not-yet' },
] as const

/**
 * Applications sent through the membership form. Like contact messages, the
 * form saves them with the Local API from a server action, so the collection
 * itself allows no public access at all: these hold personal data.
 */
export const MembershipApplications: CollectionConfig = {
  slug: 'membership-applications',
  labels: { singular: 'Membership application', plural: 'Membership applications' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'institution', 'paymentMethod', 'status', 'createdAt'],
    description:
      'Applications sent through the old one-page membership form (before member accounts). New members now appear under Members.',
  },
  access: {
    read: authenticated,
    // Closed: new members sign up for an account instead (see Members). Kept for earlier applications.
    create: () => false,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 160 },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', maxLength: 40 },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [...membershipCategories, ...legacyMembershipCategories],
        },
        { name: 'region', type: 'select', required: true, options: [...memberRegions] },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'institution',
          label: 'Institution / organization',
          type: 'text',
          required: true,
          maxLength: 200,
        },
        { name: 'position', label: 'Position or program', type: 'text', maxLength: 160 },
      ],
    },
    {
      name: 'discipline',
      label: 'Discipline / research interests',
      type: 'text',
      maxLength: 300,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          defaultValue: 'not-yet',
          options: [...paymentMethods],
        },
        {
          name: 'paymentReference',
          label: 'Payment reference no.',
          type: 'text',
          maxLength: 100,
        },
      ],
    },
    { name: 'notes', type: 'textarea', maxLength: 3000 },
    {
      name: 'privacyConsent',
      label: 'Consented to data processing (Data Privacy Act of 2012)',
      type: 'checkbox',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Payment verified', value: 'payment-verified' },
        { label: 'Approved', value: 'approved' },
        { label: 'Declined', value: 'declined' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Only visible to editors.' },
    },
  ],
  timestamps: true,
}
