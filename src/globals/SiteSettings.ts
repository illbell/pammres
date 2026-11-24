import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { validateUrl } from '../fields/url'
import { revalidateAllPages } from '../hooks/revalidate'

/** Site-wide settings: announcement bar and contact details (header, footer, contact page). */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: { afterChange: [revalidateAllPages] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Announcement',
          description:
            'The bar under the home page hero. "Custom" shows the text below; "Next featured event" uses the soonest upcoming event marked as featured.',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              fields: [
                {
                  name: 'mode',
                  type: 'select',
                  required: true,
                  defaultValue: 'custom',
                  options: [
                    { label: 'Custom text', value: 'custom' },
                    { label: 'Next featured event', value: 'event' },
                    { label: 'Hidden', value: 'hidden' },
                  ],
                },
                {
                  name: 'label',
                  type: 'text',
                  defaultValue: 'Upcoming event',
                  admin: { condition: (_, s) => s?.mode !== 'hidden' },
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: { condition: (_, s) => s?.mode === 'custom' },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  admin: { condition: (_, s) => s?.mode === 'custom' },
                },
                {
                  type: 'row',
                  admin: { condition: (_, s) => s?.mode === 'custom' },
                  fields: [
                    { name: 'linkLabel', type: 'text', defaultValue: 'Register Now' },
                    {
                      name: 'linkUrl',
                      type: 'text',
                      validate: validateUrl,
                      admin: { description: 'e.g. /events#upcoming or a registration link' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'contactEmail', label: 'Official email', type: 'email' },
            {
              name: 'facebookUrl',
              label: 'Facebook page URL',
              type: 'text',
              validate: validateUrl,
            },
            { name: 'mailingAddress', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
