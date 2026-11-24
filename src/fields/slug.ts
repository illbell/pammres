import type { Field, FieldHook } from 'payload'

export const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Unique URL/file-safe slug, filled from another field when left empty.
 * Used e.g. for officer headshot fallbacks (/public/images/officers/<slug>.jpg).
 */
export function slugField(from: string): Field {
  const fill: FieldHook = ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[from]
    return typeof source === 'string' ? slugify(source) : value
  }

  return {
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: `Filled from the ${from} if left empty.`,
    },
    hooks: { beforeValidate: [fill] },
  }
}
