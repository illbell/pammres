import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { EventView } from '../../data/cms'
import { ArrowRightIcon } from '../icons'
import { button, focusRing } from '../ui'
import { dateBadge, formatEventDates } from './dates'

/** Event listing card: calendar badge, type, title, when/where, summary, actions. */
export function EventCard({ event, past = false }: { event: EventView; past?: boolean }) {
  const badge = dateBadge(event.startDate)
  const href = `/events/${event.slug}`

  return (
    <article
      className={`group relative flex flex-col gap-5 rounded-xl border border-rule border-t-4 bg-white p-6 shadow-sm sm:flex-row md:p-7 ${
        past ? 'border-t-navy/40' : 'border-t-crimson'
      }`}
    >
      <div
        aria-hidden="true"
        className={`flex size-20 shrink-0 flex-col items-center justify-center rounded-xl text-center ${
          past ? 'bg-cream text-navy' : 'bg-navy text-white'
        }`}
      >
        <span
          className={`text-xs font-semibold tracking-[0.12em] uppercase ${past ? 'text-crimson' : 'text-gold-soft'}`}
        >
          {badge.month}
        </span>
        <span className="font-display text-3xl leading-none font-semibold">{badge.day}</span>
        <span className="mt-0.5 text-xs opacity-70">{badge.year}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold tracking-[0.12em] text-crimson uppercase">
          {event.typeLabel}
        </p>
        <h3 className="mt-1 font-display text-2xl leading-snug font-semibold text-balance text-navy">
          <Link
            href={href}
            className={`rounded-sm no-underline hover:underline hover:decoration-crimson hover:decoration-2 hover:underline-offset-4 ${focusRing}`}
          >
            {event.title}
          </Link>
        </h3>
        <dl className="mt-2 space-y-0.5 text-base text-ink-muted">
          <div>
            <dt className="sr-only">When</dt>
            <dd>
              <time dateTime={event.startDate}>
                {formatEventDates(event.startDate, event.endDate)}
              </time>
            </dd>
          </div>
          {event.location && (
            <div>
              <dt className="sr-only">Where</dt>
              <dd>{event.location}</dd>
            </div>
          )}
        </dl>
        <p className="mt-3 text-base/relaxed text-ink-muted">{event.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {!past && event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={button('primary', 'md')}
            >
              Register Now<span className="sr-only"> for {event.title} (opens in a new tab)</span>
            </a>
          )}
          <Link
            href={href}
            className={`inline-flex items-center gap-1.5 rounded-sm font-semibold text-navy no-underline hover:underline ${focusRing}`}
          >
            Details<span className="sr-only"> about {event.title}</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>

      {event.coverImage && (
        <div className="relative hidden aspect-[4/3] w-48 shrink-0 overflow-hidden rounded-lg lg:block">
          <Image
            src={event.coverImage.url}
            alt={event.coverImage.alt}
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
      )}
    </article>
  )
}
