import type { Metadata } from 'next'
import React from 'react'

import { PageHeader } from '../components/PageHeader'
import { PlannedSections, type PlannedSection } from '../components/PlannedSections'

export const metadata: Metadata = {
  title: 'Mentorship & Resources',
  description:
    'The PAMMRES Research Mentorship Program, Research Interest Groups, and learning resources.',
}

// Outline from the website guide. TODO: replace with the full page once PAMMRES supplies copy.
const sections: PlannedSection[] = [
  {
    id: 'program',
    title: 'Research Mentorship Program',
    summary:
      'Pairing emergent scholars and graduate students with experienced mixed methods practitioners.',
  },
  {
    id: 'rigs',
    title: 'Research Interest Groups & Expertise Directory',
    summary:
      'A directory of members’ disciplines to help researchers form interdisciplinary teams.',
  },
  {
    id: 'repository',
    title: 'Learning Repository',
    summary:
      'Webinar recordings, slide decks, joint display guides, and open-access methodological toolkits.',
  },
]

export default function Page() {
  return (
    <main id="main">
      <PageHeader
        title="Mentorship & Resources"
        subtitle="The PAMMRES Research Mentorship Program, Research Interest Groups, and learning resources."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Mentorship' }]}
      />
      <PlannedSections sections={sections} />
    </main>
  )
}
