'use server'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, type Payload } from 'payload'

import { MEMBER_PHOTO_MAX_BYTES } from '@/collections/MemberPhotos'
import {
  MEMBER_STEPS,
  researchDesigns,
  researchInterestOptions,
} from '@/collections/Members'
import { membershipCategories, paymentMethods } from '@/collections/membership'
import type { Member } from '@/payload-types'

import { AUTH_COOKIE, getCurrentMember, safeNext } from '../data/member'

/** Shared state for every member form (sign-up, login, profile steps). */
export type MemberFormState = {
  status: 'idle' | 'error'
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string | string[]>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 8
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const valuesOf = (opts: readonly { value: string }[]) => opts.map((o) => o.value)

const client = () => getPayload({ config })
const text = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim()

function tooLong(
  errors: Record<string, string>,
  values: Record<string, string | string[]>,
  limits: Record<string, number>,
) {
  for (const [field, max] of Object.entries(limits)) {
    const v = values[field]
    if (!errors[field] && typeof v === 'string' && v.length > max) {
      errors[field] = `Use ${max.toLocaleString()} characters or fewer.`
    }
  }
}

function fail(
  errors: Record<string, string>,
  values: Record<string, string | string[]>,
  message = 'Check the highlighted fields and try again.',
): MemberFormState {
  return { status: 'error', message, errors, values }
}

async function setSession(token: string, exp?: number) {
  ;(await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(exp ? { expires: new Date(exp * 1000) } : {}),
  })
}

async function signIn(payload: Payload, email: string, password: string) {
  const result = await payload.login({ collection: 'members', data: { email, password } })
  if (!result.token) throw new Error('No token returned')
  await setSession(result.token, result.exp)
}

/* ------------------------------------ Sign up ------------------------------------ */

export async function signUp(_prev: MemberFormState, fd: FormData): Promise<MemberFormState> {
  const values = {
    firstName: text(fd, 'firstName'),
    lastName: text(fd, 'lastName'),
    email: text(fd, 'email').toLowerCase(),
    privacyConsent: fd.get('privacyConsent') === 'on' ? 'on' : '',
  }
  const password = String(fd.get('password') ?? '')
  const confirm = String(fd.get('confirmPassword') ?? '')

  // Honeypot: real visitors never fill this field.
  if (text(fd, 'website')) redirect('/join')

  const errors: Record<string, string> = {}
  if (!values.firstName) errors.firstName = 'Enter your first name.'
  if (!values.lastName) errors.lastName = 'Enter your last name.'
  if (!values.email) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(values.email))
    errors.email = 'Enter an email address like name@example.com.'
  if (password.length < PASSWORD_MIN)
    errors.password = `Use at least ${PASSWORD_MIN} characters for your password.`
  else if (password !== confirm) errors.confirmPassword = 'The two passwords don’t match.'
  if (!values.privacyConsent)
    errors.privacyConsent = 'Please give your consent so we can process your membership.'
  tooLong(errors, values, { firstName: 100, lastName: 100, email: 200 })
  if (password.length > 200) errors.password = 'Use 200 characters or fewer.'
  if (Object.keys(errors).length) return fail(errors, values)

  try {
    const payload = await client()
    const existing = await payload.count({
      collection: 'members',
      where: { email: { equals: values.email } },
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) {
      return fail(
        { email: 'An account with this email already exists. Log in instead.' },
        values,
        'You already have an account.',
      )
    }
    // Trusted write after validation; the collection allows no public create.
    await payload.create({
      collection: 'members',
      data: {
        email: values.email,
        password,
        firstName: values.firstName,
        lastName: values.lastName,
        privacyConsent: true,
        status: 'incomplete',
        completedSteps: 0,
      },
      overrideAccess: true,
    })
    await signIn(payload, values.email, password)
  } catch (error) {
    console.error('[member] Sign-up failed', error)
    return fail(
      {},
      values,
      'Your account couldn’t be created because of a problem on our side. Try again in a few minutes.',
    )
  }

  redirect('/member/apply/1')
}

/* ------------------------------------ Log in / out ------------------------------------ */

export async function logIn(_prev: MemberFormState, fd: FormData): Promise<MemberFormState> {
  const email = text(fd, 'email').toLowerCase()
  const password = String(fd.get('password') ?? '')
  const next = safeNext(fd.get('next'))
  const values = { email }

  const errors: Record<string, string> = {}
  if (!email) errors.email = 'Enter your email address.'
  if (!password) errors.password = 'Enter your password.'
  if (Object.keys(errors).length) return fail(errors, values)

  try {
    await signIn(await client(), email, password)
  } catch {
    // Same message for a wrong password, an unknown email or a locked account.
    return fail(
      {},
      values,
      'That email and password don’t match an account, or the account is temporarily locked after too many attempts. Check your details and try again.',
    )
  }

  redirect(next)
}

export async function logOut() {
  ;(await cookies()).delete(AUTH_COOKIE)
  redirect('/')
}

/* ------------------------------------ Profile steps ------------------------------------ */

const DESIGNS = valuesOf(researchDesigns)
const INTERESTS = valuesOf(researchInterestOptions)
const CATEGORIES = valuesOf(membershipCategories)
const PAID_METHODS = valuesOf(paymentMethods).filter((m) => m !== 'not-yet')

type ResearchValues = { title: string; year: string; publisher: string; design: string }

function readResearch(fd: FormData, prefix: string): ResearchValues {
  return {
    title: text(fd, `${prefix}.title`),
    year: text(fd, `${prefix}.year`),
    publisher: text(fd, `${prefix}.publisher`),
    design: text(fd, `${prefix}.design`),
  }
}

/** Research entries are optional, but once started they need a title and a valid year. */
function checkResearch(prefix: string, r: ResearchValues, errors: Record<string, string>) {
  const started = Boolean(r.title || r.year || r.publisher || r.design)
  if (!started) return
  if (!r.title) errors[`${prefix}.title`] = 'Enter the title, or clear this section.'
  const thisYear = new Date().getFullYear()
  if (r.year && (!/^\d{4}$/.test(r.year) || +r.year < 1950 || +r.year > thisYear + 1))
    errors[`${prefix}.year`] = `Enter a year between 1950 and ${thisYear + 1}.`
  if (r.design && !DESIGNS.includes(r.design)) errors[`${prefix}.design`] = 'Choose a design.'
  if (r.title.length > 500) errors[`${prefix}.title`] = 'Use 500 characters or fewer.'
  if (r.publisher.length > 200) errors[`${prefix}.publisher`] = 'Use 200 characters or fewer.'
}

const researchData = (r: ResearchValues) => ({
  title: r.title || null,
  year: r.year || null,
  publisher: r.publisher || null,
  design: (r.design || null) as NonNullable<Member['publishedResearch']>['design'],
})

const flatResearch = (prefix: string, r: ResearchValues) =>
  Object.fromEntries(Object.entries(r).map(([k, v]) => [`${prefix}.${k}`, v]))

/**
 * Saves one profile step for the signed-in member, then moves to the next
 * step. Step 4 (category and payment) submits the profile for review.
 */
export async function saveProfileStep(
  _prev: MemberFormState,
  fd: FormData,
): Promise<MemberFormState> {
  const step = Number(fd.get('step'))
  if (!Number.isInteger(step) || step < 1 || step > MEMBER_STEPS) redirect('/member')

  const member = await getCurrentMember()
  if (!member) redirect(`/login?next=${encodeURIComponent(`/member/apply/${step}`)}`)

  const errors: Record<string, string> = {}
  let values: Record<string, string | string[]> = {}
  let data: Partial<Member> = {}
  let photo: File | null = null

  if (step === 1) {
    const v = {
      firstName: text(fd, 'firstName'),
      middleName: text(fd, 'middleName'),
      lastName: text(fd, 'lastName'),
      homeAddress: text(fd, 'homeAddress'),
      institution: text(fd, 'institution'),
      highestEducation: text(fd, 'highestEducation'),
    }
    values = v
    if (!v.firstName) errors.firstName = 'Enter your first name.'
    if (!v.lastName) errors.lastName = 'Enter your last name.'
    if (!v.homeAddress) errors.homeAddress = 'Enter your home address.'
    if (!v.institution) errors.institution = 'Enter the HEI or institution you’re affiliated with.'
    if (!v.highestEducation)
      errors.highestEducation = 'Enter your highest educational attainment and specialization.'
    tooLong(errors, v, {
      firstName: 100,
      middleName: 100,
      lastName: 100,
      homeAddress: 300,
      institution: 200,
      highestEducation: 300,
    })
    data = { ...v, middleName: v.middleName || null }
  }

  if (step === 2) {
    const r = readResearch(fd, 'publishedResearch')
    values = flatResearch('publishedResearch', r)
    checkResearch('publishedResearch', r, errors)
    data = { publishedResearch: researchData(r) }
  }

  if (step === 3) {
    const r = readResearch(fd, 'unpublishedResearch')
    const interests = fd.getAll('researchInterests').map(String)
    const years = text(fd, 'yearsResearching')
    const webinarTopic = text(fd, 'webinarTopic')
    values = { ...flatResearch('unpublishedResearch', r), researchInterests: interests, yearsResearching: years, webinarTopic }
    checkResearch('unpublishedResearch', r, errors)
    if (interests.some((i) => !INTERESTS.includes(i))) errors.researchInterests = 'Choose from the list.'
    if (years && (!/^\d{1,2}$/.test(years) || +years > 80))
      errors.yearsResearching = 'Enter a whole number of years, like 5.'
    tooLong(errors, values, { webinarTopic: 300 })

    const file = fd.get('photo')
    if (file instanceof File && file.size > 0) {
      if (!PHOTO_TYPES.includes(file.type)) errors.photo = 'Upload a JPG, PNG or WebP image.'
      else if (file.size > MEMBER_PHOTO_MAX_BYTES) errors.photo = 'Use an image of 2 MB or less.'
      else photo = file
    }

    data = {
      unpublishedResearch: researchData(r),
      researchInterests: interests as Member['researchInterests'],
      yearsResearching: years ? Number(years) : null,
      webinarTopic: webinarTopic || null,
    }
  }

  if (step === 4) {
    const v = {
      category: text(fd, 'category'),
      paymentMethod: text(fd, 'paymentMethod'),
      paymentReference: text(fd, 'paymentReference'),
    }
    values = v
    if (!CATEGORIES.includes(v.category)) errors.category = 'Choose a membership category.'
    if (!PAID_METHODS.includes(v.paymentMethod)) errors.paymentMethod = 'Choose how you paid.'
    if (!v.paymentReference)
      errors.paymentReference = 'Enter the reference number from your payment receipt.'
    tooLong(errors, v, { paymentReference: 100 })
    data = {
      category: v.category as Member['category'],
      paymentMethod: v.paymentMethod as Member['paymentMethod'],
      paymentReference: v.paymentReference,
    }
  }

  if (Object.keys(errors).length) return fail(errors, values)

  try {
    const payload = await client()

    if (photo) {
      const previous = typeof member.photo === 'object' ? member.photo?.id : member.photo
      const uploaded = await payload.create({
        collection: 'member-photos',
        data: { owner: member.id },
        file: {
          data: Buffer.from(await photo.arrayBuffer()),
          mimetype: photo.type,
          name: photo.name || 'photo.jpg',
          size: photo.size,
        },
        overrideAccess: true,
      })
      data.photo = uploaded.id
      if (previous) {
        await payload
          .delete({ collection: 'member-photos', id: previous, overrideAccess: true })
          .catch((e) => console.error('[member] Could not delete the old photo', e))
      }
    }

    // Trusted write of this step's validated fields only, for this member only.
    await payload.update({
      collection: 'members',
      id: member.id,
      data: {
        ...data,
        completedSteps: Math.max(member.completedSteps ?? 0, step),
        // Submitting the last step sends a not-yet-submitted profile for review.
        ...(step === MEMBER_STEPS && member.status === 'incomplete'
          ? { status: 'pending' as const }
          : {}),
      },
      overrideAccess: true,
    })
  } catch (error) {
    console.error('[member] Saving profile step failed', error)
    return fail(
      {},
      values,
      'Your details couldn’t be saved because of a problem on our side. Try again in a few minutes.',
    )
  }

  redirect(step < MEMBER_STEPS ? `/member/apply/${step + 1}` : '/member?submitted=1')
}
