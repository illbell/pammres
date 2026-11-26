import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { CtaBand } from '../components/CtaBand'
import { EventCard } from '../components/events/EventCard'
import { joinHref, partnerHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { focusRing } from '../components/ui'
import { getEvents } from '../data/cms'

export const metadata: Metadata = {
  title: 'Events, Training & Conferences',
  description:
    'Upcoming PAMMRES webinars, workshops and conferences, including The Filipino Mixed Methods Fair, and past seminar-workshops since 2018.',
}

// Events move from "upcoming" to "past" as time passes, so re-check hourly
// (edits in the admin refresh the page immediately).
export const revalidate = 3600

// Training history named in the website guide, shown until past events (with photos) are added in the CMS.
const trainingHistory = [
  'UP Diliman',
  'UP Manila',
  'Bulacan State University',
  'Holy Angel University',
  'Mater Dei Academy',
  'DepEd Bulacan',
  'Tagaytay strategic planning',
]

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-navy/25 bg-white px-6 py-10 text-center text-base text-ink-muted">
      {children}
    </p>
  )
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents()
  const isGathering = (type: string) => type === 'conference' || type === 'colloquium'
  // Past gatherings are listed under Past Trainings, so only upcoming ones show here.
  const gatherings = upcoming.filter((e) => isGathering(e.type))
  const pastWithPhotos = past.filter((e) => e.gallery.length > 0 || e.coverImage)

  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        title="Events, Training & Conferences"
        subtitle="Upcoming PAMMRES webinars, workshops and conferences, and past trainings since 2018."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events & Training' }]}
      />

      <section id="upcoming" aria-labelledby="upcoming-title" className="bg-white">
        <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="upcoming-title"
            title="Upcoming Webinars & Workshops"
            intro="Free mini-webinars, fellowship sessions, and annual methodology trainings."
          />
          <div className="mt-10">
            {upcoming.length > 0 ? (
              <ul className="space-y-6">
                {upcoming.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>No upcoming events are scheduled right now. Check back soon.</EmptyState>
            )}
          </div>
        </div>
      </section>

      <section id="conferences" aria-labelledby="conferences-title" className="bg-cream">
        <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="conferences-title"
            title="Conferences & Colloquia"
            intro="Flagship gatherings like The Filipino Mixed Methods Fair, including the UST event featuring Dr. John W. Creswell, and inter-academic colloquia."
          />
          {gatherings.length > 0 && (
            <ul className="mt-10 space-y-6">
              {gatherings.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="past" aria-labelledby="past-title" className="bg-white">
        <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="past-title"
            title="Past Trainings & Gallery (2018–Present)"
            intro="Seminar-workshops and gatherings with partner universities, schools, and agencies."
          />

          {pastWithPhotos.length > 0 && (
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastWithPhotos.map((event) => {
                const photo = event.coverImage ?? event.gallery[0]
                return (
                  <li key={event.id}>
                    <Link
                      href={`/events/${event.slug}`}
                      className={`group block rounded-xl no-underline ${focusRing}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-b-4 border-gold">
                        {photo && (
                          <Image
                            src={photo.url}
                            alt={photo.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                        )}
                      </div>
                      <p className="mt-3 font-semibold text-navy group-hover:underline">
                        {event.title}
                      </p>
                      <p className="text-sm text-ink-muted">
                        {new Date(event.startDate).getFullYear()}
                        {event.gallery.length > 0 && ` · ${event.gallery.length} photos`}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {past.length > pastWithPhotos.length && (
            <ul className="mt-10 space-y-6">
              {past
                .filter((e) => !pastWithPhotos.includes(e))
                .map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} past />
                  </li>
                ))}
            </ul>
          )}

          {past.length === 0 && (
            <div className="mt-10">
              <h3 className="font-display text-xl font-semibold text-navy">
                Where we’ve held seminar-workshops
              </h3>
              <ul className="mt-5 flex flex-wrap gap-3">
                {trainingHistory.map((place) => (
                  <li
                    key={place}
                    className="rounded-full border border-rule bg-cream px-4 py-2 text-base text-navy"
                  >
                    {place}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        id="events-cta"
        title="Ready to advance your mixed methods research journey?"
        primary={{ label: 'Join PAMMRES Today', href: joinHref }}
        secondary={{ label: 'Partner With Us for a Workshop', href: partnerHref }}
      />
    </main>
  )
}
