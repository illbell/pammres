import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { publicationTypes } from '@/collections/Publications'
import type { Publication } from '@/payload-types'

const typeLabels: Record<Publication['type'], string> = Object.fromEntries(
  publicationTypes.map((t) => [t.value, t.label]),
) as Record<Publication['type'], string>

const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink'

async function getRecentPublications(limit: number) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'publications',
      where: { _status: { equals: 'published' } },
      sort: ['-year', '-createdAt'],
      limit,
      depth: 0,
      // Read as the public would: only published entries.
      overrideAccess: false,
      select: { title: true, authors: true, year: true, type: true, venue: true, url: true },
    })
    return docs
  } catch (error) {
    // Don't take the whole home page down if the database is unreachable.
    console.error('Failed to load publications for the home page', error)
    return []
  }
}

export async function PublicationsSection() {
  const publications = await getRecentPublications(4)

  return (
    <section
      aria-labelledby="publications-title"
      id="publications"
      className="grid scroll-mt-20 grid-cols-1 gap-10 px-3 py-20 md:px-8 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2
          id="publications-title"
          className="font-display text-4xl leading-none font-bold tracking-[-0.03em] md:text-5xl"
        >
          Publications
        </h2>
        <p className="mt-5 max-w-[28rem] text-lg/relaxed text-pretty text-ink-muted">
          Recent research by <span translate="no">PAMMRES</span> members across qualitative,
          quantitative and mixed methods.
        </p>
      </div>

      {publications.length > 0 ? (
        <ol className="divide-y divide-rule border-y border-rule">
          {publications.map((pub) => (
            <li
              key={pub.id}
              className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 py-7 md:grid-cols-[5rem_minmax(0,1fr)] md:gap-x-8"
            >
              <span className="pt-0.5 font-display text-xl font-semibold text-ink-muted tabular-nums md:text-2xl">
                {pub.year}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-xl leading-snug font-semibold tracking-[-0.01em] break-words md:text-2xl">
                  {pub.url ? (
                    <a
                      href={pub.url}
                      className={`rounded-sm underline decoration-ink/25 decoration-2 underline-offset-4 transition-colors duration-150 hover:decoration-integrate motion-reduce:transition-none ${focusRing}`}
                    >
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </h3>
                <p className="mt-2 text-base break-words">{pub.authors}</p>
                <p className="mt-1 text-base text-ink-muted">
                  {typeLabels[pub.type]}
                  {pub.venue && (
                    <>
                      , <i>{pub.venue}</i>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink/20 px-6 py-10 text-ink-muted md:px-10">
          New publications from members will be listed here.
        </div>
      )}
    </section>
  )
}
