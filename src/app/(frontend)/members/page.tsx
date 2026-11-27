import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { CtaBand } from '../components/CtaBand'
import { contactHref, joinHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { textLink } from '../components/ui'
import { directoryMembers, rosterTotals } from '../content/member-directory'
import { MemberDirectory } from './MemberDirectory'

export const metadata: Metadata = {
  title: 'Member Directory',
  description:
    'PAMMRES members across the Philippines: their institutions, positions and research interests.',
}

export default function MembersPage() {
  const institutions = new Set(directoryMembers.map((m) => m.institution)).size

  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        image="members"
        title="Member Directory"
        subtitle="Mixed methods researchers and emergent scholars across Luzon, Visayas and Mindanao."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Member Directory' }]}
      />

      <section aria-label="Members" className="bg-cream">
        <div className="mx-auto max-w-[1080px] px-4 py-16 md:px-6 md:py-20">
          <p className="max-w-[44rem] text-lg/relaxed text-pretty text-ink-muted">
            {rosterTotals.members} members from {institutions} institutions, with{' '}
            {rosterTotals.published} published and {rosterTotals.ongoing} ongoing studies. Find
            colleagues by name, institution or research interest. Listed details are from the
            membership roster as of November 2026; to correct your entry, please{' '}
            <Link href={contactHref} className={textLink}>
              contact the secretariat
            </Link>
            .
          </p>
          <div className="mt-10">
            <MemberDirectory members={directoryMembers} />
          </div>
        </div>
      </section>

      <CtaBand
        id="members-cta"
        title="Be Part of Our Growing Community of Practice"
        body="Join fellow researchers and emergent scholars advancing rigorous, socially transformative mixed methods scholarship across the Philippines."
        primary={{ label: 'Become a Member', href: joinHref }}
        secondary={{ label: 'Explore Upcoming Events', href: '/events' }}
      />
    </main>
  )
}
