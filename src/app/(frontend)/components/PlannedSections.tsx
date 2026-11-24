import Link from 'next/link'
import React from 'react'

import { contactHref } from './navigation'
import { Placeholder } from './Placeholder'
import { textLink } from './ui'

export type PlannedSection = { id: string; title: string; summary: string }

/**
 * Temporary body for pages the website guide only outlines. Lists the planned
 * sections (with anchor ids, so header/footer links already resolve) until real
 * copy arrives from PAMMRES. Remove once the page is built.
 */
export function PlannedSections({ sections }: { sections: PlannedSection[] }) {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-16 md:px-6 md:py-20">
      <p className="text-lg/relaxed text-ink-muted">
        <Placeholder>Page content coming soon</Placeholder> This page is being prepared. In the
        meantime, you can{' '}
        <Link href={contactHref} className={textLink}>
          contact the PAMMRES secretariat
        </Link>
        .
      </p>
      <ol className="mt-10 divide-y divide-rule border-y border-rule">
        {sections.map((section) => (
          <li key={section.id} id={section.id} className="py-7">
            <h2 className="font-display text-2xl font-semibold text-navy">{section.title}</h2>
            <p className="mt-2 text-base/relaxed text-ink-muted">{section.summary}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
