import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { formatEventDates } from '../../components/events/dates'
import { ArrowRightIcon } from '../../components/icons'
import { PageHeader } from '../../components/PageHeader'
import { button, textLink } from '../../components/ui'
import { getEventBySlug } from '../../data/cms'

type Props = { params: Promise<{ slug: string }> }

// Built on first visit, then cached (an empty generateStaticParams enables that);
// edits in the admin refresh it.
export const revalidate = 3600
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug((await params).slug)
  if (!event) return { title: 'Event not found' }
  return { title: event.title, description: event.summary }
}

export default async function EventPage({ params }: Props) {
  const event = await getEventBySlug((await params).slug)
  if (!event) notFound()

  const upcoming = new Date(event.endDate ?? event.startDate).getTime() >= Date.now()

  return (
    <main id="main">
      <PageHeader
        image="events"
        eyebrow={event.typeLabel}
        title={event.title}
        subtitle={event.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Events & Training', href: '/events' },
          { label: event.title },
        ]}
      />

      <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="min-w-0">
          {event.coverImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src={event.coverImage.url}
                alt={event.coverImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 680px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {event.description ? (
            <RichText
              data={event.description}
              className="space-y-4 text-lg/relaxed text-ink-muted [&_a]:font-semibold [&_a]:text-navy [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-navy [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-navy [&_li]:ml-6 [&_ol]:list-decimal [&_strong]:text-navy [&_ul]:list-disc"
            />
          ) : (
            <p className="text-lg/relaxed text-ink-muted">{event.summary}</p>
          )}

          {event.gallery.length > 0 && (
            <section aria-labelledby="gallery-title" className="mt-14">
              <h2 id="gallery-title" className="font-display text-2xl font-semibold text-navy">
                Photos
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {event.gallery.map((photo) => (
                  <li key={photo.url} className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 640px) 220px, 50vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside
          aria-label="Event details"
          className="self-start rounded-xl border border-rule border-t-4 border-t-crimson bg-white p-6 shadow-sm lg:sticky lg:top-40"
        >
          <dl className="space-y-4 text-base">
            <div>
              <dt className="text-sm font-semibold tracking-[0.08em] text-crimson uppercase">
                When
              </dt>
              <dd className="mt-1 text-navy">
                <time dateTime={event.startDate}>
                  {formatEventDates(event.startDate, event.endDate)}
                </time>
              </dd>
            </div>
            {event.location && (
              <div>
                <dt className="text-sm font-semibold tracking-[0.08em] text-crimson uppercase">
                  Where
                </dt>
                <dd className="mt-1 text-navy">{event.location}</dd>
              </div>
            )}
          </dl>
          {upcoming && event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button('primary', 'md')} mt-6 w-full`}
            >
              Register Now<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {!upcoming && <p className="mt-6 text-sm text-ink-muted">This event has ended.</p>}
          <Link href="/events" className={`${textLink} mt-6 inline-flex items-center gap-1.5`}>
            All events
            <ArrowRightIcon className="size-4" />
          </Link>
        </aside>
      </div>
    </main>
  )
}
