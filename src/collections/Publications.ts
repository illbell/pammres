import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

// The home page lists recent publications, so refresh it whenever one changes.
// revalidatePath throws outside a Next.js request (e.g. scripts), so ignore that.
const revalidateHome = () => {
  try {
    revalidatePath('/')
  } catch {
    // Not running inside Next.js; nothing to revalidate.
  }
}

const afterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateHome()
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateHome()
  return doc
}

export const publicationTypes = [
  { label: 'Journal article', value: 'journal-article' },
  { label: 'Book', value: 'book' },
  { label: 'Book chapter', value: 'book-chapter' },
  { label: 'Conference paper', value: 'conference-paper' },
  { label: 'Report', value: 'report' },
  { label: 'Thesis or dissertation', value: 'thesis' },
] as const

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'authors', 'year', 'type', '_status'],
  },
  versions: {
    drafts: true,
  },
  access: {
    // Anyone can read published publications; logged-in users also see drafts.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  defaultSort: '-year',
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'authors',
      type: 'text',
      required: true,
      admin: {
        description: 'As they should appear in the citation, e.g. "Santos, M. A., & Reyes, J. C."',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
          min: 1900,
          max: 2100,
          index: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'journal-article',
          options: [...publicationTypes],
        },
      ],
    },
    {
      name: 'venue',
      type: 'text',
      admin: {
        description: 'Journal, conference, publisher or institution.',
      },
    },
    {
      name: 'url',
      label: 'Link',
      type: 'text',
      admin: {
        description: 'DOI or URL where the publication can be read, e.g. https://doi.org/…',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          return url.protocol === 'https:' || url.protocol === 'http:'
            ? true
            : 'Link must start with http:// or https://'
        } catch {
          return 'Enter a full link, e.g. https://doi.org/10.1000/xyz123'
        }
      },
    },
    {
      name: 'abstract',
      type: 'textarea',
    },
  ],
}
