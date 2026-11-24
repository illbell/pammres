import type { Metadata } from 'next'
import React from 'react'

import { CtaBand } from './components/CtaBand'
import { AnnouncementBar } from './components/home/AnnouncementBar'
import { HomeHero } from './components/home/HomeHero'
import { InstitutionalReach } from './components/home/InstitutionalReach'
import { MembershipSpotlight } from './components/home/MembershipSpotlight'
import { StrategicPillars } from './components/home/StrategicPillars'
import { WhoWeAre } from './components/home/WhoWeAre'
import { joinHref, partnerHref } from './components/navigation'

export const metadata: Metadata = {
  title: {
    absolute: 'PAMMRES | Philippine Association of Mixed Methods Researchers and Emergent Scholars',
  },
}

/** Homepage, following the wireframe in PAMMRES Website Guide.pdf (Sections 1–6). */
export default function HomePage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <HomeHero />
      <AnnouncementBar />
      <WhoWeAre />
      <StrategicPillars />
      <MembershipSpotlight />
      <InstitutionalReach />
      <CtaBand
        id="pre-footer"
        title="Ready to advance your mixed methods research journey?"
        primary={{ label: 'Join PAMMRES Today', href: joinHref }}
        secondary={{ label: 'Partner With Us for a Workshop', href: partnerHref }}
      />
    </main>
  )
}
