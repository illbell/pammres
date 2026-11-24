'use client'

import React, { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

import { contactTopics } from '@/collections/ContactMessages'

import { submitContactMessage, type ContactField, type ContactFormState } from './actions'

const initialState: ContactFormState = { status: 'idle' }
const FIELD_ORDER: ContactField[] = ['name', 'email', 'affiliation', 'topic', 'message']

const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink'
const inputClass = `block w-full rounded-xl border border-ink/20 bg-white/70 px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 transition-colors duration-150 hover:border-ink/40 aria-invalid:border-error aria-invalid:bg-error/5 motion-reduce:transition-none ${focusRing}`

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-semibold text-ground transition-colors duration-150 hover:bg-ink/85 disabled:cursor-wait disabled:opacity-80 motion-reduce:transition-none ${focusRing}`}
    >
      {pending && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-ground/40 border-t-ground motion-reduce:animate-none"
        />
      )}
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

function Field({
  name,
  label,
  optional,
  error,
  children,
}: {
  name: ContactField
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-base font-semibold">
        {label}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-base text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const errors = state.errors ?? {}
  const values = state.values ?? {}
  const a11y = (name: ContactField) =>
    errors[name]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` }
      : {}

  // After a failed submit, move focus to the first field with an error.
  useEffect(() => {
    if (state.status === 'error' && state.errors) {
      const first = FIELD_ORDER.find((f) => state.errors?.[f])
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
    }
    if (state.status === 'success') successRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-gold/60 bg-cream px-6 py-10 outline-none md:px-10"
      >
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">Message sent</h2>
        <p className="mt-3 text-lg/relaxed text-pretty text-ink-muted">
          Thanks for getting in touch. We’ll reply to{' '}
          <span className="font-semibold text-ink">{values.email}</span>.
        </p>
        <a
          href="/contact"
          className={`mt-6 inline-block rounded-sm font-semibold text-ink underline decoration-ink/25 decoration-2 underline-offset-4 hover:decoration-crimson ${focusRing}`}
        >
          Send another message
        </a>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <p aria-live="polite" className="empty:hidden">
        {state.status === 'error' && state.message && (
          <span className="block rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-base text-error">
            {state.message}
          </span>
        )}
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={values.name}
            className={inputClass}
            {...a11y('name')}
          />
        </Field>
        <Field name="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            placeholder="name@example.com…"
            defaultValue={values.email}
            className={inputClass}
            {...a11y('email')}
          />
        </Field>
      </div>

      <Field name="affiliation" label="University or organization" optional error={errors.affiliation}>
        <input
          id="affiliation"
          name="affiliation"
          type="text"
          autoComplete="organization"
          maxLength={200}
          defaultValue={values.affiliation}
          className={inputClass}
          {...a11y('affiliation')}
        />
      </Field>

      <Field name="topic" label="What is this about?" error={errors.topic}>
        <div className="relative">
          <select
            id="topic"
            name="topic"
            defaultValue={values.topic ?? 'general'}
            className={`${inputClass} appearance-none pr-11`}
            {...a11y('topic')}
          >
            {contactTopics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 fill-none stroke-ink"
          >
            <path d="M5.5 7.5l4.5 4.5 4.5-4.5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Field>

      <Field name="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          maxLength={5000}
          defaultValue={values.message}
          className={`${inputClass} resize-y`}
          {...a11y('message')}
        />
      </Field>

      {/* Honeypot for spam bots: hidden from people and assistive technology */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
    </form>
  )
}
