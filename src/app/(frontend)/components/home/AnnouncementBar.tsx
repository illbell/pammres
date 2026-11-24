import Link from 'next/link'
import React from 'react'

import { getSiteSettings } from '../../data/cms'
import { ArrowRightIcon, MegaphoneIcon } from '../icons'
import { textLink } from '../ui'

/**
 * White announcement / next-event bar directly under the hero (guide Section 1).
 * Edited in the admin under Site Settings → Announcement; hidden when there's nothing to announce.
 */
export async function AnnouncementBar() {
  const { announcement } = await getSiteSettings()
  if (!announcement) return null

  const external = announcement.link && /^https?:\/\//.test(announcement.link.href)

  return (
    <aside aria-label="Announcement" className="border-b border-rule bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:gap-6 md:px-6">
        <p className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-[0.12em] text-crimson uppercase">
          <MegaphoneIcon className="size-5" />
          {announcement.label}
        </p>
        <p className="min-w-0 flex-1 text-base/relaxed text-ink">
          <strong className="font-semibold text-navy">{announcement.title}</strong>
          {announcement.body && <span className="text-ink-muted"> — {announcement.body}</span>}
        </p>
        {announcement.link && (
          <Link
            href={announcement.link.href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`${textLink} inline-flex shrink-0 items-center gap-1.5 self-start md:self-auto`}
          >
            {announcement.link.label}
            <ArrowRightIcon className="size-4" />
            {external && <span className="sr-only">(opens in a new tab)</span>}
          </Link>
        )}
      </div>
    </aside>
  )
}
