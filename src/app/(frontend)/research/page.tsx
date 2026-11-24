import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { GlobeIcon, ImpactIcon, NetworkIcon } from '../components/icons'
import { contactHref, joinHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { SectionHeading } from '../components/SectionHeading'
import { textLink } from '../components/ui'

export const metadata: Metadata = {
  title: 'Research, Publications & Policy Impact',
  description:
    'The PAMMRES Research Journal and proceedings, the Societal Impact & SDG Hub, and the Indigenized Filipino Mixed Methods Research Framework.',
}

// Section text follows the website guide's outline. Featured studies and the
// journal itself are placeholders until PAMMRES supplies them.
const sdgFocus = [
  {
    title: 'UN SDGs 1–10',
    body: 'Research aligned with the first ten UN Sustainable Development Goals.',
    icon: <GlobeIcon />,
  },
  {
    title: 'Marginalized Sector Immersion',
    body: 'Inquiry rooted in solidarity with marginalized members of society.',
    icon: <ImpactIcon />,
  },
  {
    title: 'LGU Research Hubs',
    body: 'Partnerships with local government units that inform local policy.',
    icon: <NetworkIcon />,
  },
  {
    title: 'Legislative Policy Briefs',
    body: 'Translating evidence into policies, programs, and practice.',
    icon: <ImpactIcon />,
  },
]

export default function ResearchPage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        title="Research, Publications & Policy Impact"
        subtitle="Advancing rigorous, indigenized, and globally relevant inquiry, and translating evidence into policies, programs, and practice."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research & Policy' }]}
      />

      <section id="journal" aria-labelledby="journal-title" className="bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="journal-title"
              title="PAMMRES Research Journal & Proceedings"
              intro="A platform for publishing local mixed methods papers and conference proceedings."
            />
            <p className="mt-6 text-base text-ink-muted">
              <Placeholder>
                Journal details: scope, call for papers, submission guidelines
              </Placeholder>
            </p>
            <p className="mt-3 text-base text-ink-muted">
              <Placeholder>Published issues and proceedings</Placeholder>
            </p>
          </div>
          <aside
            aria-labelledby="partner-journals-title"
            className="self-start rounded-xl border border-rule border-t-4 border-t-navy bg-cream p-6 md:p-8"
          >
            <h3
              id="partner-journals-title"
              className="font-display text-xl font-semibold text-navy"
            >
              Partner journals
            </h3>
            <ul className="mt-4 space-y-3 text-base">
              <li>
                <a
                  href="https://journals.sagepub.com/home/mmr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={textLink}
                >
                  Journal of Mixed Methods Research (JMMR)
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li className="text-navy">
                {/* TODO: add the IJMRA link once PAMMRES confirms the official URL. */}
                International Journal of Multiple Research Approaches (IJMRA)
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section id="sdg-hub" aria-labelledby="sdg-title" className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="sdg-title"
            title="Societal Impact & SDG Hub"
            intro="Translating research findings into actionable programs that address UN Sustainable Development Goals (SDGs 1–10), empower marginalized sectors, and inform local government policies."
            align="center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sdgFocus.map((f) => (
              <li key={f.title} className="flex">
                <Card className="w-full" title={f.title} icon={f.icon}>
                  <p>{f.body}</p>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-base text-ink-muted">
            <Placeholder>Featured studies and policy briefs</Placeholder> Led by{' '}
            <Link href="/about#theme-leaders" className={textLink}>
              Theme 2: Societal Impact and Policy Influence
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="framework" aria-labelledby="framework-title" className="bg-white">
        <div className="mx-auto max-w-[960px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="framework-title"
            title="Indigenized Filipino MMR Framework"
            intro="A repository of frameworks and studies developing a distinctly Filipino mixed methods research backbone."
          />
          <p className="mt-6 text-base text-ink-muted">
            <Placeholder>Framework documents and studies</Placeholder> Part of the agenda of{' '}
            <Link href="/about#theme-leaders" className={textLink}>
              Theme 3: Organizational Growth and Sustainability
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand
        id="research-cta"
        title="Ready to advance your mixed methods research journey?"
        body="Members present work-in-progress at inter-university colloquia in a supportive environment."
        primary={{ label: 'Become a Member', href: joinHref }}
        secondary={{ label: 'Contact the Secretariat', href: contactHref }}
      />
    </main>
  )
}
