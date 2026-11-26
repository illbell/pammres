import Link from 'next/link'
import React from 'react'

import { LogoMark } from './LogoMark'
import {
  contactHref,
  footerProgramLinks,
  footerQuickLinks,
  type NavLink,
} from './navigation'
import { getSiteSettings } from '../data/cms'
import { Placeholder } from './Placeholder'
import { focusRingOnDark } from './ui'

const linkClass = `rounded-sm text-white/75 no-underline transition-colors duration-150 hover:text-white hover:underline hover:decoration-gold hover:decoration-2 hover:underline-offset-4 motion-reduce:transition-none ${focusRingOnDark}`

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold tracking-[0.12em] text-gold-soft uppercase">{title}</h2>
      <ul className="mt-5 space-y-3 text-base">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Four-column footer from the website guide, on deep navy. */
export async function SiteFooter() {
  const { contactEmail, facebookUrl } = await getSiteSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-navy-deep text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-x-10 gap-y-12 px-6 py-16 sm:grid-cols-2 md:px-10 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:py-20">
        {/* Col 1: logo, short mission, Facebook */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className={`inline-flex items-center gap-3 rounded-lg no-underline ${focusRingOnDark}`}
          >
            <LogoMark className="size-12" />
            <span className="font-display text-2xl font-bold text-white" translate="no">
              PAMMRES
            </span>
          </Link>
          <p className="mt-3 text-sm text-white/60">
            Philippine Association of Mixed Methods Researchers and Emergent Scholars · Official
            Philippine Affiliate of MMIRA
          </p>
          <p className="mt-5 max-w-[26rem] text-base/relaxed text-pretty text-white/80">
            An engaged, interdisciplinary community of Filipino practitioner-scholars, educators,
            and emergent researchers advancing quality research education and evidence-based
            nation-building.
          </p>
          <p className="mt-6">
            {facebookUrl ? (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 ${linkClass}`}
              >
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                  <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
                </svg>
                PAMMRES on Facebook
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <Placeholder>Facebook page link</Placeholder>
            )}
          </p>
        </div>

        {/* Col 2 and 3 */}
        <FooterColumn title="Quick Links" links={footerQuickLinks} />
        <FooterColumn title="Programs" links={footerProgramLinks} />

        {/* Col 4: Contact Secretariat */}
        <div>
          <h2 className="text-sm font-semibold tracking-[0.12em] text-gold-soft uppercase">
            Contact Secretariat
          </h2>
          <ul className="mt-5 space-y-3 text-base text-white/75">
            <li>
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} className={linkClass}>
                  {contactEmail}
                </a>
              ) : (
                <Placeholder>official email</Placeholder>
              )}
            </li>
            <li>
              <Link href={contactHref} className={linkClass}>
                Send an inquiry
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-6 text-sm text-white/60 md:px-10">
          <p>
            © {year} <span translate="no">PAMMRES</span>. All rights reserved.
          </p>
          {/* Plain <a>: the admin panel is a separate app, not a client-side route */}
          <a href="/admin" className={linkClass}>
            Editor login
          </a>
        </div>
      </div>
    </footer>
  )
}
