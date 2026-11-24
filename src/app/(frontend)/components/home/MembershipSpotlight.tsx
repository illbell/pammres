import Link from 'next/link'
import React from 'react'

import { CheckIcon } from '../icons'
import { SectionHeading } from '../SectionHeading'
import { button } from '../ui'

const audiences = [
  {
    id: 'experienced',
    title: 'For Experienced Scholars & Institutions',
    accent: 'border-t-navy',
    items: [
      {
        title: 'Lead & Collaborate',
        body: 'Form interdisciplinary research teams through our national expertise directory.',
      },
      {
        title: 'Global Access',
        body: 'Connect with international methodologists through MMIRA conferences and joint publications.',
      },
      {
        title: 'Institutional Chapters',
        body: 'Establish a PAMMRES school, provincial, or regional chapter.',
      },
    ],
  },
  {
    id: 'emergent',
    title: 'For Emergent Scholars & Students',
    accent: 'border-t-crimson',
    items: [
      {
        title: '1-on-1 Peer Mentorship',
        body: 'Get paired with experienced mixed methods practitioners aligned with your field.',
      },
      {
        title: 'Free Mini-Webinars & Fellowships',
        body: 'Build practical skills in joint displays, integration, and data analysis.',
      },
      {
        title: 'Present & Publish',
        body: 'Share work-in-progress at inter-university colloquia in a supportive environment.',
      },
    ],
  },
]

/** Membership & Mentorship Spotlight (guide Section 4): cream band, two audience cards. */
export function MembershipSpotlight() {
  return (
    <section aria-labelledby="spotlight-title" className="bg-cream">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-28">
        <SectionHeading
          id="spotlight-title"
          eyebrow="Membership & Mentorship"
          title="Grow With a Supportive Community of Practice"
          intro="Whether you are leading institutional research or designing your first mixed methods thesis, PAMMRES provides the network and guidance you need."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {audiences.map((audience) => (
            <article
              key={audience.id}
              aria-labelledby={`${audience.id}-title`}
              className={`rounded-xl border border-rule border-t-4 bg-white p-7 shadow-sm md:p-9 ${audience.accent}`}
            >
              <h3
                id={`${audience.id}-title`}
                className="font-display text-2xl leading-snug font-semibold text-balance text-navy"
              >
                {audience.title}
              </h3>
              <ul className="mt-6 space-y-5">
                {audience.items.map((item) => (
                  <li key={item.title} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-gold/15 text-gold"
                    >
                      <CheckIcon className="size-4" />
                    </span>
                    <p className="text-base/relaxed text-ink-muted">
                      <strong className="block font-semibold text-navy">{item.title}</strong>
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/membership#categories" className={button('primary')}>
            View Membership Tiers & Apply
          </Link>
        </div>
      </div>
    </section>
  )
}
