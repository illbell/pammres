/**
 * Seeds the CMS with the content from the PAMMRES website guide:
 * officers (current and 2019 inaugural), theme groups, partner institutions,
 * and Site Settings (announcement).
 *
 *   pnpm seed
 *
 * Safe to re-run: it only creates records that don't exist yet (matched by
 * slug / number) and never overwrites anything edited in the admin.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { institutions } from '../app/(frontend)/content/institutions'
import { foundingOfficers, officerGroups, themeGroups } from '../app/(frontend)/content/officers'
import { pillars } from '../app/(frontend)/content/pillars'
import { slugify } from '../fields/slug'

// Seeding runs outside Next.js; skip page revalidation hooks.
const context = { disableRevalidate: true }

async function seed() {
  const payload = await getPayload({ config })
  const created: Record<string, number> = {}
  const count = (key: string) => (created[key] = (created[key] ?? 0) + 1)

  /* Officers (current) */
  let order = 0
  for (const group of officerGroups) {
    for (const o of group.officers) {
      order += 10
      const exists = await payload.count({
        collection: 'officers',
        where: { slug: { equals: o.slug } },
      })
      if (exists.totalDocs) continue
      await payload.create({
        collection: 'officers',
        data: {
          name: o.name,
          role: o.role,
          institution: o.institution,
          group: group.id as 'executive' | 'regional' | 'governance' | 'technology',
          current: true,
          order,
          slug: o.slug,
        },
        context,
      })
      count('officers')
    }
  }

  /* Officers (2019 inaugural) */
  for (const [i, o] of foundingOfficers.entries()) {
    const slug = `founding-${slugify(o.name)}`
    const exists = await payload.count({
      collection: 'officers',
      where: { slug: { equals: slug } },
    })
    if (exists.totalDocs) continue
    await payload.create({
      collection: 'officers',
      data: {
        name: o.name,
        role: o.role,
        current: false,
        term: 'Founding & 2019 Inaugural Officers',
        order: 1000 + i * 10,
        slug,
      },
      context,
    })
    count('past officers')
  }

  /* Theme groups */
  for (const t of themeGroups) {
    const exists = await payload.count({
      collection: 'theme-groups',
      where: { number: { equals: t.number } },
    })
    if (exists.totalDocs) continue
    const pillar = pillars.find((p) => p.number === t.number)
    await payload.create({
      collection: 'theme-groups',
      data: {
        number: t.number,
        title: t.title,
        summary: pillar?.summary ?? '',
        mandate: t.mandate,
        leaderName: t.leader,
        leaderInstitution: t.institution,
        icon: pillar?.icon ?? 'globe',
      },
      context,
    })
    count('theme groups')
  }

  /* Partners */
  for (const [i, inst] of institutions.entries()) {
    const exists = await payload.count({
      collection: 'partners',
      where: { slug: { equals: inst.slug } },
    })
    if (exists.totalDocs) continue
    await payload.create({
      collection: 'partners',
      data: {
        name: inst.name,
        shortName: inst.short,
        type:
          inst.slug === 'deped' ? 'government' : inst.slug === 'mda' ? 'basic-education' : 'hei',
        showOnHome: true,
        order: (i + 1) * 10,
        slug: inst.slug,
      },
      context,
    })
    count('partners')
  }

  /* Site Settings: only fill the announcement if it has never been set */
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (!settings.announcement?.title) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        announcement: {
          mode: 'custom',
          label: 'Upcoming event',
          title: 'PAMMRES Free Mini-Webinar Series & Research Colloquium',
          body: 'Open to seasoned researchers, faculty, and graduate students nationwide.',
          linkLabel: 'Register Now',
          linkUrl: '/events#upcoming',
        },
      },
      context,
    })
    count('site settings')
  }

  const summary = Object.entries(created)
    .map(([k, n]) => `${n} ${k}`)
    .join(', ')
  console.log(summary ? `Seeded: ${summary}.` : 'Nothing to seed; everything already exists.')
}

// Top-level await: `payload run` exits as soon as this module finishes importing.
try {
  await seed()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
