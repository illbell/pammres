import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { CheckIcon } from '../components/icons'
import { contactHref, joinHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { SectionHeading } from '../components/SectionHeading'
import { textLink } from '../components/ui'

export const metadata: Metadata = {
  title: 'Mentorship & Resources',
  description:
    'The PAMMRES Research Mentorship Program, Research Interest Groups and expertise directory, and the learning repository.',
}

// "For Emergent Scholars & Students" items, verbatim from the website guide.
const forEmergent = [
  {
    title: '1-on-1 Peer Mentorship',
    body: 'Get paired with experienced mixed methods practitioners aligned with your field.',
  },
  {
    title: 'Free Mini-Webinars & Fellowships',
    body: 'Build practical skills in joint displays, integration, and data analysis.',
  },
  {
    title: 'Present & Publish',
    body: 'Share work-in-progress at inter-university colloquia in a supportive environment.',
  },
]

const repository = [
  'Archived webinar recordings',
  'Slide decks',
  'Joint display guides',
  'Open-access methodological toolkits',
]

export default function MentorshipPage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        title="Mentorship & Resources"
        subtitle="Connecting seasoned practitioners with emergent scholars through tiered mentorship programs, regional chapters, and training workshops."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Mentorship' }]}
      />

      <section id="program" aria-labelledby="program-title" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="program-title"
            title="Research Mentorship Program"
            intro="Pairing emergent scholars and graduate students with experienced mixed methods research practitioners."
            align="center"
          />
          <ul className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-3">
            {forEmergent.map((item) => (
              <li key={item.title} className="flex">
                <Card className="w-full" title={item.title} icon={<CheckIcon />}>
                  <p>{item.body}</p>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-base text-ink-muted">
            <Placeholder>How mentor matching works and how to sign up</Placeholder> Interested in
            mentoring or being mentored?{' '}
            <Link href={contactHref} className={textLink}>
              Contact the secretariat
            </Link>
            .
          </p>
        </div>
      </section>

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
                <Placeholder>coming soon</Placeholder>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        id="mentorship-cta"
        title="Grow With a Supportive Community of Practice"
        body="Whether you are leading institutional research or designing your first mixed methods thesis, PAMMRES provides the network and guidance you need."
        primary={{ label: 'Become a Member', href: joinHref }}
        secondary={{ label: 'Explore Upcoming Events', href: '/events' }}
      />
    </main>
  )
}
