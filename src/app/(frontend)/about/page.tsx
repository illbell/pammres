import type { Metadata } from 'next'
import React from 'react'

import { Placeholder } from '../components/Placeholder'
import { SplitSection } from '../components/SplitSection'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who we are: the Philippine Association of Mixed Methods Researchers & Emergent Scholars, its mission, activities and officers.',
}

const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink'
const focusRingOnDark =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-quan'

// TODO: confirm these activities with PAMMRES.
const activities = [
  {
    title: 'Training in mixed methods',
    body: 'Workshops and seminars on designing, conducting and reporting mixed methods studies, from choosing a design to integrating qualitative and quantitative findings.',
  },
  {
    title: 'Mentoring emergent scholars',
    body: 'Graduate students and early-career researchers get guidance from experienced members on their own studies, theses and first publications.',
  },
  {
    title: 'Conferences and events',
    body: 'Gatherings where members present work in progress, get feedback from people who understand both traditions, and meet collaborators.',
  },
  {
    title: 'Sharing research',
    body: 'A home for members’ publications, so mixed methods research from the Philippines is easier to find and build on.',
    link: { href: '/#publications', label: 'See recent publications' },
  },
]

// TODO: replace with the current officers. Roles are typical for an association; adjust as needed.
const officerRoles = ['President', 'Vice President', 'Secretary', 'Treasurer']

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto max-w-[1280px] px-3 pb-6 md:px-6">
      {/* Intro */}
      <section aria-labelledby="about-title" className="px-3 pt-14 pb-16 md:px-8 md:pt-24 md:pb-24">
        <h1
          id="about-title"
          className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.035em]"
        >
          About <span translate="no">PAMMRES</span>
        </h1>
        <p className="mt-8 max-w-[42rem] text-xl/relaxed text-pretty md:text-2xl/relaxed">
          The Philippine Association of Mixed Methods Researchers &amp; Emergent Scholars is a
          community for researchers who combine qualitative and quantitative approaches to answer
          questions that neither can answer alone.
        </p>
      </section>

      {/* TODO: confirm the mission and vision wording with PAMMRES. */}
      <SplitSection id="mission" title="Mission and vision">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-[-0.01em] md:text-2xl">
              Our mission
            </h3>
            <p className="mt-3 text-lg/relaxed text-pretty text-ink-muted">
              To build the capacity of Filipino researchers to design and carry out rigorous mixed
              methods studies, and to give emerging scholars the training, mentorship and community
              to do their best work.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold tracking-[-0.01em] md:text-2xl">
              Our vision
            </h3>
            <p className="mt-3 text-lg/relaxed text-pretty text-ink-muted">
              A research culture in the Philippines where numbers and narratives are used together,
              producing evidence that is both measurable and grounded in people’s lived experience.
            </p>
          </div>
        </div>
      </SplitSection>

      <SplitSection
        id="what-we-do"
        title="What we do"
        intro="How we support researchers at every stage, from first study to established practice."
      >
        <ul className="divide-y divide-rule border-y border-rule">
          {activities.map((item) => (
            <li key={item.title} className="py-7">
              <h3 className="font-display text-xl leading-snug font-semibold tracking-[-0.01em] md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[44rem] text-lg/relaxed text-pretty text-ink-muted">
                {item.body}
              </p>
              {item.link && (
                <a
                  href={item.link.href}
                  className={`mt-3 inline-block rounded-sm font-semibold text-ink underline decoration-ink/25 decoration-2 underline-offset-4 transition-colors duration-150 hover:decoration-integrate motion-reduce:transition-none ${focusRing}`}
                >
                  {item.link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </SplitSection>

      <SplitSection id="history" title="Our history">
        <div className="max-w-[44rem] space-y-5 text-lg/relaxed text-pretty">
          <p>
            <span translate="no">PAMMRES</span> was founded in <Placeholder>founding year</Placeholder>{' '}
            by <Placeholder>founding members or institution</Placeholder> to{' '}
            <Placeholder>why the association was started</Placeholder>.
          </p>
          <p>
            <Placeholder>
              Key milestones, e.g. first national conference, number of members, partner
              universities
            </Placeholder>
          </p>
        </div>
      </SplitSection>

      <SplitSection
        id="officers"
        title="Officers"
        intro={
          <>
            Elected for <Placeholder>term, e.g. 2025–2026</Placeholder>.
          </>
        }
      >
        <ul className="grid grid-cols-1 gap-x-10 border-t border-rule sm:grid-cols-2">
          {officerRoles.map((role) => (
            <li key={role} className="border-b border-rule py-6">
              <p className="text-base font-semibold text-ink-muted">{role}</p>
              <p className="mt-1 font-display text-xl font-semibold tracking-[-0.01em]">
                <Placeholder>Name</Placeholder>
              </p>
              <p className="mt-1 text-base text-ink-muted">
                <Placeholder>Affiliation</Placeholder>
              </p>
            </li>
          ))}
        </ul>
      </SplitSection>

      {/* Closing call to action, echoing the home page hero panel */}
      <section
        aria-labelledby="join-title"
        className="bg-dot-grid mt-4 rounded-[28px] bg-ink px-6 py-14 text-ground md:px-14 md:py-20"
      >
        <h2
          id="join-title"
          className="max-w-[18ch] font-display text-4xl leading-[1.0] font-bold tracking-[-0.03em] text-balance md:text-5xl"
        >
          Join researchers who work across methods.
        </h2>
        <p className="mt-5 max-w-[36rem] text-lg/relaxed text-pretty text-ground/75">
          Membership is open to established researchers, graduate students and early-career
          scholars.
        </p>
        {/* TODO: point at the membership page once it exists */}
        <a
          href="#"
          className={`mt-8 inline-block rounded-full bg-integrate px-7 py-3.5 font-semibold text-ink no-underline transition-colors duration-150 hover:bg-integrate-hover motion-reduce:transition-none ${focusRingOnDark}`}
        >
          Become a member
        </a>
      </section>
    </main>
  )
}
