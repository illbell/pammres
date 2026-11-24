'use client'

import React, { useActionState, useEffect, useRef } from 'react'

import {
  memberRegions,
  membershipCategories,
  paymentMethods,
} from '@/collections/MembershipApplications'

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
import {
  submitMembershipApplication,
  type ApplicationField,
  type ApplicationFormState,
} from './actions'

const initialState: ApplicationFormState = { status: 'idle' }
const FIELD_ORDER: ApplicationField[] = [
  'name',
  'email',
  'phone',
  'category',
  'region',
  'institution',
  'position',
  'discipline',
  'paymentMethod',
  'paymentReference',
  'notes',
  'privacyConsent',
]

export function MembershipForm() {
  const [state, formAction] = useActionState(submitMembershipApplication, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const errors = state.errors ?? {}
  const values = state.values ?? {}
  const a11y = (name: ApplicationField) => errorProps(name, errors[name])

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
        <h3 className="font-display text-2xl font-semibold text-navy">Application received</h3>
        <p className="mt-3 text-lg/relaxed text-pretty text-ink-muted">
          Thank you for applying to <span translate="no">PAMMRES</span>. The secretariat will verify
          your details and payment, then write to{' '}
          <span className="font-semibold text-navy">{values.email}</span>.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <FormAlert message={state.status === 'error' ? state.message : undefined} />

      <fieldset className="space-y-6">
        <legend className="mb-4 font-display text-xl font-semibold text-navy">About you</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field name="name" label="Full name" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={160}
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
          <Field name="phone" label="Mobile number" optional error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
              placeholder="09XX XXX XXXX…"
              defaultValue={values.phone}
              className={inputClass}
              {...a11y('phone')}
            />
          </Field>
          <Field name="region" label="Region" error={errors.region}>
            <Select
              id="region"
              name="region"
              defaultValue={values.region ?? ''}
              {...a11y('region')}
            >
              <option value="" disabled>
                Choose your region…
              </option>
              {memberRegions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field name="institution" label="Institution or organization" error={errors.institution}>
            <input
              id="institution"
              name="institution"
              type="text"
              autoComplete="organization"
              required
              maxLength={200}
              defaultValue={values.institution}
              className={inputClass}
              {...a11y('institution')}
            />
          </Field>
          <Field name="position" label="Position or program" optional error={errors.position}>
            <input
              id="position"
              name="position"
              type="text"
              autoComplete="organization-title"
              maxLength={160}
              placeholder="e.g. Associate Professor, PhD student…"
              defaultValue={values.position}
              className={inputClass}
              {...a11y('position')}
            />
          </Field>
        </div>
        <Field
          name="discipline"
          label="Discipline and research interests"
          optional
          hint="Helps us match mentors and form Research Interest Groups."
          error={errors.discipline}
        >
          <input
            id="discipline"
            name="discipline"
            type="text"
            maxLength={300}
            defaultValue={values.discipline}
            className={inputClass}
            {...a11y('discipline')}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-6 border-t border-rule pt-8">
        <legend className="mb-4 font-display text-xl font-semibold text-navy">
          Membership and payment
        </legend>
        <Field name="category" label="Membership category" error={errors.category}>
          <Select
            id="category"
            name="category"
            defaultValue={values.category ?? ''}
            {...a11y('category')}
          >
            <option value="" disabled>
              Choose a category…
            </option>
            {membershipCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field name="paymentMethod" label="How did you pay?" error={errors.paymentMethod}>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              defaultValue={values.paymentMethod ?? 'not-yet'}
              {...a11y('paymentMethod')}
            >
              {paymentMethods.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            name="paymentReference"
            label="Payment reference number"
            optional
            hint="Required if you’ve already paid."
            error={errors.paymentReference}
          >
            <input
              id="paymentReference"
              name="paymentReference"
              type="text"
              maxLength={100}
              autoComplete="off"
              defaultValue={values.paymentReference}
              className={inputClass}
              {...a11y('paymentReference')}
            />
          </Field>
        </div>
        <Field name="notes" label="Anything else we should know?" optional error={errors.notes}>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={3000}
            defaultValue={values.notes}
            className={`${inputClass} resize-y`}
            {...a11y('notes')}
          />
        </Field>
      </fieldset>

      {/* TODO: have PAMMRES review this consent wording and link a privacy notice. */}
      <div>
        <div className="flex items-start gap-3">
          <input
            id="privacyConsent"
            name="privacyConsent"
            type="checkbox"
            required
            defaultChecked={values.privacyConsent === 'on'}
            className={`mt-1 size-5 shrink-0 accent-crimson ${formFocusRing}`}
            {...a11y('privacyConsent')}
          />
          <label htmlFor="privacyConsent" className="text-base/relaxed text-ink-muted">
            I consent to <span translate="no">PAMMRES</span> collecting and processing the
            information above to evaluate my membership application and contact me about it, in line
            with the Data Privacy Act of 2012 (RA 10173).
          </label>
        </div>
        {errors.privacyConsent && (
          <p id="privacyConsent-error" className="mt-2 text-base text-error">
            {errors.privacyConsent}
          </p>
        )}
      </div>

      <Honeypot />
      <SubmitButton label="Submit application" pendingLabel="Submitting…" />
    </form>
  )
}
