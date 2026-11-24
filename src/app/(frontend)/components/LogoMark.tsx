import React from 'react'

/**
 * Interim emblem: red and blue cyclical arrows around a white triangle (Q+Q),
 * in the shape of the PAMMRES logo.
 * TODO: replace with the official emblem artwork (SVG preferred) once PAMMRES supplies it.
 */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-navy" />
      {/* Red arrow, over the top */}
      <path
        d="M6 16 A10 10 0 0 1 26 16 M23.4 13.6 L26 16.6 L28.6 13.6"
        className="fill-none stroke-crimson"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Blue arrow, around the bottom */}
      <path
        d="M26 16 A10 10 0 0 1 6 16 M3.4 18.4 L6 15.4 L8.6 18.4"
        className="fill-none stroke-[#5b8fd6]"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Triangulation (Q+Q) */}
      <path d="M16 10.5 L21 19.5 L11 19.5 Z" className="fill-white" />
    </svg>
  )
}
