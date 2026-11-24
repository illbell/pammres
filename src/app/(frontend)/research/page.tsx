import type { Metadata } from 'next'
import React from 'react'

import { PageHeader } from '../components/PageHeader'
import { PlannedSections, type PlannedSection } from '../components/PlannedSections'

export const metadata: Metadata = {
  title: 'Research, Publications & Policy Impact',
  description:
    'The PAMMRES Research Journal, the Societal Impact & SDG Hub, and the Indigenized Filipino MMR Framework.',
}

// Outline from the website guide. TODO: replace with the full page once PAMMRES supplies copy.
const sections: PlannedSection[] = [
  {
    id: 'journal',
    title: 'PAMMRES Research Journal & Proceedings',
    summary:
      'Local mixed methods papers and conference proceedings, with links to partner journals such as the Journal of Mixed Methods Research (JMMR) and IJMRA.',
  },
  {
    id: 'sdg-hub',
    title: 'Societal Impact & SDG Hub',
    summary:
      'Research aligned with UN SDGs 1–10, marginalized sector immersion, LGU research hubs, and legislative policy briefs.',
  },
  {
    id: 'framework',
    title: 'Indigenized Filipino MMR Framework',
    summary:
      'Frameworks and studies developing a distinctly Filipino mixed methods research tradition.',
  },
]

export default function Page() {
  return (
    <main id="main">
      <PageHeader
        title="Research, Publications & Policy Impact"
        subtitle="The PAMMRES Research Journal, the Societal Impact & SDG Hub, and the Indigenized Filipino MMR Framework."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research & Policy' }]}
      />
      <PlannedSections sections={sections} />
    </main>
  )
}
