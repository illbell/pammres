import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { CtaBand } from '../components/CtaBand'
import { joinHref, memberAreaHref, memberLoginHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { SectionHeading } from '../components/SectionHeading'
import { textLink } from '../components/ui'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'PAMMRES resources: the learning repository and the Research Interest Groups and expertise directory.',
}

const repository = [
  'Archived webinar recordings',
  'Slide decks',
  'Joint display guides',
  'Open-access methodological toolkits',
]

export default function ResourcesPage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        title="Resources"
        subtitle="Learning materials and research networks for mixed methods researchers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />

      <section id="rigs" aria-labelledby="rigs-title" className="bg-cream">
        <div className="mx-auto max-w-[960px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="rigs-title"
            title="Research Interest Groups & Expertise Directory"
            intro="A searchable directory of members’ disciplines to help researchers form interdisciplinary teams."
          />
          {/* TODO: build from member data once the member portal exists (see /membership#member-login). */}
          <p className="mt-6 text-base text-ink-muted">
            <Placeholder>Expertise directory (members only)</Placeholder>
          </p>
        </div>
      </section>

      <section id="repository" aria-labelledby="repository-title" className="bg-white">
        <div className="mx-auto max-w-[960px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading id="repository-title" title="Learning Repository" />
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {repository.map((item) => (
              <li
                key={item}
                className="flex items-center justify-between gap-4 rounded-xl border border-rule bg-white px-5 py-4"
              >
                <span className="font-semibold text-navy">{item}</span>
                <Link
                  href={`${memberLoginHref}?next=${encodeURIComponent(memberAreaHref)}`}
                  className={`${textLink} shrink-0 text-sm`}
                >
                  Members only<span className="sr-only">: log in to access {item}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        id="resources-cta"
        title="Grow With a Supportive Community of Practice"
        body="Whether you are leading institutional research or designing your first mixed methods thesis, PAMMRES provides the network and guidance you need."
        primary={{ label: 'Become a Member', href: joinHref }}
        secondary={{ label: 'Explore Upcoming Events', href: '/events' }}
      />
    </main>
  )
}
