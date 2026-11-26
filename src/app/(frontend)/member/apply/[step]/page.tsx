import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { MEMBER_STEPS, researchDesigns, researchInterestOptions } from '@/collections/Members'
import {
  membershipCategories,
  membershipFees,
  paymentMethods,
} from '@/collections/membership'
import type { Member } from '@/payload-types'

import { PageHeader } from '../../../components/PageHeader'
import { Placeholder } from '../../../components/Placeholder'
import { requireMember } from '../../../data/member'
import { ProfileStepForm, type StepDefaults } from '../../forms'
import { profileSteps } from '../../steps'

export const metadata: Metadata = { title: 'Membership profile', robots: { index: false } }

type Props = { params: Promise<{ step: string }> }

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })

const flatten = (prefix: string, group: Member['publishedResearch']): StepDefaults => ({
  [`${prefix}.title`]: group?.title,
  [`${prefix}.year`]: group?.year,
  [`${prefix}.publisher`]: group?.publisher,
  [`${prefix}.design`]: group?.design,
})

export default async function ProfileStepPage({ params }: Props) {
  const step = Number((await params).step)
  if (!Number.isInteger(step) || step < 1 || step > MEMBER_STEPS) notFound()

  const member = await requireMember(`/member/apply/${step}`)
  const info = profileSteps[step - 1]

  const defaults: StepDefaults = {
    firstName: member.firstName,
    middleName: member.middleName,
    lastName: member.lastName,
    homeAddress: member.homeAddress,
    institution: member.institution,
    highestEducation: member.highestEducation,
    ...flatten('publishedResearch', member.publishedResearch),
    ...flatten('unpublishedResearch', member.unpublishedResearch),
    researchInterests: member.researchInterests ?? [],
    yearsResearching: member.yearsResearching,
    webinarTopic: member.webinarTopic,
    category: member.category,
    paymentMethod: member.paymentMethod,
    paymentReference: member.paymentReference,
  }
  const photoUrl = typeof member.photo === 'object' ? member.photo?.url : null
  const receiptDoc = typeof member.paymentReceipt === 'object' ? member.paymentReceipt : null
  const receipt =
    receiptDoc?.url && receiptDoc.filename
      ? { url: receiptDoc.url, filename: receiptDoc.filename, mimeType: receiptDoc.mimeType }
      : null
  const submitted = member.status !== 'incomplete'
  const isLast = step === MEMBER_STEPS

  return (
    <main id="main">
      <PageHeader
        image="membership"
        eyebrow={`Step ${step} of ${MEMBER_STEPS}`}
        title={info.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My account', href: '/member' },
          { label: `Step ${step}` },
        ]}
      />

      <div className="mx-auto max-w-[760px] px-4 py-12 md:px-6 md:py-16">
        {/* Progress */}
        <ol aria-label="Profile steps" className="mb-10 grid grid-cols-4 gap-2">
          {profileSteps.map((s, i) => {
            const n = i + 1
            const done = n <= (member.completedSteps ?? 0)
            const current = n === step
            return (
              <li key={s.title} aria-current={current ? 'step' : undefined}>
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full ${current ? 'bg-crimson' : done ? 'bg-navy' : 'bg-navy/15'}`}
                />
                <span className={`mt-2 hidden text-sm sm:block ${current ? 'font-semibold text-navy' : 'text-ink-muted'}`}>
                  {n}. {s.title}
                </span>
                <span className="sr-only">
                  {done ? ' (done)' : ''}
                  {current ? ' (current step)' : ''}
                </span>
              </li>
            )
          })}
        </ol>

        {isLast && (
          <div className="mb-8 rounded-xl border border-gold/60 bg-cream px-5 py-4 text-base text-ink">
            Pay the fee for your category by bank transfer or GCash first, then enter the reference
            number and upload your receipt below. {/* TODO(needs client): bank and GCash account details */}
            <Placeholder>account name and number</Placeholder>
          </div>
        )}

        <ProfileStepForm
          step={step}
          totalSteps={MEMBER_STEPS}
          defaults={defaults}
          email={member.email}
          photoUrl={photoUrl}
          receipt={receipt}
          submitLabel={isLast ? (submitted ? 'Save changes' : 'Submit for review') : 'Save & continue'}
          options={{
            designs: [...researchDesigns],
            interests: [...researchInterestOptions],
            categories: membershipCategories.map((c) => ({
              ...c,
              fee: peso.format(membershipFees[c.value]),
            })),
            payments: paymentMethods.filter((p) => p.value !== 'not-yet'),
          }}
        />
      </div>
    </main>
  )
}
