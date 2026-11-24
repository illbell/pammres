import type { Metadata } from 'next'
import React from 'react'

import { PageHeader } from '../components/PageHeader'
import { PlannedSections, type PlannedSection } from '../components/PlannedSections'

export const metadata: Metadata = {
  title: 'Membership & Chapters',
  description:
    'Membership categories, benefits, and how to join PAMMRES or start a regional or school chapter.',
}

// Outline from the website guide. TODO: replace with the full page once PAMMRES supplies copy.
const sections: PlannedSection[] = [
  {
    id: 'why-join',
    title: 'Why Join PAMMRES',
    summary:
      'Peer mentorship, access to the MMIRA international network, interdisciplinary collaboration, and avenues for policy impact.',
  },
  {
    id: 'categories',
    title: 'Membership Categories & Fees',
    summary:
      'Individual (Full Member, Associate/Emergent Scholar, Student) and Institutional memberships.',
  },
  {
    id: 'apply',
    title: 'Online Application',
    summary: 'How to apply, with payment verification instructions (bank transfer or GCash).',
  },
  {
    id: 'member-login',
    title: 'Member Login',
    summary: 'Access to the member directory and member resources.',
  },
  {
    id: 'chapters',
    title: 'Regional & School Chapters',
    summary:
      'Guidelines and directory for provincial, regional, and school-based chapters across Luzon, Visayas, and Mindanao.',
  },
]

export default function Page() {
  return (
    <main id="main">
      <PageHeader
        title="Membership & Chapters"
        subtitle="Membership categories, benefits, and how to join PAMMRES or start a regional or school chapter."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Membership' }]}
      />
      <PlannedSections sections={sections} />
    </main>
  )
}
