import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { focusRingOnDark } from './ui'

export type Crumb = { label: string; href?: string }

/**
 * Background photo for each section's page header (real PAMMRES photos in
 * /public/images). Change a section's photo here; pages pick one by key.
 */
const headerImages = {
  default: '/images/hero-img.webp',
  about: '/images/members-8.webp',
  membership: '/images/members-7.webp',
  events: '/images/workshop-5.webp',
  news: '/images/workshop-4.webp',
  resources: '/images/value-4.webp',
  members: '/images/members-4.webp',
  contact: '/images/workshop-1.jpg',
  affiliates: '/images/members-1.webp',
} as const

export type PageHeaderImage = keyof typeof headerImages

/**
 * Inner-page hero from the website guide: a full-width navy banner with a gold
 * bottom rule, centered white title, and a breadcrumb trail (e.g. Home / About Us).
 * A section photo sits under a navy overlay so the white text stays readable.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  image = 'default',
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** The last crumb is the current page and should have no href */
  breadcrumbs: Crumb[]
  /** Which section photo to show behind the title */
  image?: PageHeaderImage
}) {
  return (
    <header className="relative isolate overflow-hidden border-b-4 border-gold bg-navy text-white">
      {/* Decorative: the title says what the page is */}
      <Image
        src={headerImages[image]}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-navy-deep/85 via-navy/80 to-navy-deep/90"
      />
      <div className="mx-auto max-w-[1280px] px-4 pt-8 pb-16 text-center md:px-6 md:pt-10 md:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-white/70">
            {breadcrumbs.map((crumb, i) => {
              const last = i === breadcrumbs.length - 1
              return (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-x-2">
                  {crumb.href && !last ? (
                    <Link
                      href={crumb.href}
                      className={`rounded-sm text-white/80 no-underline hover:text-white hover:underline ${focusRingOnDark}`}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={last ? 'page' : undefined} className="text-white">
                      {crumb.label}
                    </span>
                  )}
                  {!last && <span aria-hidden="true">/</span>}
                </li>
              )
            })}
          </ol>
        </nav>

        {eyebrow && (
          <p className="mt-10 text-sm font-semibold tracking-[0.14em] text-gold-soft uppercase md:mt-14">
            {eyebrow}
          </p>
        )}
        <h1
          className={`${eyebrow ? 'mt-3' : 'mt-10 md:mt-14'} font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.05] font-semibold text-balance`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-[42rem] text-lg/relaxed text-pretty text-white/80 md:text-xl/relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
}
