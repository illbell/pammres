import type { CollectionConfig } from 'payload'

import { authenticated, editorOrOwner } from '../access'
import { membershipCategories, paymentMethods } from './membership'

/** Largest accepted receipt, in bytes. */
export const RECEIPT_MAX_BYTES = 5 * 1024 * 1024

/**
 * Proof of payment that members upload with their application or renewal.
 * Private: only editors and the member who uploaded it can open it. Every
 * upload is kept, so the secretariat has a payment history per member.
 * Uploads come through the member server actions only.
 */
export const PaymentReceipts: CollectionConfig = {
  slug: 'payment-receipts',
  labels: { singular: 'Payment receipt', plural: 'Payment receipts' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'owner', 'purpose', 'category', 'reference', 'createdAt'],
    description: 'Receipts uploaded by members. Open one to check it against the payment reference.',
  },
  access: {
    read: editorOrOwner,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-createdAt',
  upload: {
    staticDir: 'payment-receipts',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
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
    {
      type: 'row',
      fields: [
        {
          name: 'purpose',
          type: 'select',
          required: true,
          defaultValue: 'application',
          options: [
            { label: 'New membership', value: 'application' },
            { label: 'Renewal', value: 'renewal' },
          ],
          admin: { readOnly: true },
        },
        { name: 'category', type: 'select', options: [...membershipCategories], admin: { readOnly: true } },
        { name: 'paymentMethod', type: 'select', options: [...paymentMethods], admin: { readOnly: true } },
        { name: 'reference', type: 'text', admin: { readOnly: true } },
      ],
    },
  ],
  timestamps: true,
}
