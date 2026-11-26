import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { membershipFees } from '@/collections/membership'

import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { GlobeIcon, ImpactIcon, NetworkIcon, CheckIcon } from '../components/icons'
import { contactHref, joinHref, memberLoginHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { SectionHeading } from '../components/SectionHeading'
import { button, textLink } from '../components/ui'

export const metadata: Metadata = {
  title: 'Membership',
  description: 'Why join PAMMRES, membership categories and fees, and how to apply.',
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

// Categories and fees from the client (2026-11-26). TODO: eligibility from PAMMRES.
const categories = [
  { group: 'Individual', title: 'Regular Member', fee: membershipFees.regular, accent: 'navy' as const },
  { group: 'Individual', title: 'Student', fee: membershipFees.student, accent: 'navy' as const },
  {
    group: 'Institutional',
    title: 'Institutional Member',
    fee: membershipFees.institutional,
    accent: 'crimson' as const,
  },
]

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

const steps = [
  {
    title: 'Create your account',
    body: 'Sign up with your name, email and a password.',
  },
  {
    title: 'Complete your membership profile',
    body: 'Personal information, your most recent published and unpublished research, and your research interests. Your progress is saved, so you can finish later.',
  },
  {
    title: 'Pay the membership fee',
    body: (
      <>
        Pay by bank transfer or GCash, then enter the reference number and upload your receipt.{' '}
        <Placeholder>account name and number</Placeholder>
      </>
    ),
  },
  {
    title: 'Wait for approval',
    body: 'The secretariat verifies your profile and payment. Membership runs for one year from approval, and you can renew online from your account.',
  },
]

// Functional copy (steps, closing band) is ours, not from the guide: have PAMMRES review it.
export default function MembershipPage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        title="Membership"
        subtitle="Membership categories, benefits, and how to join PAMMRES."
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
          <ul className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((c) => (
              <li key={c.title} className="flex">
                <Card className="w-full" eyebrow={c.group} title={c.title} accent={c.accent}>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-semibold text-navy">Annual fee</dt>
                      <dd className="font-display text-3xl font-semibold text-crimson">
                        {peso.format(c.fee)}
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
            <SectionHeading id="apply-title" title="How to Join" />
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
          <div className="space-y-6 self-start">
            <div className="rounded-2xl border border-rule border-t-4 border-t-crimson bg-white p-6 shadow-sm md:p-10">
              <h3 className="font-display text-2xl font-semibold text-navy">New to PAMMRES?</h3>
              <p className="mt-3 text-base/relaxed text-ink-muted">
                Create your member account to start your application. It takes a minute, and you
                can complete your profile at your own pace.
              </p>
              <Link href={joinHref} className={`${button('primary')} mt-6`}>
                Create your account
              </Link>
            </div>
            <div
              id="member-login"
              className="rounded-2xl border border-rule border-t-4 border-t-navy bg-cream p-6 md:p-10"
            >
              <h3 className="font-display text-2xl font-semibold text-navy">Already have an account?</h3>
              <p className="mt-3 text-base/relaxed text-ink-muted">
                Log in to continue your profile, check your membership status and open member
                resources.
              </p>
              <Link href={memberLoginHref} className={`${button('outline')} mt-6`}>
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        id="membership-cta"
        title="Questions about membership?"
        body="The PAMMRES secretariat is happy to help you choose a category."
        primary={{ label: 'Contact the Secretariat', href: contactHref }}
        secondary={{ label: 'Explore Upcoming Events', href: '/events' }}
      />
    </main>
  )
}
