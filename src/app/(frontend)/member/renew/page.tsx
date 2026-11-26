import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

import {
  membershipCategories,
  membershipFees,
  membershipStanding,
  paymentMethods,
} from '@/collections/membership'

import { PageHeader } from '../../components/PageHeader'
import { Placeholder } from '../../components/Placeholder'
import { requireMember } from '../../data/member'
import { RenewForm } from '../forms'

export const metadata: Metadata = { title: 'Renew membership', robots: { index: false } }

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })
const dateFmt = new Intl.DateTimeFormat('en-PH', { dateStyle: 'long', timeZone: 'Asia/Manila' })

/** Annual renewal: open from 30 days before expiry, and after a membership has expired. */
export default async function RenewPage() {
  const member = await requireMember('/member/renew')
  const { standing, expires, canRenew } = membershipStanding(member)
  if (!canRenew) redirect('/member')

  return (
    <main id="main">
      <PageHeader
        eyebrow="Membership"
        title="Renew your membership"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My account', href: '/member' },
          { label: 'Renew' },
        ]}
      />

      <div className="mx-auto max-w-[760px] px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 rounded-xl border border-gold/60 bg-cream px-5 py-4 text-base text-ink">
          <p>
            {standing === 'expired'
              ? `Your membership expired on ${expires ? dateFmt.format(expires) : ''}.`
              : `Your membership runs until ${expires ? dateFmt.format(expires) : ''}; renewing now adds a full year after that date.`}
          </p>
          <p className="mt-2">
            Pay the fee for your category by bank transfer or GCash, then enter the reference number
            and upload your receipt. {/* TODO(needs client): bank and GCash account details */}
            <Placeholder>account name and number</Placeholder>
          </p>
        </div>

        <RenewForm
          defaults={{ category: member.category, paymentMethod: null, paymentReference: null }}
          options={{
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
