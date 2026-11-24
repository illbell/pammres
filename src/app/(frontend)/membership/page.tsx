import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { GlobeIcon, ImpactIcon, NetworkIcon, CheckIcon } from '../components/icons'
import { contactHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { SectionHeading } from '../components/SectionHeading'
import { textLink } from '../components/ui'
import { MembershipForm } from './MembershipForm'

export const metadata: Metadata = {
  title: 'Membership & Chapters',
  description:
    'Why join PAMMRES, membership categories, how to apply, and regional and school chapters across Luzon, Visayas, and Mindanao.',
}

// Benefits named in the website guide, described with the guide's own copy.
const benefits = [
  {
    title: 'Peer Mentorship',
    body: 'Get paired with experienced mixed methods practitioners aligned with your field.',
    icon: <CheckIcon />,
  },
  {
    title: 'MMIRA International Network',
    body: 'Connect with international methodologists through MMIRA conferences and joint publications.',
    icon: <GlobeIcon />,
  },
  {
    title: 'Interdisciplinary Collaboration',
    body: 'Form interdisciplinary research teams through our national expertise directory.',
    icon: <NetworkIcon />,
  },
  {
    title: 'Policy Impact',
    body: 'Translate research findings into actionable programs that empower marginalized sectors and inform local government policies.',
    icon: <ImpactIcon />,
  },
]

// Categories from the guide. TODO: fees and eligibility from PAMMRES.
const categories = [
  { group: 'Individual', title: 'Full Member', accent: 'navy' as const },
  { group: 'Individual', title: 'Associate / Emergent Scholar', accent: 'navy' as const },
  { group: 'Individual', title: 'Student', accent: 'navy' as const },
  { group: 'Institutional', title: 'Institutional Member', accent: 'crimson' as const },
]

const steps = [
  {
    title: 'Choose your category',
    body: 'Pick the membership category that fits you or your institution.',
  },
  {
    title: 'Pay the membership fee',
    body: (
      <>
        Pay by bank transfer or GCash. <Placeholder>account name and number</Placeholder>
      </>
    ),
  },
  {
    title: 'Submit the application form',
    body: 'Include the reference number from your payment receipt.',
  },
  {
    title: 'Wait for verification',
    body: 'The secretariat verifies your payment and confirms your membership by email.',
  },
]

const regions = ['Luzon', 'Visayas', 'Mindanao']

// Functional copy (steps, closing band) is ours, not from the guide: have PAMMRES review it.
export default function MembershipPage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        title="Membership & Chapters"
        subtitle="Membership categories, benefits, and how to join PAMMRES or start a regional or school chapter."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Membership' }]}
      />

      {/* Why join */}
      <section id="why-join" aria-labelledby="why-title" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="why-title"
            title="Why Join PAMMRES"
            intro="Whether you are leading institutional research or designing your first mixed methods thesis, PAMMRES provides the network and guidance you need."
            align="center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <li key={b.title} className="flex">
                <Card className="w-full" title={b.title} icon={b.icon}>
                  <p>{b.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" aria-labelledby="categories-title" className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="categories-title"
            title="Membership Categories & Fees"
            intro="Open to researchers, educators, and students across regions, disciplines, and sectors."
            align="center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.title} className="flex">
                <Card className="w-full" eyebrow={c.group} title={c.title} accent={c.accent}>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-semibold text-navy">Annual fee</dt>
                      <dd>
                        <Placeholder>fee</Placeholder>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-navy">Who it’s for</dt>
                      <dd>
                        <Placeholder>eligibility</Placeholder>
                      </dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" aria-labelledby="apply-title" className="bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <SectionHeading id="apply-title" title="Online Application" />
            <ol className="mt-8 space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-navy font-display text-lg font-semibold text-gold-soft"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-navy">{step.title}</h3>
                    <p className="mt-1 text-base/relaxed text-ink-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-rule border-t-4 border-t-crimson bg-white p-6 shadow-sm md:p-10">
            <MembershipForm />
          </div>
        </div>
      </section>

      {/* Member login */}
      <section
        id="member-login"
        aria-labelledby="login-title"
        className="border-t border-rule bg-white"
      >
        <div className="mx-auto max-w-[960px] px-4 py-16 text-center md:px-6 md:py-20">
          <SectionHeading
            id="login-title"
            title="Member Login"
            align="center"
            intro="Access to the member directory and member resources."
          />
          {/* TODO: decide the member portal scope (Payload auth for members, or an external link). */}
          <p className="mt-6 text-base text-ink-muted">
            <Placeholder>Member portal coming soon</Placeholder> Members needing assistance can{' '}
            <Link href={contactHref} className={textLink}>
              contact the secretariat
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section id="chapters" aria-labelledby="chapters-title" className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="chapters-title"
            title="Regional & School Chapters"
            intro="Provincial, regional, and school-based chapters across Luzon, Visayas, and Mindanao."
            align="center"
          />
          <ul className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-3">
            {regions.map((region) => (
              <li key={region} className="flex">
                <Card className="w-full" title={region} hover={false}>
                  <p>
                    <Placeholder>{region} chapter directory</Placeholder>
                  </p>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-base text-ink-muted">
            Chapter formation guidelines are in the{' '}
            <Link href="/about#governance" className={textLink}>
              governance archive
            </Link>
            . To start a chapter,{' '}
            <Link href={contactHref} className={textLink}>
              contact the secretariat
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand
        id="membership-cta"
        title="Questions about membership?"
        body="The PAMMRES secretariat is happy to help you choose a category or start a chapter."
        primary={{ label: 'Contact the Secretariat', href: contactHref }}
        secondary={{ label: 'Explore Upcoming Events', href: '/events' }}
      />
    </main>
  )
}
