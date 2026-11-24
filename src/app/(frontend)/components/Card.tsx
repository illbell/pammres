import React from 'react'

const accents = {
  navy: 'border-t-navy',
  crimson: 'border-t-crimson',
  gold: 'border-t-gold',
} as const

/**
 * Content card from the website guide: white surface, colored top border
 * (navy by default; crimson for Vision, navy for Mission), optional gold icon,
 * and a gentle lift on hover.
 */
export function Card({
  title,
  eyebrow,
  icon,
  accent = 'navy',
  as: Heading = 'h3',
  hover = true,
  className = '',
  children,
}: {
  title: React.ReactNode
  /** Small label above the title, e.g. "Theme 1" */
  eyebrow?: string
  /** Decorative icon, rendered in gold. Pass an inline SVG using currentColor. */
  icon?: React.ReactNode
  accent?: keyof typeof accents
  as?: 'h2' | 'h3' | 'h4'
  hover?: boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <article
      className={`flex flex-col rounded-xl border border-rule border-t-4 bg-white p-6 shadow-sm md:p-8 ${accents[accent]} ${
        hover
          ? 'transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0'
          : ''
      } ${className}`}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-5 flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold [&>svg]:size-6"
        >
          {icon}
        </div>
      )}
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold tracking-[0.12em] text-crimson uppercase">
          {eyebrow}
        </p>
      )}
      <Heading className="font-display text-2xl leading-snug font-semibold text-balance text-navy">
        {title}
      </Heading>
      {children && <div className="mt-3 text-base/relaxed text-ink-muted">{children}</div>}
    </article>
  )
}
