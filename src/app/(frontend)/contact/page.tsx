import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { partnerTypes } from '@/collections/Partners'

import { joinHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { Placeholder } from '../components/Placeholder'
import { SectionHeading } from '../components/SectionHeading'
import { textLink } from '../components/ui'
import { getAllPartners, getSiteSettings } from '../data/cms'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Linkages & Contact',
  description:
    'PAMMRES partners and linkages, hosting a workshop or sponsoring a convention, and how to contact the secretariat.',
}

const typeLabel: Record<string, string> = Object.fromEntries(
  partnerTypes.map((t) => [t.value, t.label]),
)

export default async function ContactPage() {
  const [{ contactEmail, facebookUrl, mailingAddress }, partners] = await Promise.all([
    getSiteSettings(),
    getAllPartners(),
  ])

  // Group partners by type, in the order the types are defined.
  const groups = partnerTypes
    .map((t) => ({ ...t, partners: partners.filter((p) => p.type === t.value) }))
    .filter((g) => g.partners.length > 0)

  return (
    <main id="main">
      <PageHeader
        image="contact"
        title="Linkages & Contact"
        subtitle="Our partners and linkages, hosting a workshop or sponsoring a convention, and how to reach the PAMMRES secretariat."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Linkages & Contact' }]}
      />

      {/* International & Local Partners */}
      <section id="partners" aria-labelledby="partners-title" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="partners-title"
            title="International & Local Partners"
            intro="PAMMRES’s formal affiliation with MMIRA, and MOAs/MOUs with Philippine Higher Education Institutions (HEIs), NGOs, and government agencies."
          />

          <div className="bg-dot-grid mt-10 rounded-2xl border-t-4 border-gold bg-navy p-7 text-white md:p-9">
            <p className="text-sm font-semibold tracking-[0.14em] text-gold-soft uppercase">
              International affiliation
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">
              Mixed Methods International Research Association (MMIRA)
            </p>
            <p className="mt-2 max-w-[44rem] text-base/relaxed text-white/80">
              <span translate="no">PAMMRES</span> is the official Philippine affiliate of MMIRA.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.value} className="mt-12">
              <h3 className="flex items-center gap-4 text-sm font-semibold tracking-[0.14em] text-crimson uppercase after:h-px after:flex-1 after:bg-rule">
                {typeLabel[group.value]}
              </h3>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.partners.map((p) => (
                  <li key={p.id} className="text-base">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={textLink}
                      >
                        {p.name}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="font-semibold text-navy">{p.name}</span>
                    )}
                    {p.short !== p.name && <span className="text-ink-muted"> ({p.short})</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsorship & Advocacy */}
      <section id="partner" aria-labelledby="partner-title" className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            id="partner-title"
            title="Sponsorship & Advocacy"
            intro="For institutions wanting to host a workshop or sponsor conventions."
          />
          <p className="mt-6 text-base/relaxed text-ink-muted">
            Send a message using the form below and choose{' '}
            <strong className="text-navy">“Hosting a workshop or sponsorship”</strong> as the topic.{' '}
            <Placeholder>Sponsorship deck (PDF)</Placeholder>
          </p>
        </div>
      </section>

      {/* Contact & Secretariat */}
      <section id="secretariat" aria-labelledby="secretariat-title" className="bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          {/* Contact details are edited in the admin: Site Settings → Contact */}
          <aside className="lg:sticky lg:top-40 lg:self-start">
            <SectionHeading
              id="secretariat-title"
              title="Contact & Secretariat"
              intro="Questions about membership, chapters, events or working with us? Send a message and an officer will get back to you."
            />
            <dl className="mt-8 space-y-5 text-base">
              <div>
                <dt className="font-semibold text-navy">Official email</dt>
                <dd className="mt-1 text-ink-muted">
                  {contactEmail ? (
                    <a href={`mailto:${contactEmail}`} className={textLink}>
                      {contactEmail}
                    </a>
                  ) : (
                    <Placeholder>contact email</Placeholder>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">Facebook</dt>
                <dd className="mt-1 text-ink-muted">
                  {facebookUrl ? (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={textLink}
                    >
                      PAMMRES on Facebook<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Placeholder>Facebook page link</Placeholder>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">Mailing address</dt>
                <dd className="mt-1 text-ink-muted">
                  {mailingAddress ? (
                    <span className="whitespace-pre-line">{mailingAddress}</span>
                  ) : (
                    <Placeholder>mailing address</Placeholder>
                  )}
                </dd>
              </div>
            </dl>
            <p className="mt-8 max-w-[24rem] text-base/relaxed text-ink-muted">
              Want to join? Read about{' '}
              <Link href={joinHref} className={textLink}>
                membership
              </Link>{' '}
              first.
            </p>
          </aside>

          <div
            id="contact-form"
            className="rounded-2xl border border-rule border-t-4 border-t-crimson bg-white p-6 shadow-sm md:p-10"
          >
            <h3 className="sr-only">Send us a message</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
