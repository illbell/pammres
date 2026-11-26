import type { Metadata } from 'next'
import React from 'react'

import { Accordion } from '../components/Accordion'
import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { LogoMark } from '../components/LogoMark'
import { joinHref } from '../components/navigation'
import { OfficerCard } from '../components/OfficerCard'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { SectionHeading } from '../components/SectionHeading'
import { SitePhoto } from '../components/SitePhoto'
import { coreValues, mission, vision } from '../content/identity'
import { resolvePhoto } from '../content/images'
import { getOfficerGroups, getPastOfficers, getThemeGroups } from '../data/cms'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Advancing a Filipino fellowship of seasoned and emergent mixed methods scholars in service of the marginalized and the nation. Our story, vision, mission, core values, emblem, and national officers.',
}

const quickFacts = [
  { label: 'Global Affiliation', value: 'Official Philippine Affiliate of MMIRA' },
  {
    label: 'Network Reach',
    value:
      '100+ active practitioner-scholars across leading State Universities & Colleges (SUCs), Private HEIs, and DepEd',
  },
  {
    label: 'Core Advocacy',
    value: 'Methodological triangulation, peer mentorship, and evidence-based nation-building',
  },
]

function OurStory() {
  return (
    <section id="story" aria-labelledby="story-title" className="bg-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-16">
        <div>
          <SectionHeading id="story-title" title="Our Story & Affiliation" />
          <div className="mt-6 max-w-[44rem] space-y-5 text-lg/relaxed text-pretty text-ink-muted">
            <p>
              The{' '}
              <strong className="font-semibold text-navy">
                Philippine Association of Mixed Methods Researchers and Emergent Scholars (PAMMRES)
              </strong>{' '}
              is a nationwide community of practice uniting Filipino academics, research
              practitioners, educators, and policymakers across Luzon, Visayas, and Mindanao.
            </p>
            <p>
              As the official Philippine affiliate of the{' '}
              <strong className="font-semibold text-navy">
                Mixed Methods International Research Association (MMIRA)
              </strong>
              , PAMMRES bridges local realities with global scholarship. Through inter-university
              seminar-workshops, national research fairs, peer mentorship, and policy engagement, we
              equip both seasoned researchers and emerging scholars to integrate qualitative and
              quantitative inquiry in addressing complex societal needs.
            </p>
          </div>
        </div>

        <aside
          aria-label="Quick facts"
          className="bg-dot-grid self-start rounded-2xl border-t-4 border-gold bg-navy p-7 text-white shadow-lg md:p-8"
        >
          <p className="text-sm font-semibold tracking-[0.14em] text-gold-soft uppercase">
            Quick Facts
          </p>
          <dl className="mt-6 space-y-6">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="border-l-2 border-gold/60 pl-4">
                <dt className="font-display text-lg font-semibold text-white">{fact.label}</dt>
                <dd className="mt-1 text-base/relaxed text-white/80">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}

function VisionMissionValues() {
  return (
    <section
      id="vision-mission"
      aria-labelledby="vmcv-title"
      className="border-t border-rule bg-white"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-28">
        <SectionHeading id="vmcv-title" title="Vision, Mission & Core Values" align="center" />

        <div className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <Card title="Vision" accent="crimson" as="h3" hover={false}>
            <blockquote className="font-display text-xl/relaxed text-pretty text-navy italic">
              “{vision}”
            </blockquote>
          </Card>
          <Card title="Mission" accent="navy" as="h3" hover={false}>
            <blockquote className="font-display text-xl/relaxed text-pretty text-navy italic">
              “{mission}”
            </blockquote>
          </Card>
        </div>

        <h3
          id="core-values"
          className="mt-20 text-center font-display text-2xl font-semibold text-navy md:text-3xl"
        >
          Our Five Core Values
        </h3>
        <ol className="mt-10 flex flex-wrap justify-center gap-6">
          {coreValues.map((value, i) => (
            <li
              key={value.title}
              className="flex w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <article className="flex w-full flex-col overflow-hidden rounded-xl border border-rule border-t-4 border-t-navy bg-white shadow-sm transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="relative aspect-[3/2]">
                  <SitePhoto
                    photo={resolvePhoto(value.photo)}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  />
                  {/* Number badge in the photo's top-left corner */}
                  <span
                    aria-hidden="true"
                    className="absolute top-4 left-4 grid size-11 place-items-center rounded-full bg-gold font-display text-xl font-semibold text-navy-deep shadow-md ring-4 ring-white/90"
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h4 className="font-display text-xl leading-snug font-semibold text-balance text-navy">
                    {i === 0 ? (
                      <>
                        <em>Bayanihan</em> and Inclusive Fellowship
                      </>
                    ) : (
                      value.title
                    )}
                  </h4>
                  <p className="mt-2 text-base/snug font-semibold text-crimson">{value.tagline}</p>
                  <p className="mt-3 text-base/relaxed text-ink-muted">{value.description}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Emblem() {
  const callouts = [
    {
      title: 'The Red and Blue Cyclical Arrows',
      swatch: 'bg-linear-to-br from-crimson to-[#5b8fd6]',
      body: 'Symbolize the continuous sharing of research experiences and perspectives among PAMMRES members as they build capacities across varied methodologies. Viewed through the lens of mixed methods research, PAMMRES practitioner-scholars sustain curiosity, creativity, innovativeness, and dynamism as a community committed to quality research education, practice, and advocacy.',
    },
    {
      title: 'The Central White Triangle (Q+Q)',
      swatch: 'bg-white ring-1 ring-navy/30',
      body: 'Stands for methodological triangulation as a means to achieve research validity, symbolizing the spirit of openness, collaboration, and integrity in our shared quest for truth.',
    },
  ]

  return (
    <section id="emblem" aria-labelledby="emblem-title" className="bg-cream">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        <div className="flex justify-center">
          <div className="relative grid aspect-square w-full max-w-[22rem] place-items-center rounded-full bg-white shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full border-2 border-dashed border-gold/50"
            />
            <LogoMark className="relative size-44 drop-shadow-xl md:size-52" />
          </div>
        </div>
        <div>
          <SectionHeading
            id="emblem-title"
            eyebrow="Our Identity"
            title="The Symbolism Behind Our Logo"
          />
          <ul className="mt-10 space-y-6">
            {callouts.map((c) => (
              <li
                key={c.title}
                className="rounded-xl border border-rule bg-white p-6 shadow-sm md:p-7"
              >
                <h3 className="flex items-center gap-3 font-display text-xl font-semibold text-navy">
                  <span aria-hidden="true" className={`size-5 shrink-0 rounded-full ${c.swatch}`} />
                  {c.title}
                </h3>
                <p className="mt-3 text-base/relaxed text-ink-muted">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

async function Officers() {
  const officerGroups = await getOfficerGroups()

  return (
    <section id="officers" aria-labelledby="officers-title" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-28">
        <SectionHeading
          id="officers-title"
          eyebrow="Leadership & Governance"
          title="National Officers & Executive Board"
          intro="Guiding PAMMRES’s nationwide initiatives across higher education institutions, basic education, and public service."
          align="center"
        />

        <div className="mt-16 space-y-16">
          {officerGroups.map((group) => (
            <div key={group.id} aria-labelledby={`${group.id}-title`} role="group">
              <h3
                id={`${group.id}-title`}
                className="flex items-center gap-4 text-sm font-semibold tracking-[0.14em] text-crimson uppercase after:h-px after:flex-1 after:bg-rule"
              >
                {group.title}
              </h3>
              <ul
                className={`mx-auto mt-10 grid grid-cols-1 gap-x-8 gap-y-12 ${group.columns} ${
                  group.size === 'lg' ? 'max-w-[720px]' : ''
                }`}
              >
                {group.officers.map((officer) => (
                  <li key={officer.id}>
                    <OfficerCard
                      name={officer.name}
                      role={officer.role}
                      institution={officer.institution}
                      photo={officer.photo}
                      size={group.size}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

async function ThemeLeaders() {
  const themeGroups = await getThemeGroups()

  return (
    <section
      id="theme-leaders"
      aria-labelledby="themes-title"
      className="border-t border-rule bg-white"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-28">
        <SectionHeading
          id="themes-title"
          eyebrow="Strategic Committees"
          title="Theme Group Leaders"
          intro="Spearheading PAMMRES’s four core strategic priorities across research, policy, membership, and international linkages."
          align="center"
        />
        <ol className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {themeGroups.map((theme) => (
            <li key={theme.number} className="flex">
              <Card className="w-full" eyebrow={`Theme ${theme.number}`} title={theme.title}>
                <p className="flex flex-wrap items-baseline gap-x-2 border-y border-rule py-3 text-base">
                  <span className="text-sm font-semibold tracking-[0.08em] text-ink-muted uppercase">
                    Leader
                  </span>
                  <span className="font-semibold text-navy">{theme.leaderName}</span>
                  {theme.leaderInstitution && (
                    <span className="text-ink-muted">({theme.leaderInstitution})</span>
                  )}
                </p>
                <p className="mt-4">
                  <strong className="font-semibold text-navy">Mandate:</strong> {theme.mandate}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

async function GovernanceArchive() {
  const pastTerms = await getPastOfficers()

  return (
    <section id="governance" aria-labelledby="governance-title" className="bg-cream">
      <div className="mx-auto max-w-[960px] px-4 py-20 md:px-6 md:py-24">
        <SectionHeading
          id="governance-title"
          title="Founding Roots & Governance Archive"
          align="center"
        />
        <div className="mt-12">
          <Accordion
            items={[
              ...pastTerms.map((t, i) => ({
                id: i === 0 ? 'founding-officers' : `past-officers-${i}`,
                title: t.term,
                content: (
                  <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    {t.officers.map((o) => (
                      <div key={`${o.role}-${o.name}`}>
                        <dt className="text-sm font-semibold tracking-[0.08em] text-crimson uppercase">
                          {o.role}
                        </dt>
                        <dd className="mt-0.5 font-semibold text-navy">{o.name}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              })),
              {
                id: 'constitution',
                title: 'Constitution, By-Laws & Chapter Guidelines',
                content: (
                  <div className="space-y-3">
                    <p>
                      The Constitution & By-Laws, SEC registration details, and the guidelines for
                      forming Regional and School Chapters will be available to download here.
                    </p>
                    {/* TODO: link the PDFs (and SEC registration details) once PAMMRES supplies them. */}
                    <ul className="list-disc space-y-1 pl-5">
                      <li>
                        <Placeholder>Constitution & By-Laws (PDF)</Placeholder>
                      </li>
                      <li>
                        <Placeholder>SEC Registration details</Placeholder>
                      </li>
                      <li>
                        <Placeholder>
                          Regional/School Chapter formation guidelines (PDF)
                        </Placeholder>
                      </li>
                    </ul>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    // mb-0!: the crimson band sits directly on the footer
    <main id="main" className="mb-0!">
      <PageHeader
        image="about"
        eyebrow="Who We Are"
        title="About PAMMRES"
        subtitle="Advancing a Filipino fellowship of seasoned and emergent mixed methods scholars in service of the marginalized and the nation."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />
      <OurStory />
      <VisionMissionValues />
      <Emblem />
      <Officers />
      <ThemeLeaders />
      <GovernanceArchive />
      <CtaBand
        id="about-cta"
        title="Be Part of Our Growing Community of Practice"
        body="Connect with fellow researchers, access mentorship, and contribute to socially transformative mixed methods scholarship across the Philippines."
        primary={{ label: 'Apply for Membership', href: joinHref }}
        secondary={{ label: 'Explore Upcoming Events', href: '/events' }}
      />
    </main>
  )
}
