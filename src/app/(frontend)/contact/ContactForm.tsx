'use client'

import React, { useActionState, useEffect, useRef } from 'react'

import { contactTopics } from '@/collections/ContactMessages'

import {
  Field,
  FormAlert,
  Honeypot,
  Select,
  SubmitButton,
  errorProps,
  formFocusRing,
  inputClass,
} from '../components/form'
import { submitContactMessage, type ContactField, type ContactFormState } from './actions'

const initialState: ContactFormState = { status: 'idle' }
const FIELD_ORDER: ContactField[] = ['name', 'email', 'affiliation', 'topic', 'message']

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const errors = state.errors ?? {}
  const values = state.values ?? {}
  const a11y = (name: ContactField) => errorProps(name, errors[name])

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
          className={`mt-6 inline-block rounded-sm font-semibold text-ink underline decoration-ink/25 decoration-2 underline-offset-4 hover:decoration-crimson ${formFocusRing}`}
        >
          Send another message
        </a>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <FormAlert message={state.status === 'error' ? state.message : undefined} />

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

      <Field
        name="affiliation"
        label="University or organization"
        optional
        error={errors.affiliation}
      >
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
        <Select id="topic" name="topic" defaultValue={values.topic ?? 'general'} {...a11y('topic')}>
          {contactTopics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
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

      <Honeypot />

      <SubmitButton label="Send message" pendingLabel="Sending…" />
    </form>
  )
}
