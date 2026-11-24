import Link from 'next/link'
import React from 'react'

import { ArrowRightIcon, MegaphoneIcon } from '../icons'
import { textLink } from '../ui'

// Copy from the website guide. TODO: make editable (SiteSettings global or featured Event) in phase 5.
const announcement = {
  label: 'Upcoming event',
  title: 'PAMMRES Free Mini-Webinar Series & Research Colloquium',
  body: 'Open to seasoned researchers, faculty, and graduate students nationwide.',
  link: { label: 'Register Now', href: '/events#upcoming' },
}

/** White announcement / next-event bar directly under the hero (guide Section 1). */
export function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="border-b border-rule bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:gap-6 md:px-6">
        <p className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-[0.12em] text-crimson uppercase">
          <MegaphoneIcon className="size-5" />
          {announcement.label}
        </p>
        <p className="min-w-0 flex-1 text-base/relaxed text-ink">
          <strong className="font-semibold text-navy">{announcement.title}</strong>
          <span className="text-ink-muted"> — {announcement.body}</span>
        </p>
        <Link
          href={announcement.link.href}
          className={`${textLink} inline-flex shrink-0 items-center gap-1.5 self-start md:self-auto`}
        >
          {announcement.link.label}
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </aside>
  )
}
