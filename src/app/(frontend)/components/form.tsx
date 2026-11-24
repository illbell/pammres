'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'

// Shared building blocks for the site's forms (contact, membership application).

export const formFocusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy'

export const inputClass = `block w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 transition-colors duration-150 hover:border-navy/40 aria-invalid:border-error aria-invalid:bg-error/5 motion-reduce:transition-none ${formFocusRing}`

/** Props that wire an input to its error message. */
export function errorProps(name: string, error?: string) {
  return error ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` } : {}
}

export function Field({
  name,
  label,
  hint,
  optional,
  error,
  children,
}: {
  name: string
  label: string
  hint?: React.ReactNode
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-base font-semibold text-navy">
        {label}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-base text-error">
          {error}
        </p>
      )}
    </div>
  )
}

/** Native select styled like the text inputs, with a chevron. */
export function Select({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${inputClass} appearance-none pr-11 ${className}`}>
        {children}
      </select>
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 fill-none stroke-navy"
      >
        <path
          d="M5.5 7.5l4.5 4.5 4.5-4.5"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

/** Form-level error, announced to screen readers. */
export function FormAlert({ message }: { message?: string }) {
  return (
    <p aria-live="polite" className="empty:hidden">
      {message && (
        <span className="block rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-base text-error">
          {message}
        </span>
      )}
    </p>
  )
}

/** Hidden field for spam bots: hidden from people and assistive technology. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-3 rounded-full bg-crimson px-7 py-3.5 font-semibold text-white transition-colors duration-150 hover:bg-crimson-hover disabled:cursor-wait disabled:opacity-80 motion-reduce:transition-none ${formFocusRing}`}
    >
      {pending && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
        />
      )}
      {pending ? pendingLabel : label}
    </button>
  )
}
