import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Accordion } from '../components/Accordion'
import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { joinHref, memberAreaHref, memberLoginHref, membersHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { textLink } from '../components/ui'
import { interestGroupCounts } from '../content/member-directory'
import { memberPublications, type MemberPublication } from '../content/publications'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'PAMMRES resources: Research Interest Groups, members’ published studies and the learning repository.',
}

const interestBlurbs: Record<string, string> = {
  'Educational Research': 'Teaching, learning, curriculum and school leadership studies.',
  'Research Methodology': 'Designs, integration, joint displays and instrument validation.',
  'Science Research': 'Health, nursing, pharmacy and the natural sciences.',
  'Business Research': 'Management, economics, tourism and organizational studies.',
}

/** Published studies grouped by institution, A–Z. */
function publicationsByInstitution() {
  const groups = new Map<string, MemberPublication[]>()
  for (const p of memberPublications) {
    if (!groups.has(p.institution)) groups.set(p.institution, [])
    groups.get(p.institution)!.push(p)
  }
  return [...groups.entries()]
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

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
        image="resources"
        title="Resources"
        subtitle="Learning materials and research networks for mixed methods researchers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />

      <section id="rigs" aria-labelledby="rigs-title" className="bg-cream">
        <div className="mx-auto max-w-[960px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="rigs-title"
            title="Research Interest Groups & Expertise Directory"
            intro="Members choose the research areas they work in, so researchers can find colleagues and form interdisciplinary teams."
          />
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Object.entries(interestGroupCounts).map(([group, count]) => (
              <li key={group} className="flex">
                <Card className="w-full" eyebrow={`${count} members`} title={group}>
                  <p>{interestBlurbs[group]}</p>
                  <Link
                    href={`${membersHref}?interest=${encodeURIComponent(group)}`}
                    className={`${textLink} mt-4 inline-block`}
                  >
                    See members<span className="sr-only"> in {group}</span> →
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base text-ink-muted">
            Search every member by name, institution or topic in the{' '}
            <Link href={membersHref} className={textLink}>
              Member Directory
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="publications" aria-labelledby="publications-title" className="bg-white">
        <div className="mx-auto max-w-[960px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="publications-title"
            title="Member Publications"
            intro={`${memberPublications.length} published studies by PAMMRES members, grouped by institution.`}
          />
          <div className="mt-10">
            <Accordion
              name="publications"
              items={publicationsByInstitution().map(([institution, list]) => ({
                id: `pubs-${slug(institution)}`,
                title: (
                  <>
                    {institution}{' '}
                    <span className="font-sans text-base font-normal text-ink-muted">
                      ({list.length})
                    </span>
                  </>
                ),
                content: (
                  <ul className="space-y-4">
                    {list.map((p) => (
                      <li key={`${p.author}-${p.title}`}>
                        <p className="font-semibold text-ink">{p.title}</p>
                        <p className="text-sm">
                          {[p.author, p.venue, p.year].filter(Boolean).join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section id="repository" aria-labelledby="repository-title" className="bg-cream">
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
