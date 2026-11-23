import React from 'react'

/** Small mark: two strands meeting in one line, echoing the hero diagram. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path d="M7 10 L16 16" className="stroke-quan" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M7 22 C10 19, 12 20, 16 16"
        className="fill-none stroke-qual"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M16 16 L25 16" className="stroke-integrate" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
