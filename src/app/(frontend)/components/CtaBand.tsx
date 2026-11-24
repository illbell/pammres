import Link from 'next/link'
import React from 'react'

import { buttonGold, buttonOutlineOnDark } from './ui'

export type CtaAction = { label: string; href: string }

/**
 * Crimson call-to-action band with a gold accent (pre-footer and page closings
 * in the website guide). The first action is the primary (gold) button.
 */
export function CtaBand({
  id,
  title,
  body,
  primary,
  secondary,
}: {
  id: string
  title: React.ReactNode
  body?: React.ReactNode
  primary: CtaAction
  secondary?: CtaAction
}) {
  const titleId = `${id}-title`

  return (
    <section aria-labelledby={titleId} className="border-t-4 border-gold bg-crimson text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center md:px-6 md:py-20">
        <h2
          id={titleId}
          className="mx-auto max-w-[24ch] font-display text-3xl leading-tight font-semibold text-balance md:text-[2.75rem]"
        >
          {title}
        </h2>
        {body && (
          <p className="mx-auto mt-5 max-w-[40rem] text-lg/relaxed text-pretty text-white/85">
            {body}
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href={primary.href} className={buttonGold}>
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className={buttonOutlineOnDark}>
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
