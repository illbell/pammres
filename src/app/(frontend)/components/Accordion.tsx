import React from 'react'

export type AccordionItem = {
  id: string
  title: React.ReactNode
  content: React.ReactNode
}

/**
 * Collapsible panels built on native <details>/<summary>: keyboard and
 * screen-reader support with no client JavaScript. Used for the founding &
 * governance archive on the About page.
 */
export function Accordion({
  items,
  name,
  defaultOpenId,
}: {
  items: AccordionItem[]
  /** Give a name to allow only one panel open at a time */
  name?: string
  defaultOpenId?: string
}) {
  return (
    <div className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-white">
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          name={name}
          open={item.id === defaultOpenId}
          className="group"
        >
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-xl font-semibold text-navy transition-colors duration-150 hover:bg-cream motion-reduce:transition-none md:px-8 [&::-webkit-details-marker]:hidden focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-navy`}
          >
            <span>{item.title}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="size-5 shrink-0 text-gold transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            >
              <path
                d="M5 7.5 L10 12.5 L15 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <div className="px-6 pb-6 text-base/relaxed text-ink-muted md:px-8">{item.content}</div>
        </details>
      ))}
    </div>
  )
}
