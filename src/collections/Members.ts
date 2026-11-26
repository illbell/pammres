import type { CollectionConfig, Field } from 'payload'

import { authenticated, authenticatedField, editorOrSelf } from '../access'
import { membershipCategories, paymentMethods } from './membership'

/*
 * PAMMRES members: site accounts (sign in at /login, never /admin) holding the
 * membership profile from PAMMRES's application form. Members fill the
 * profile in steps at /member/apply/1..4; the secretariat reviews it here
 * and sets the status.
 */

export const researchDesigns = [
  { label: 'Qualitative', value: 'qual' },
  { label: 'Quantitative', value: 'quant' },
  { label: 'Mixed methods', value: 'mixed' },
] as const

// Research interests from PAMMRES's membership form (Q16).
export const researchInterestOptions = [
  { label: 'Educational Research', value: 'educational' },
  { label: 'Science Research', value: 'science' },
  { label: 'Program Evaluation', value: 'program-evaluation' },
  { label: 'Business Research', value: 'business' },
  { label: 'Research Methodology', value: 'methodology' },
] as const

export const memberStatuses = [
  { label: 'Incomplete (still filling in)', value: 'incomplete' },
  { label: 'Pending review', value: 'pending' },
  { label: 'Payment verified', value: 'payment-verified' },
  { label: 'Approved', value: 'approved' },
  { label: 'Declined', value: 'declined' },
] as const

/** Number of profile steps a member completes before submitting. */
export const MEMBER_STEPS = 4

const research = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'title', type: 'textarea', maxLength: 500 },
    {
      type: 'row',
      fields: [
        { name: 'year', type: 'text', maxLength: 4, admin: { width: '20%' } },
        { name: 'publisher', type: 'text', maxLength: 200, admin: { width: '45%' } },
        {
          name: 'design',
          label: 'Research design',
          type: 'select',
          options: [...researchDesigns],
          admin: { width: '35%' },
        },
      ],
    },
  ],
})

/** Fields only editors may set: members can never change these themselves. */
const editorOnly = { create: authenticatedField, update: authenticatedField }

export const Members: CollectionConfig = {
  slug: 'members',
  labels: { singular: 'Member', plural: 'Members' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'category', 'status', 'createdAt'],
    description:
      'Member accounts from the website. Check the payment reference, then set the status to Approved or Declined. To reset a forgotten password, open the member and use "Change password".',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    // Sign-up goes through a server action (trusted write), so the API allows no public create.
    create: authenticated,
    read: editorOrSelf,
    update: editorOrSelf,
    delete: authenticated,
    unlock: authenticated,
    // Members sign in on the site only, never in /admin.
    admin: () => false,
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const first = data.firstName ?? originalDoc?.firstName ?? ''
        const middle = data.middleName ?? originalDoc?.middleName ?? ''
        const last = data.lastName ?? originalDoc?.lastName ?? ''
        data.fullName = [first, middle, last].filter(Boolean).join(' ')
        if (data.status === 'approved' && originalDoc?.status !== 'approved' && !data.memberSince) {
          data.memberSince = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    // Email and password come from `auth`.
    {
      name: 'fullName',
      type: 'text',
      admin: { readOnly: true, hidden: true },
    },
    {
      type: 'collapsible',
      label: 'Personal information',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'firstName', type: 'text', required: true, maxLength: 100 },
            { name: 'middleName', type: 'text', maxLength: 100 },
            { name: 'lastName', type: 'text', required: true, maxLength: 100 },
          ],
        },
        { name: 'homeAddress', type: 'text', maxLength: 300 },
        {
          type: 'row',
          fields: [
            {
              name: 'institution',
              label: 'HEI / institution affiliated with',
              type: 'text',
              maxLength: 200,
            },
            {
              name: 'highestEducation',
              label: 'Highest educational attainment (with field of specialization)',
              type: 'text',
              maxLength: 300,
            },
          ],
        },
        { name: 'photo', label: '2x2 formal picture', type: 'upload', relationTo: 'member-photos' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Research',
      fields: [
        research('publishedResearch', 'Most recent published research'),
        research('unpublishedResearch', 'Most recent unpublished research'),
        {
          name: 'researchInterests',
          type: 'select',
          hasMany: true,
          options: [...researchInterestOptions],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'yearsResearching',
              label: 'Number of years doing research',
              type: 'number',
              min: 0,
              max: 80,
            },
            {
              name: 'webinarTopic',
              label: 'Mixed methods topic requested for a future webinar',
              type: 'text',
              maxLength: 300,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Membership and payment',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'category', type: 'select', options: [...membershipCategories] },
            { name: 'paymentMethod', type: 'select', options: [...paymentMethods] },
            { name: 'paymentReference', label: 'Payment reference no.', type: 'text', maxLength: 100 },
          ],
        },
        {
          name: 'privacyConsent',
          label: 'Consented to data processing (Data Privacy Act of 2012)',
          type: 'checkbox',
          access: editorOnly,
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'incomplete',
      options: [...memberStatuses],
      access: editorOnly,
      admin: { position: 'sidebar' },
    },
    {
      name: 'memberSince',
      type: 'date',
      access: editorOnly,
      admin: { position: 'sidebar', description: 'Set automatically when approved.' },
    },
    {
      name: 'completedSteps',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: MEMBER_STEPS,
      access: editorOnly,
      admin: { position: 'sidebar', readOnly: true, description: `Profile steps done (of ${MEMBER_STEPS}).` },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      access: { read: authenticatedField, create: authenticatedField, update: authenticatedField },
      admin: { position: 'sidebar', description: 'Only visible to editors.' },
    },
  ],
  timestamps: true,
}
