import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { joinHref } from '../components/navigation'
import { Placeholder } from '../components/Placeholder'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with PAMMRES about membership, events, regional chapters or partnerships.',
}

const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink'
const linkClass = `rounded-sm font-semibold text-ink underline decoration-ink/25 decoration-2 underline-offset-4 transition-colors duration-150 hover:decoration-crimson motion-reduce:transition-none ${focusRing}`

export default function ContactPage() {
  return (
    <main id="main" className="mx-auto max-w-[1280px] px-3 pb-6 md:px-6">
      <section aria-labelledby="contact-title" className="px-3 pt-14 pb-12 md:px-8 md:pt-24 md:pb-16">
        <h1
          id="contact-title"
          className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.035em]"
        >
          Contact us
        </h1>
        <p className="mt-8 max-w-[40rem] text-xl/relaxed text-pretty md:text-2xl/relaxed">
          Questions about membership, events or working with us? Send a message and an officer
          will get back to you.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-12 border-t border-rule px-3 py-14 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        {/* TODO: replace with PAMMRES's real contact details (also in SiteFooter.tsx) */}
        <aside aria-labelledby="details-title" className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="details-title"
            className="font-display text-2xl leading-none font-bold tracking-[-0.02em] md:text-3xl"
          >
            Other ways to reach us
          </h2>
          <dl className="mt-6 space-y-5 text-base">
            <div>
              <dt className="font-semibold">Email</dt>
              <dd className="mt-1 text-ink-muted">
                <Placeholder>contact email</Placeholder>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Mailing address</dt>
              <dd className="mt-1 text-ink-muted">
                <Placeholder>mailing address</Placeholder>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Social media</dt>
              <dd className="mt-1 text-ink-muted">
                <Placeholder>Facebook or other social links</Placeholder>
              </dd>
            </div>
          </dl>
          <p className="mt-8 max-w-[24rem] text-base/relaxed text-ink-muted">
            Want to join? Read about{' '}
            <Link href={joinHref} className={linkClass}>
              membership
            </Link>{' '}
            first.
          </p>
        </aside>

        <section aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">
            Send us a message
          </h2>
          <ContactForm />
        </section>
      </div>
    </main>
  )
}
