import React from 'react'

/**
 * Two-column section: heading on the left (stays in view on desktop),
 * content on the right. Stacks on smaller screens.
 */
export function SplitSection({
  id,
  title,
  intro,
  children,
}: {
  id: string
  title: string
  intro?: React.ReactNode
  children: React.ReactNode
}) {
  const titleId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid scroll-mt-20 grid-cols-1 gap-8 border-t border-rule px-3 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2
          id={titleId}
          className="font-display text-3xl leading-none font-bold tracking-[-0.03em] text-balance md:text-4xl"
        >
          {title}
        </h2>
        {intro && (
          <p className="mt-4 max-w-[28rem] text-lg/relaxed text-pretty text-ink-muted">{intro}</p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
