'use client'

import Link from 'next/link'
import React, { useActionState, useEffect, useRef, useState } from 'react'

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
import { textLink } from '../components/ui'
import { ReceiptPreview } from './ReceiptPreview'
import { logIn, renewMembership, saveProfileStep, signUp, type MemberFormState } from './actions'

const initial: MemberFormState = { status: 'idle' }

type Option = { label: string; value: string }

/** Wires a form to a server action and moves focus to the first field with an error. */
function useMemberForm(
  action: (prev: MemberFormState, fd: FormData) => Promise<MemberFormState>,
) {
  const [state, formAction] = useActionState(action, initial)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status !== 'error') return
    const firstError = Object.keys(state.errors ?? {})[0]
    const target = firstError
      ? formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)
      : null
    target?.focus()
  }, [state])

  const errors = state.errors ?? {}
  return {
    state,
    formAction,
    formRef,
    errors,
    a11y: (name: string) => errorProps(name, errors[name]),
    /** Value to show: what was just submitted, else the saved value. */
    val: (name: string, saved?: string | number | null) => {
      const v = state.values?.[name]
      return typeof v === 'string' ? v : saved == null ? '' : String(saved)
    },
  }
}

function TextInput({
  name,
  defaultValue,
  a11y,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  a11y: ReturnType<typeof errorProps>
}) {
  // key resets the uncontrolled input when a failed submit returns new values
  return (
    <input
      key={String(defaultValue)}
      id={name}
      name={name}
      defaultValue={defaultValue}
      className={inputClass}
      {...a11y}
      {...props}
    />
  )
}

/* ------------------------------------ Sign up ------------------------------------ */

export function SignUpForm() {
  const { state, formAction, formRef, errors, a11y, val } = useMemberForm(signUp)

  return (
    <form ref={formRef} action={formAction} noValidate className="relative space-y-6">
      <Honeypot />
      <FormAlert message={state.message} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="firstName" label="First name" error={errors.firstName}>
          <TextInput name="firstName" autoComplete="given-name" defaultValue={val('firstName')} a11y={a11y('firstName')} />
        </Field>
        <Field name="lastName" label="Last name" error={errors.lastName}>
          <TextInput name="lastName" autoComplete="family-name" defaultValue={val('lastName')} a11y={a11y('lastName')} />
        </Field>
      </div>
      <Field name="email" label="Email address" error={errors.email} hint="You’ll use this to log in.">
        <TextInput name="email" type="email" autoComplete="email" spellCheck={false} defaultValue={val('email')} a11y={a11y('email')} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="password" label="Password" error={errors.password} hint="At least 8 characters.">
          <TextInput name="password" type="password" autoComplete="new-password" a11y={a11y('password')} />
        </Field>
        <Field name="confirmPassword" label="Confirm password" error={errors.confirmPassword} hint="Type it again to check.">
          <TextInput name="confirmPassword" type="password" autoComplete="new-password" a11y={a11y('confirmPassword')} />
        </Field>
      </div>
      <div>
        <label className="flex items-start gap-3 text-base text-ink">
          <input
            type="checkbox"
            name="privacyConsent"
            defaultChecked={val('privacyConsent') === 'on'}
            className={`mt-1 size-5 shrink-0 accent-crimson ${formFocusRing}`}
            {...a11y('privacyConsent')}
          />
          <span>
            I consent to PAMMRES collecting and processing my personal data for membership, in
            accordance with the Data Privacy Act of 2012 (RA 10173).
          </span>
        </label>
        {errors.privacyConsent && (
          <p id="privacyConsent-error" className="mt-2 text-base text-error">
            {errors.privacyConsent}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <SubmitButton label="Create account" pendingLabel="Creating account…" />
        <p className="text-base text-ink-muted">
          Already a member?{' '}
          <Link href="/login" className={textLink}>
            Log in
          </Link>
        </p>
      </div>
    </form>
  )
}

/* ------------------------------------ Log in ------------------------------------ */

export function LoginForm({ next }: { next: string }) {
  const { state, formAction, formRef, errors, a11y, val } = useMemberForm(logIn)

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <input type="hidden" name="next" value={next} />
      <FormAlert message={state.message} />
      <Field name="email" label="Email address" error={errors.email}>
        <TextInput name="email" type="email" autoComplete="email" spellCheck={false} defaultValue={val('email')} a11y={a11y('email')} />
      </Field>
      <Field name="password" label="Password" error={errors.password}>
        <TextInput name="password" type="password" autoComplete="current-password" a11y={a11y('password')} />
      </Field>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <SubmitButton label="Log in" pendingLabel="Logging in…" />
        <Link href="/contact" className={textLink}>
          Forgot password? Contact the secretariat
        </Link>
      </div>
    </form>
  )
}

/* ------------------------------------ Profile steps ------------------------------------ */

/** Saved values for a step, flattened like the form field names (e.g. "publishedResearch.title"). */
export type StepDefaults = Record<string, string | string[] | number | null | undefined>

function ResearchFields({
  prefix,
  defaults,
  designs,
  form,
}: {
  prefix: string
  defaults: StepDefaults
  designs: Option[]
  form: ReturnType<typeof useMemberForm>
}) {
  const { errors, a11y, val } = form
  const n = (f: string) => `${prefix}.${f}`
  const d = (f: string) => defaults[n(f)] as string | null | undefined
  return (
    <div className="space-y-6">
      <Field name={n('title')} label="Title" error={errors[n('title')]}>
        <textarea
          key={val(n('title'), d('title'))}
          id={n('title')}
          name={n('title')}
          rows={3}
          defaultValue={val(n('title'), d('title'))}
          className={inputClass}
          {...a11y(n('title'))}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-[8rem_1fr]">
        <Field name={n('year')} label="Year" error={errors[n('year')]}>
          <TextInput name={n('year')} inputMode="numeric" maxLength={4} placeholder="2025" defaultValue={val(n('year'), d('year'))} a11y={a11y(n('year'))} />
        </Field>
        <Field name={n('publisher')} label="Publisher" error={errors[n('publisher')]}>
          <TextInput name={n('publisher')} defaultValue={val(n('publisher'), d('publisher'))} a11y={a11y(n('publisher'))} />
        </Field>
      </div>
      <Field name={n('design')} label="Research design used" error={errors[n('design')]}>
        <Select key={val(n('design'), d('design'))} id={n('design')} name={n('design')} defaultValue={val(n('design'), d('design'))} {...a11y(n('design'))}>
          <option value="">Choose a design…</option>
          {designs.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  )
}

type PaymentOptions = { categories: (Option & { fee: string })[]; payments: Option[] }

/** Receipt already on file: a link for the member to check it. */
export type ReceiptOnFile = { url: string; filename: string; mimeType?: string | null } | null

/**
 * Receipt file input with a live preview of the chosen file (before upload),
 * and a preview of the receipt already on file.
 */
function ReceiptInput({
  existing,
  a11y,
}: {
  existing: ReceiptOnFile
  a11y: ReturnType<typeof errorProps>
}) {
  const [chosen, setChosen] = useState<{ url: string; type: string; name: string } | null>(null)

  // Free the temporary preview URL when it's replaced or the form goes away.
  useEffect(() => () => {
    if (chosen) URL.revokeObjectURL(chosen.url)
  }, [chosen])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setChosen(file ? { url: URL.createObjectURL(file), type: file.type, name: file.name } : null)
  }

  return (
    <div className="space-y-4">
      {chosen ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-navy">
            Preview: {chosen.name} <span className="font-normal text-ink-muted">(not sent yet)</span>
          </p>
          <ReceiptPreview url={chosen.url} mimeType={chosen.type} label={`Preview of ${chosen.name}`} openLink={false} />
        </div>
      ) : (
        existing && (
          <div>
            <p className="mb-2 text-sm font-semibold text-navy">Receipt on file</p>
            <ReceiptPreview url={existing.url} mimeType={existing.mimeType} label="Your payment receipt on file" />
          </div>
        )
      )}
      <input
        id="receipt"
        name="receipt"
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={onChange}
        className={`block text-base text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2.5 file:font-semibold file:text-white hover:file:bg-navy-soft ${formFocusRing}`}
        {...a11y}
      />
    </div>
  )
}

/** Category, payment method, reference and receipt upload (profile step 4 and renewal). */
function PaymentFields({
  form,
  defaults,
  options,
  receipt,
}: {
  form: ReturnType<typeof useMemberForm>
  defaults: StepDefaults
  options: PaymentOptions
  receipt: ReceiptOnFile
}) {
  const { errors, a11y, val } = form
  const d = (f: string) => defaults[f] as string | number | null | undefined
  return (
    <div className="space-y-6">
          <fieldset aria-describedby={errors.category ? 'category-error' : undefined}>
            <legend className="text-base font-semibold text-navy">Membership category</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {options.categories.map((o) => (
                <label key={o.value} className="flex cursor-pointer flex-col gap-1 rounded-xl border border-rule px-4 py-4 text-base text-ink has-checked:border-crimson has-checked:bg-cream">
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      value={o.value}
                      defaultChecked={val('category', d('category')) === o.value}
                      className={`size-5 shrink-0 accent-crimson ${formFocusRing}`}
                    />
                    <span className="font-semibold text-navy">{o.label}</span>
                  </span>
                  <span className="pl-8 font-display text-2xl font-semibold text-crimson">{o.fee}</span>
                </label>
              ))}
            </div>
            {errors.category && (
              <p id="category-error" className="mt-2 text-base text-error">
                {errors.category}
              </p>
            )}
          </fieldset>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="paymentMethod" label="How did you pay?" error={errors.paymentMethod}>
              <Select key={val('paymentMethod', d('paymentMethod'))} id="paymentMethod" name="paymentMethod" defaultValue={val('paymentMethod', d('paymentMethod'))} {...a11y('paymentMethod')}>
                <option value="">Choose…</option>
                {options.payments.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field name="paymentReference" label="Payment reference no." error={errors.paymentReference} hint="From your GCash or bank receipt.">
              <TextInput name="paymentReference" defaultValue={val('paymentReference', d('paymentReference'))} a11y={a11y('paymentReference')} />
            </Field>
          </div>
              <Field
        name="receipt"
        label="Payment receipt"
        optional={Boolean(receipt)}
        hint={
          receipt
            ? 'Upload a new file only if you want to replace the one on file.'
            : 'A photo or screenshot of your GCash or bank receipt (JPG, PNG, WebP) or a PDF, up to 5 MB. Only you and the secretariat can see it.'
        }
        error={errors.receipt}
      >
        <ReceiptInput existing={receipt} a11y={a11y('receipt')} />
      </Field>
    </div>
  )
}

/* ------------------------------------ Renewal ------------------------------------ */

export function RenewForm({
  defaults,
  options,
}: {
  defaults: StepDefaults
  options: PaymentOptions
}) {
  const form = useMemberForm(renewMembership)
  const { state, formAction, formRef } = form
  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-8">
      <FormAlert message={state.message} />
      <PaymentFields form={form} defaults={defaults} options={options} receipt={null} />
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
        <Link href="/member" className={textLink}>
          ← My account
        </Link>
        <SubmitButton label="Send renewal" pendingLabel="Sending…" />
      </div>
    </form>
  )
}

export function ProfileStepForm({
  step,
  totalSteps,
  defaults,
  email,
  options,
  submitLabel,
  photoUrl,
  receipt = null,
}: {
  step: number
  totalSteps: number
  defaults: StepDefaults
  email: string
  options: { designs: Option[]; interests: Option[]; categories: (Option & { fee: string })[]; payments: Option[] }
  submitLabel: string
  photoUrl?: string | null
  receipt?: ReceiptOnFile
}) {
  const form = useMemberForm(saveProfileStep)
  const { state, formAction, formRef, errors, a11y, val } = form
  const d = (f: string) => defaults[f] as string | number | null | undefined

  const savedInterests = Array.isArray(state.values?.researchInterests)
    ? (state.values.researchInterests as string[])
    : ((defaults.researchInterests as string[] | undefined) ?? [])

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-8">
      <input type="hidden" name="step" value={step} />
      <FormAlert message={state.message} />

      {step === 1 && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Field name="firstName" label="First name" error={errors.firstName}>
              <TextInput name="firstName" autoComplete="given-name" defaultValue={val('firstName', d('firstName'))} a11y={a11y('firstName')} />
            </Field>
            <Field name="middleName" label="Middle name" optional error={errors.middleName}>
              <TextInput name="middleName" autoComplete="additional-name" defaultValue={val('middleName', d('middleName'))} a11y={a11y('middleName')} />
            </Field>
            <Field name="lastName" label="Last name" error={errors.lastName}>
              <TextInput name="lastName" autoComplete="family-name" defaultValue={val('lastName', d('lastName'))} a11y={a11y('lastName')} />
            </Field>
          </div>
          <Field name="homeAddress" label="Home address" error={errors.homeAddress}>
            <TextInput name="homeAddress" autoComplete="street-address" defaultValue={val('homeAddress', d('homeAddress'))} a11y={a11y('homeAddress')} />
          </Field>
          <div>
            <p className="block text-base font-semibold text-navy">Email address</p>
            <p className="mt-2 rounded-xl border border-rule bg-cream px-4 py-3 text-base text-ink-muted">
              {email}
            </p>
            <p className="mt-1 text-sm text-ink-muted">From your account. Contact the secretariat to change it.</p>
          </div>
          <Field name="institution" label="HEI / institution affiliated with" error={errors.institution}>
            <TextInput name="institution" autoComplete="organization" defaultValue={val('institution', d('institution'))} a11y={a11y('institution')} />
          </Field>
          <Field
            name="highestEducation"
            label="Highest educational attainment"
            hint="Include your field of specialization, e.g. PhD in Educational Leadership."
            error={errors.highestEducation}
          >
            <TextInput name="highestEducation" defaultValue={val('highestEducation', d('highestEducation'))} a11y={a11y('highestEducation')} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <fieldset className="space-y-6">
          <legend className="text-base text-ink-muted">
            Your most recent <strong className="text-navy">published</strong> research. Leave it
            blank if you have none yet.
          </legend>
          <ResearchFields prefix="publishedResearch" defaults={defaults} designs={options.designs} form={form} />
        </fieldset>
      )}

      {step === 3 && (
        <>
          <fieldset className="space-y-6">
            <legend className="text-base text-ink-muted">
              Your most recent <strong className="text-navy">unpublished</strong> research. Leave
              it blank if you have none.
            </legend>
            <ResearchFields prefix="unpublishedResearch" defaults={defaults} designs={options.designs} form={form} />
          </fieldset>
          <fieldset aria-describedby={errors.researchInterests ? 'researchInterests-error' : undefined}>
            <legend className="text-base font-semibold text-navy">
              Research interests <span className="font-normal text-ink-muted">(choose any)</span>
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {options.interests.map((o) => (
                <label key={o.value} className="flex items-center gap-3 rounded-xl border border-rule px-4 py-3 text-base text-ink has-checked:border-navy has-checked:bg-cream">
                  <input
                    type="checkbox"
                    name="researchInterests"
                    value={o.value}
                    defaultChecked={savedInterests.includes(o.value)}
                    className={`size-5 shrink-0 accent-crimson ${formFocusRing}`}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            {errors.researchInterests && (
              <p id="researchInterests-error" className="mt-2 text-base text-error">
                {errors.researchInterests}
              </p>
            )}
          </fieldset>
          <div className="grid gap-6 sm:grid-cols-[12rem_1fr]">
            <Field name="yearsResearching" label="Years doing research" optional error={errors.yearsResearching}>
              <TextInput name="yearsResearching" inputMode="numeric" maxLength={2} defaultValue={val('yearsResearching', d('yearsResearching'))} a11y={a11y('yearsResearching')} />
            </Field>
            <Field name="webinarTopic" label="Mixed methods topic you’d like a future webinar on" optional error={errors.webinarTopic}>
              <TextInput name="webinarTopic" defaultValue={val('webinarTopic', d('webinarTopic'))} a11y={a11y('webinarTopic')} />
            </Field>
          </div>
          <Field
            name="photo"
            label="2x2 formal picture"
            optional
            hint="JPG, PNG or WebP, up to 2 MB. Only you and the secretariat can see it."
            error={errors.photo}
          >
            <div className="flex flex-wrap items-center gap-4">
              {photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Your current 2x2 picture" className="size-20 rounded-lg border border-rule object-cover" />
              )}
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={`block text-base text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2.5 file:font-semibold file:text-white hover:file:bg-navy-soft ${formFocusRing}`}
                {...a11y('photo')}
              />
            </div>
          </Field>
        </>
      )}

      {step === 4 && (
        <PaymentFields form={form} defaults={defaults} options={options} receipt={receipt} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
        {step > 1 ? (
          <Link href={`/member/apply/${step - 1}`} className={textLink}>
            ← Back
          </Link>
        ) : (
          <Link href="/member" className={textLink}>
            ← My account
          </Link>
        )}
        <SubmitButton label={submitLabel} pendingLabel="Saving…" />
      </div>
      <p className="sr-only" aria-live="polite">{`Step ${step} of ${totalSteps}`}</p>
    </form>
  )
}
