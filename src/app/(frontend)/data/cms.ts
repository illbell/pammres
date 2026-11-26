// Server-only: reads content from Payload for the frontend pages.
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { eventTypes } from '@/collections/Events'
import type { Event, Media, News } from '@/payload-types'

import { resolvePhoto } from '../content/images'
import { institutions as fallbackInstitutions } from '../content/institutions'
import {
  foundingOfficers as fallbackFounding,
  officerGroups as fallbackOfficerGroups,
  themeGroups as fallbackThemeGroups,
} from '../content/officers'
import { pillars as fallbackPillars, type PillarIcon } from '../content/pillars'

/*
 * Each loader reads published content as a public visitor would
 * (overrideAccess: false). If the database can't be reached (e.g. a build
 * without one), it logs and falls back to the built-in content from the
 * website guide in ../content, so pages never break. An empty collection is
 * shown as empty: delete content in the admin and it disappears from the site.
 */

const getClient = cache(() => getPayload({ config }))

async function load<T>(label: string, fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error(`[cms] Could not load ${label}; using built-in content.`, error)
    return fallback()
  }
}

const mediaUrl = (m: unknown): { url: string; alt: string } | null => {
  if (m && typeof m === 'object' && 'url' in m) {
    const media = m as Media
    if (media.url) return { url: media.url, alt: media.alt ?? '' }
  }
  return null
}

/* ---------------------------------- Site settings ---------------------------------- */

export type Announcement = {
  label: string
  title: string
  body?: string
  link?: { label: string; href: string }
}

export type SiteSettingsData = {
  announcement: Announcement | null
  contactEmail: string | null
  facebookUrl: string | null
  mailingAddress: string | null
}

// Guide copy, used when the database is unavailable.
const fallbackAnnouncement: Announcement = {
  label: 'Upcoming event',
  title: 'PAMMRES Free Mini-Webinar Series & Research Colloquium',
  body: 'Open to seasoned researchers, faculty, and graduate students nationwide.',
  link: { label: 'Register Now', href: '/events#upcoming' },
}

export const getSiteSettings = cache((): Promise<SiteSettingsData> =>
  load(
    'site settings',
    async () => {
      const payload = await getClient()
      const s = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false })
      const a = s.announcement
      let announcement: Announcement | null = null

      if (a?.mode === 'custom' && a.title) {
        announcement = {
          label: a.label || 'Announcement',
          title: a.title,
          body: a.body || undefined,
          link: a.linkUrl ? { label: a.linkLabel || 'Learn more', href: a.linkUrl } : undefined,
        }
      } else if (a?.mode === 'event') {
        const { docs } = await payload.find({
          collection: 'events',
          where: {
            and: [
              { featured: { equals: true } },
              { startDate: { greater_than_equal: new Date().toISOString() } },
            ],
          },
          sort: 'startDate',
          limit: 1,
          depth: 0,
          overrideAccess: false,
          select: { title: true, summary: true, registrationUrl: true },
        })
        const event = docs[0]
        if (event) {
          announcement = {
            label: a.label || 'Upcoming event',
            title: event.title,
            body: event.summary,
            link: {
              label: 'Register Now',
              href: event.registrationUrl || '/events#upcoming',
            },
          }
        }
      }

      return {
        announcement,
        contactEmail: s.contactEmail || null,
        facebookUrl: s.facebookUrl || null,
        mailingAddress: s.mailingAddress || null,
      }
    },
    () => ({
      announcement: fallbackAnnouncement,
      contactEmail: null,
      facebookUrl: null,
      mailingAddress: null,
    }),
  ),
)

/* ---------------------------------- Officers ---------------------------------- */

export type OfficerView = {
  id: string
  name: string
  role: string
  institution?: string
  photo: { url: string; alt: string } | null
}

export type OfficerGroupView = {
  id: string
  title: string
  size: 'lg' | 'md'
  columns: string
  officers: OfficerView[]
}

// Layout per group; titles match the guide.
const groupLayout: Record<string, Omit<OfficerGroupView, 'officers'>> = Object.fromEntries(
  fallbackOfficerGroups.map((g) => [
    g.id,
    { id: g.id, title: g.title, size: g.size, columns: g.columns },
  ]),
)
const groupOrder = fallbackOfficerGroups.map((g) => g.id)

/** Headshot from the CMS, else /public/images/officers/<slug>.jpg, else none (initials). */
function officerPhoto(slug: string | null | undefined, name: string, cmsPhoto: unknown) {
  const fromCms = mediaUrl(cmsPhoto)
  if (fromCms) return { url: fromCms.url, alt: fromCms.alt || `Portrait of ${name}` }
  if (!slug) return null
  const local = resolvePhoto({
    src: `/images/officers/${slug}.jpg`,
    alt: `Portrait of ${name}`,
    brief: '',
  })
  return local.exists ? { url: local.src, alt: local.alt } : null
}

export const getOfficerGroups = cache((): Promise<OfficerGroupView[]> =>
  load(
    'officers',
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'officers',
        where: { current: { equals: true } },
        sort: 'order',
        limit: 100,
        depth: 1,
        overrideAccess: false,
      })
      return groupOrder
        .map((groupId) => ({
          ...groupLayout[groupId],
          officers: docs
            .filter((o) => o.group === groupId)
            .map((o) => ({
              id: String(o.id),
              name: o.name,
              role: o.role,
              institution: o.institution || undefined,
              photo: officerPhoto(o.slug, o.name, o.photo),
            })),
        }))
        .filter((g) => g.officers.length > 0)
    },
    () =>
      fallbackOfficerGroups.map((g) => ({
        id: g.id,
        title: g.title,
        size: g.size,
        columns: g.columns,
        officers: g.officers.map((o) => ({
          id: o.slug,
          name: o.name,
          role: o.role,
          institution: o.institution,
          photo: officerPhoto(o.slug, o.name, null),
        })),
      })),
  ),
)

export type PastOfficerTerm = { term: string; officers: { role: string; name: string }[] }

export const getPastOfficers = cache((): Promise<PastOfficerTerm[]> =>
  load(
    'past officers',
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'officers',
        where: { current: { equals: false } },
        sort: 'order',
        limit: 200,
        depth: 0,
        overrideAccess: false,
        select: { name: true, role: true, term: true },
      })
      const terms = new Map<string, PastOfficerTerm>()
      for (const o of docs) {
        const term = o.term || 'Past officers'
        if (!terms.has(term)) terms.set(term, { term, officers: [] })
        terms.get(term)!.officers.push({ role: o.role, name: o.name })
      }
      return [...terms.values()]
    },
    () => [{ term: 'Founding & 2019 Inaugural Officers', officers: fallbackFounding }],
  ),
)

/* ---------------------------------- Theme groups ---------------------------------- */

export type ThemeGroupView = {
  number: number
  title: string
  summary: string
  mandate: string
  leaderName: string
  leaderInstitution?: string
  icon: PillarIcon
}

export const getThemeGroups = cache((): Promise<ThemeGroupView[]> =>
  load(
    'theme groups',
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'theme-groups',
        sort: 'number',
        limit: 20,
        depth: 0,
        overrideAccess: false,
      })
      return docs.map((t) => ({
        number: t.number,
        title: t.title,
        summary: t.summary,
        mandate: t.mandate,
        leaderName: t.leaderName,
        leaderInstitution: t.leaderInstitution || undefined,
        icon: t.icon,
      }))
    },
    () =>
      fallbackThemeGroups.map((t) => {
        const pillar = fallbackPillars.find((p) => p.number === t.number)
        return {
          number: t.number,
          title: t.title,
          summary: pillar?.summary ?? '',
          mandate: t.mandate,
          leaderName: t.leader,
          leaderInstitution: t.institution,
          icon: pillar?.icon ?? 'globe',
        }
      }),
  ),
)

/* ---------------------------------- Partners ---------------------------------- */

export type PartnerView = {
  id: string
  short: string
  name: string
  logo: { url: string; alt: string } | null
}

export const getHomePartners = cache((): Promise<PartnerView[]> =>
  load(
    'partners',
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'partners',
        where: { showOnHome: { equals: true } },
        sort: 'order',
        limit: 100,
        depth: 1,
        overrideAccess: false,
      })
      return docs.map((p) => ({
        id: String(p.id),
        short: p.shortName,
        name: p.name,
        logo: mediaUrl(p.logo),
      }))
    },
    () =>
      fallbackInstitutions.map((i) => ({
        id: i.slug,
        short: i.short,
        name: i.name,
        logo: i.logo ? { url: i.logo, alt: i.name } : null,
      })),
  ),
)

/* ---------------------------------- Events ---------------------------------- */

export type EventView = {
  id: string
  slug: string
  title: string
  type: Event['type']
  typeLabel: string
  startDate: string
  endDate?: string
  location?: string
  registrationUrl?: string
  summary: string
  coverImage: { url: string; alt: string } | null
  gallery: { url: string; alt: string }[]
  description: Event['description']
}

const typeLabels: Record<string, string> = Object.fromEntries(
  eventTypes.map((t) => [t.value, t.label]),
)

function toEventView(e: Event): EventView {
  return {
    id: String(e.id),
    slug: e.slug ?? String(e.id),
    title: e.title,
    type: e.type,
    typeLabel: typeLabels[e.type] ?? e.type,
    startDate: e.startDate,
    endDate: e.endDate || undefined,
    location: e.location || undefined,
    registrationUrl: e.registrationUrl || undefined,
    summary: e.summary,
    coverImage: mediaUrl(e.coverImage),
    gallery: (e.gallery ?? [])
      .map((g) => mediaUrl(g))
      .filter((g): g is { url: string; alt: string } => g !== null),
    description: e.description,
  }
}

/**
 * Published events, split into upcoming (still running or yet to start) and past.
 * No built-in fallback: events only ever come from the CMS.
 */
export const getEvents = cache((): Promise<{ upcoming: EventView[]; past: EventView[] }> =>
  load(
    'events',
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'events',
        where: { _status: { equals: 'published' } },
        sort: 'startDate',
        limit: 200,
        depth: 1,
        overrideAccess: false,
      })
      const now = Date.now()
      const events = docs.map(toEventView)
      const isUpcoming = (e: EventView) => new Date(e.endDate ?? e.startDate).getTime() >= now
      return {
        upcoming: events.filter(isUpcoming),
        past: events.filter((e) => !isUpcoming(e)).reverse(),
      }
    },
    () => ({ upcoming: [], past: [] }),
  ),
)

export const getEventBySlug = cache((slug: string): Promise<EventView | null> =>
  load(
    `event "${slug}"`,
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'events',
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 1,
        overrideAccess: false,
      })
      return docs[0] ? toEventView(docs[0]) : null
    },
    () => null,
  ),
)

export type PartnerDirectoryEntry = PartnerView & { type: string; url?: string }

/** Every partner, for the Linkages page (home page strip uses getHomePartners). */
export const getAllPartners = cache((): Promise<PartnerDirectoryEntry[]> =>
  load<PartnerDirectoryEntry[]>(
    'all partners',
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'partners',
        sort: 'order',
        limit: 200,
        depth: 1,
        overrideAccess: false,
      })
      return docs.map((p) => ({
        id: String(p.id),
        short: p.shortName,
        name: p.name,
        logo: mediaUrl(p.logo),
        type: p.type,
        url: p.url || undefined,
      }))
    },
    () =>
      fallbackInstitutions.map((i) => ({
        id: i.slug,
        short: i.short,
        name: i.name,
        logo: null,
        type: i.slug === 'deped' ? 'government' : i.slug === 'mda' ? 'basic-education' : 'hei',
      })),
  ),
)

/* ---------------------------------- News ---------------------------------- */

export type NewsView = {
  id: string
  slug: string
  title: string
  summary: string
  publishedDate: string
  coverImage: { url: string; alt: string } | null
  content: News['content']
}

function toNewsView(n: News): NewsView {
  return {
    id: String(n.id),
    slug: n.slug ?? String(n.id),
    title: n.title,
    summary: n.summary,
    publishedDate: n.publishedDate,
    coverImage: mediaUrl(n.coverImage),
    content: n.content,
  }
}

/** Published news posts, newest first. No built-in fallback: news only comes from the CMS. */
export const getNews = cache((): Promise<NewsView[]> =>
  load(
    'news',
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'news',
        where: { _status: { equals: 'published' } },
        sort: '-publishedDate',
        limit: 100,
        depth: 1,
        overrideAccess: false,
      })
      return docs.map(toNewsView)
    },
    () => [],
  ),
)

export const getNewsBySlug = cache((slug: string): Promise<NewsView | null> =>
  load(
    `news post "${slug}"`,
    async () => {
      const payload = await getClient()
      const { docs } = await payload.find({
        collection: 'news',
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 1,
        overrideAccess: false,
      })
      return docs[0] ? toNewsView(docs[0]) : null
    },
    () => null,
  ),
)
