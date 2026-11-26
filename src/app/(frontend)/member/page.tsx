import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { MEMBER_STEPS, researchDesigns, researchInterestOptions } from '@/collections/Members'
import { membershipCategories, membershipFees } from '@/collections/MembershipApplications'
import type { Member } from '@/payload-types'

import { CheckIcon } from '../components/icons'
import { contactHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { button, textLink } from '../components/ui'
import { requireMember } from '../data/member'
import { logOut } from './actions'
import { profileSteps } from './steps'

export const metadata: Metadata = { title: 'My account', robots: { index: false } }

type Props = { searchParams: Promise<{ submitted?: string }> }

const labelOf = (opts: readonly { label: string; value: string }[], v?: string | null) =>
  opts.find((o) => o.value === v)?.label ?? null

const dateFmt = new Intl.DateTimeFormat('en-PH', { dateStyle: 'long', timeZone: 'Asia/Manila' })

function StatusBanner({ member, justSubmitted }: { member: Member; justSubmitted: boolean }) {
  const done = member.completedSteps ?? 0
  const nextStep = Math.min(done + 1, MEMBER_STEPS)

  const banners: Record<Member['status'], { tone: string; title: string; body: React.ReactNode }> = {
    incomplete: {
      tone: 'border-gold bg-cream',
      title: 'Finish your membership profile',
      body: (
        <>
          <p>
            {done === 0
              ? 'Your account is ready. Complete the four steps below to apply for membership.'
              : `You’ve completed ${done} of ${MEMBER_STEPS} steps. Your progress is saved.`}
          </p>
          <Link href={`/member/apply/${nextStep}`} className={`${button('primary', 'md')} mt-4`}>
            {done === 0 ? 'Start step 1' : `Continue: step ${nextStep}`}
          </Link>
        </>
      ),
    },
    pending: {
      tone: 'border-navy/30 bg-navy/5',
      title: justSubmitted ? 'Thank you! Your application was submitted' : 'Your application is being reviewed',
      body: 'The secretariat is verifying your profile and payment. This page will show your membership once it’s approved.',
    },
    'payment-verified': {
      tone: 'border-navy/30 bg-navy/5',
      title: 'Payment verified',
      body: 'Your payment has been confirmed. The secretariat will approve your membership shortly.',
    },
    approved: {
      tone: 'border-gold bg-gold-soft/30',
      title: 'You’re a PAMMRES member',
      body: member.memberSince ? `Member since ${dateFmt.format(new Date(member.memberSince))}.` : 'Welcome to PAMMRES.',
    },
    declined: {
      tone: 'border-error/40 bg-error/5',
      title: 'Your application wasn’t approved',
      body: (
        <>
          Please{' '}
          <Link href={contactHref} className={textLink}>
            contact the secretariat
          </Link>{' '}
          to find out more.
        </>
      ),
    },
  }

  const b = banners[member.status]
  return (
    <section
      role="status"
      aria-labelledby="status-title"
      className={`rounded-xl border-l-4 border ${b.tone} px-6 py-5 md:px-8 md:py-6`}
    >
      <p className="text-sm font-semibold tracking-[0.12em] text-crimson uppercase">Membership status</p>
      <h2 id="status-title" className="mt-1 font-display text-2xl font-semibold text-navy">
        {b.title}
      </h2>
      <div className="mt-2 text-base/relaxed text-ink-muted">{b.body}</div>
    </section>
  )
}

function Summary({ member }: { member: Member }) {
  const research = (g: Member['publishedResearch']) =>
    g?.title
      ? [g.title, g.year, g.publisher, labelOf(researchDesigns, g.design)].filter(Boolean).join(' · ')
      : null
  const rows: [string, React.ReactNode][] = [
    ['Name', member.fullName],
    ['Email', member.email],
    ['Home address', member.homeAddress],
    ['Institution', member.institution],
    ['Highest education', member.highestEducation],
    ['Published research', research(member.publishedResearch)],
    ['Unpublished research', research(member.unpublishedResearch)],
    [
      'Research interests',
      (member.researchInterests ?? []).map((v) => labelOf(researchInterestOptions, v)).join(', ') || null,
    ],
    ['Years doing research', member.yearsResearching?.toString()],
    [
      'Category',
      member.category
        ? `${labelOf(membershipCategories, member.category)} (₱${membershipFees[member.category].toLocaleString('en-PH')})`
        : null,
    ],
    ['Payment reference', member.paymentReference],
  ]
  return (
    <dl className="divide-y divide-rule rounded-xl border border-rule bg-white">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 px-5 py-3 sm:grid-cols-[12rem_1fr]">
          <dt className="text-sm font-semibold text-navy">{label}</dt>
          <dd className="text-base text-ink-muted [overflow-wrap:anywhere]">{value || '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

export default async function MemberPage({ searchParams }: Props) {
  const member = await requireMember('/member')
  const justSubmitted = (await searchParams).submitted === '1'
  const done = member.completedSteps ?? 0
  const photoUrl = typeof member.photo === 'object' ? member.photo?.url : null

  return (
    <main id="main">
      <PageHeader
        eyebrow="Member area"
        title={`Welcome, ${member.firstName}`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'My account' }]}
      />

      <div className="mx-auto max-w-[1080px] space-y-14 px-4 py-12 md:px-6 md:py-16">
        <StatusBanner member={member} justSubmitted={justSubmitted} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Steps checklist */}
          <section aria-labelledby="steps-title">
            <h2 id="steps-title" className="font-display text-2xl font-semibold text-navy">
              Membership profile
            </h2>
            <ol className="mt-5 space-y-3">
              {profileSteps.map((s, i) => {
                const n = i + 1
                const complete = n <= done
                const available = n <= done + 1
                return (
                  <li key={s.title} className="flex items-start gap-3 rounded-xl border border-rule bg-white px-4 py-3">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                        complete ? 'bg-navy text-white [&>svg]:size-4' : 'bg-navy/10 text-navy'
                      }`}
                    >
                      {complete ? <CheckIcon /> : n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-navy">
                        {s.title}
                        <span className="sr-only">{complete ? ' (done)' : ' (not done)'}</span>
                      </p>
                      <p className="text-sm text-ink-muted">{s.summary}</p>
                    </div>
                    {available && (
                      <Link href={`/member/apply/${n}`} className={`${textLink} shrink-0 text-base`}>
                        {complete ? 'Edit' : 'Start'}
                        <span className="sr-only"> {s.title}</span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>

          {/* Profile summary */}
          <section aria-labelledby="profile-title">
            <div className="flex items-center gap-4">
              {photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="size-16 rounded-full border border-rule object-cover" />
              )}
              <h2 id="profile-title" className="font-display text-2xl font-semibold text-navy">
                Your details
              </h2>
            </div>
            <div className="mt-5">
              <Summary member={member} />
            </div>
          </section>
        </div>

        {/* Members-only resources */}
        <section aria-labelledby="resources-title">
          <h2 id="resources-title" className="font-display text-2xl font-semibold text-navy">
            Member resources
          </h2>
          {member.status === 'approved' ? (
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {['Webinar recordings', 'Slide decks', 'Joint display guides', 'Methodological toolkits'].map((item) => (
                <li key={item} className="flex items-center justify-between gap-4 rounded-xl border border-rule bg-white px-5 py-4">
                  <span className="font-semibold text-navy">{item}</span>
                  <Placeholder>coming soon</Placeholder>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-base text-ink-muted">
              Recordings, slides, joint display guides and toolkits open up here once your
              membership is approved.
            </p>
          )}
        </section>

        <form action={logOut} className="border-t border-rule pt-8">
          <button type="submit" className={button('outline', 'md')}>
            Log out
          </button>
        </form>
      </div>
    </main>
  )
}
