import React from 'react'

/**
 * Marks text that still needs real content from PAMMRES. Deliberately
 * conspicuous so nothing ships with a placeholder by accident; search the
 * codebase for <Placeholder> to find every one.
 */
export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-sm bg-gold-soft px-1 text-ink outline-1 outline-gold outline-dashed">
      [{children}]
    </mark>
  )
}
