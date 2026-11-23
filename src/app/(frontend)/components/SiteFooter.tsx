import Link from 'next/link'
import React from 'react'

import { LogoMark } from './LogoMark'
import { membershipHref, navItems } from './navigation'
import { Placeholder } from './Placeholder'

const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink'
const linkClass = `rounded-sm text-ink-muted no-underline transition-colors duration-150 hover:text-ink hover:underline hover:decoration-integrate hover:decoration-2 hover:underline-offset-4 motion-reduce:transition-none ${focusRing}`

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-12 px-6 py-14 md:px-14 md:py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className={`inline-flex items-center gap-3 rounded-lg no-underline ${focusRing}`}>
            <LogoMark className="size-10" />
            <span className="font-display text-2xl font-bold tracking-[-0.01em]" translate="no">
              PAMMRES
            </span>
          </Link>
          <p className="mt-5 max-w-[26rem] text-base/relaxed text-pretty text-ink-muted">
            Philippine Association of Mixed Methods Researchers &amp; Emergent Scholars. A
            community for researchers who combine qualitative and quantitative methods.
          </p>
          <Link
            href={membershipHref}
            className={`mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-base font-semibold text-ground no-underline transition-colors duration-150 hover:bg-ink/85 motion-reduce:transition-none ${focusRing}`}
          >
            Become a member
          </Link>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-base font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-base">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* TODO: replace with PAMMRES's real contact details */}
        <div>
          <h2 className="text-base font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-2.5 text-base text-ink-muted">
            <li>
              <Placeholder>contact email</Placeholder>
            </li>
            <li>
              <Placeholder>mailing address</Placeholder>
            </li>
            <li>
              <Placeholder>Facebook or other social links</Placeholder>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-6 text-sm text-ink-muted md:px-14">
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
