import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ContactMessages } from './collections/ContactMessages'
import { Events } from './collections/Events'
import { MemberPhotos } from './collections/MemberPhotos'
import { Members } from './collections/Members'
import { News } from './collections/News'
import { Officers } from './collections/Officers'
import { PaymentReceipts } from './collections/PaymentReceipts'
import { Partners } from './collections/Partners'
import { ThemeGroups } from './collections/ThemeGroups'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Required settings. A missing or short PAYLOAD_SECRET would sign login tokens
 * with a guessable key (anyone could forge an editor session), so production
 * refuses to start without a real one.
 */
function requiredEnv(name: string, minLength = 1): string {
  const value = process.env[name] ?? ''
  if (value.length >= minLength) return value
  const message = `${name} is missing or too short (needs at least ${minLength} characters). Set it in the environment.`
  if (process.env.NODE_ENV === 'production') throw new Error(message)
  console.warn(`[config] ${message}`)
  return value
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Officers,
    ThemeGroups,
    Events,
    News,
    Partners,
    Members,
    ContactMessages,
    Media,
    MemberPhotos,
    PaymentReceipts,
    Users,
  ],
  globals: [SiteSettings],
  // The site uses the Local and REST APIs only; GraphQL is switched off to shrink the attack surface.
  graphQL: { disable: true },
  editor: lexicalEditor(),
  secret: requiredEnv('PAYLOAD_SECRET', 16),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: requiredEnv('DATABASE_URL'),
  }),
  sharp,
  plugins: [],
})
