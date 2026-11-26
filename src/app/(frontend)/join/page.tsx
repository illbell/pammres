import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

import { membershipCategories, membershipFees } from '@/collections/membership'

import { PageHeader } from '../components/PageHeader'
import { getCurrentMember } from '../data/member'
import { SignUpForm } from '../member/forms'
import { profileSteps } from '../member/steps'

export const metadata: Metadata = {
  title: 'Join PAMMRES',
  description: 'Create your PAMMRES account, complete your membership profile and pay the membership fee.',
}

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })

export default async function JoinPage() {
  if (await getCurrentMember()) redirect('/member')

  return (
    <main id="main">
      <PageHeader
        image="membership"
        eyebrow="Membership"
        title="Join PAMMRES"
        subtitle="Create your account, then complete your membership profile at your own pace."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Membership', href: '/membership' },
          { label: 'Join' },
        ]}
      />

      <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section aria-labelledby="signup-title">
          <h2 id="signup-title" className="font-display text-3xl font-semibold text-navy">
            Create your account
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Your account lets you save your profile, see your membership status and access member
            resources.
          </p>
          <div className="mt-8">
            <SignUpForm />
          </div>
        </section>

        <aside
          aria-labelledby="how-title"
          className="self-start rounded-xl border border-rule border-t-4 border-t-navy bg-cream p-6 md:p-8"
        >
          <h2 id="how-title" className="font-display text-2xl font-semibold text-navy">
            How membership works
          </h2>
          <ol className="mt-5 space-y-4">
            <li className="flex gap-3">
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-gold font-semibold text-navy-deep">
                1
              </span>
              <span className="text-base text-ink">
                <strong className="text-navy">Create your account</strong> with your name, email
                and a password.
              </span>
            </li>
            {profileSteps.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-gold/25 font-semibold text-navy">
                  {i + 2}
                </span>
                <span className="text-base text-ink">
                  <strong className="text-navy">{s.title}</strong>: {s.summary}
                </span>
              </li>
            ))}
            <li className="flex gap-3">
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-navy font-semibold text-white">
                ✓
              </span>
              <span className="text-base text-ink">
                <strong className="text-navy">The secretariat reviews</strong> your profile and
                payment, then approves your membership.
              </span>
            </li>
          </ol>
          <h3 className="mt-8 text-sm font-semibold tracking-[0.12em] text-crimson uppercase">
            Annual membership fees
          </h3>
          <dl className="mt-3 divide-y divide-rule">
            {membershipCategories.map((c) => (
              <div key={c.value} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-base text-ink">{c.label}</dt>
                <dd className="font-display text-xl font-semibold text-navy">
                  {peso.format(membershipFees[c.value])}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </main>
  )
}
