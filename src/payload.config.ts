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
import { Partners } from './collections/Partners'
import { ThemeGroups } from './collections/ThemeGroups'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
