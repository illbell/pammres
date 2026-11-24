import type { Metadata } from 'next'
import React from 'react'

import { PageHeader } from '../components/PageHeader'
import { PlannedSections, type PlannedSection } from '../components/PlannedSections'

export const metadata: Metadata = {
  title: 'Events, Training & Conferences',
  description:
    'Upcoming PAMMRES webinars, workshops and conferences, and past trainings since 2012.',
}

// Outline from the website guide. TODO: replace with the full page once PAMMRES supplies copy.
const sections: PlannedSection[] = [
  {
    id: 'upcoming',
    title: 'Upcoming Webinars & Workshops',
    summary:
      'Free mini-webinars, fellowship sessions, and annual methodology trainings, with registration links.',
  },
  {
    id: 'conferences',
    title: 'Conferences & Colloquia',
    summary:
      'Flagship gatherings such as The Filipino Mixed Methods Fair, and inter-academic colloquia.',
  },
  {
    id: 'past',
    title: 'Past Trainings & Gallery (2012–Present)',
    summary:
      'Seminar-workshops at partner universities, schools, and agencies across the Philippines.',
  },
]

export default function Page() {
  return (
    <main id="main">
      <PageHeader
        title="Events, Training & Conferences"
        subtitle="Upcoming PAMMRES webinars, workshops and conferences, and past trainings since 2012."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events & Training' }]}
      />
      <PlannedSections sections={sections} />
    </main>
  )
}
