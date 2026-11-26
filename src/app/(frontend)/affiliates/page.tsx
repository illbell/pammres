import type { Metadata } from 'next'
import React from 'react'

import { CtaBand } from '../components/CtaBand'
import { ArrowRightIcon, GlobeIcon } from '../components/icons'
import { contactHref, joinHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { focusRing } from '../components/ui'
import { affiliates } from '../content/affiliates'

export const metadata: Metadata = {
  title: 'Affiliates',
  description:
    'PAMMRES is the official Philippine affiliate of the Mixed Methods International Research Association (MMIRA). Visit MMIRA and its sister associations worldwide.',
}

export default function AffiliatesPage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        eyebrow="Global Network"
        title="Affiliates"
        subtitle="PAMMRES is the official Philippine affiliate of MMIRA, part of a worldwide network of mixed methods research associations."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Affiliates' }]}
      />

      <section aria-labelledby="affiliates-title" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="affiliates-title"
            eyebrow="Mixed Methods Associations"
            title="Our International Affiliates"
            intro="Each link opens the association's own website in a new tab."
            align="center"
          />
          <ul className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-2">
            {affiliates.map((a) => (
              <li key={a.url} className="flex">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex w-full flex-col rounded-xl border border-rule border-t-4 border-t-navy bg-white p-6 no-underline shadow-sm transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8 ${focusRing}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold [&>svg]:size-6"
                    >
                      <GlobeIcon />
                    </div>
                    <span className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-navy">
                      {a.region}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-semibold tracking-[0.12em] text-crimson uppercase">
                    {a.short}
                  </p>
                  <h3 className="mt-1 font-display text-2xl leading-snug font-semibold text-balance text-navy">
                    {a.name}
                  </h3>
                  <p className="mt-3 text-base/relaxed text-ink-muted">{a.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-semibold text-navy">
                    <span className="underline decoration-navy/25 decoration-2 underline-offset-4 group-hover:decoration-crimson">
                      Visit website
                    </span>
                    <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        id="affiliates-cta"
        title="Join the Global Mixed Methods Community"
        body="Membership in PAMMRES connects you with mixed methods researchers in the Philippines and around the world."
        primary={{ label: 'Become a Member', href: joinHref }}
        secondary={{ label: 'Contact the Secretariat', href: contactHref }}
      />
    </main>
  )
}
