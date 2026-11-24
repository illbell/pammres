import Link from 'next/link'
import React from 'react'

import { getHomePartners } from '../../data/cms'
import { ArrowRightIcon } from '../icons'
import { LogoMark } from '../LogoMark'
import { SectionHeading } from '../SectionHeading'
import { textLink } from '../ui'

// Quick stats drawn from figures in the website guide.
const getStats = (institutionCount: number) => [
  { value: '100+', label: 'active researchers and educators' },
  { value: `${institutionCount}`, label: 'member institutions and agencies' },
  { value: '3', label: 'island groups: Luzon, Visayas and Mindanao' },
  { value: '2012', label: 'year our seminar-workshops began' },
]

const symbolism = [
  {
    title: 'The Red & Blue Cyclical Arrows',
    body: 'Symbolize the continuous sharing of research perspectives, creativity, and methodological growth among our members.',
    swatch: 'bg-linear-to-br from-crimson to-[#5b8fd6]',
  },
  {
    title: 'The Central White Triangle (Q+Q)',
    body: 'Represents methodological triangulation—our commitment to research validity, openness, and scholarly integrity in the pursuit of truth.',
    swatch: 'bg-white ring-1 ring-navy/30',
  },
]

/** Who We Are & Logo Philosophy (guide Section 2): emblem left, story and stats right. */
export async function WhoWeAre() {
  const stats = getStats((await getHomePartners()).length)

  return (
    <section aria-labelledby="who-title" className="bg-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        <div className="flex flex-col items-center gap-8 lg:sticky lg:top-40 lg:self-start">
          <div className="relative grid aspect-square w-full max-w-[22rem] place-items-center rounded-full bg-cream">
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full border-2 border-dashed border-gold/50"
            />
            <LogoMark className="relative size-44 drop-shadow-xl md:size-52" />
          </div>
          <p className="max-w-[22rem] text-center text-sm text-ink-muted">
            The PAMMRES emblem: two cyclical arrows around a triangulation triangle.
          </p>
        </div>

        <div>
          <SectionHeading
            id="who-title"
            eyebrow="About PAMMRES"
            title="Rooted in Local Contexts, Connected to the World"
          />
          <p className="mt-6 max-w-[44rem] text-lg/relaxed text-pretty text-ink-muted">
            The Philippine Association of Mixed Methods Researchers and Emergent Scholars (PAMMRES)
            brings together academics, practitioners, and policymakers across Luzon, Visayas, and
            Mindanao. Driven by a collaborative growth mindset and respectful camaraderie, we foster
            a lifelong community of practice where seasoned scholars mentor emerging researchers in
            designing rigorous qualitative, quantitative, and mixed methods studies.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse bg-white p-5">
                <dt className="mt-1 text-sm/snug text-ink-muted">{stat.label}</dt>
                <dd className="font-display text-3xl font-semibold text-navy md:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-12 font-display text-2xl font-semibold text-navy">
            The Symbolism Behind Our Emblem
          </h3>
          <ul className="mt-5 space-y-5">
            {symbolism.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 size-4 shrink-0 rounded-full ${item.swatch}`}
                />
                <p className="text-base/relaxed text-ink-muted">
                  <strong className="font-semibold text-navy">{item.title}:</strong> {item.body}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="/about#officers"
            className={`${textLink} mt-10 inline-flex items-center gap-1.5`}
          >
            Meet Our National Officers & Board
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
