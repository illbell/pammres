import React from 'react'

/**
 * Standard section heading from the website guide: a small uppercase eyebrow tag,
 * a serif heading, and optional intro text.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  as: Heading = 'h2',
  align = 'left',
  tone = 'light',
  className = '',
}: {
  /** id for the heading, so the section can use aria-labelledby */
  id?: string
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
  /** "dark" when placed on a navy or crimson background */
  tone?: 'light' | 'dark'
  className?: string
}) {
  const centered = align === 'center'
  const dark = tone === 'dark'

  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-[48rem] ${className}`}>
      {eyebrow && (
        <p
          className={`mb-3 text-sm font-semibold tracking-[0.14em] uppercase ${
            dark ? 'text-gold-soft' : 'text-crimson'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={`font-display text-3xl leading-tight font-semibold text-balance md:text-[2.75rem] ${
          dark ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </Heading>
      {intro && (
        <p
          className={`mt-4 text-lg/relaxed text-pretty ${centered ? 'mx-auto' : ''} max-w-[40rem] ${
            dark ? 'text-white/80' : 'text-ink-muted'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
