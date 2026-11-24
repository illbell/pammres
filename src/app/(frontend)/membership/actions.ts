'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

import {
  memberRegions,
  membershipCategories,
  paymentMethods,
} from '@/collections/MembershipApplications'

export type ApplicationField =
  | 'name'
  | 'email'
  | 'phone'
  | 'category'
  | 'region'
  | 'institution'
  | 'position'
  | 'discipline'
  | 'paymentMethod'
  | 'paymentReference'
  | 'notes'
  | 'privacyConsent'

export type ApplicationFormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  errors?: Partial<Record<ApplicationField, string>>
  values?: Partial<Record<ApplicationField, string>>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const valuesOf = (opts: readonly { value: string }[]) => opts.map((o) => o.value)
const CATEGORIES = valuesOf(membershipCategories)
const REGIONS = valuesOf(memberRegions)
const PAYMENT_METHODS = valuesOf(paymentMethods)

type Category = (typeof membershipCategories)[number]['value']
type Region = (typeof memberRegions)[number]['value']
type PaymentMethod = (typeof paymentMethods)[number]['value']

const limits: Partial<Record<ApplicationField, number>> = {
  name: 160,
  phone: 40,
  institution: 200,
  position: 160,
  discipline: 300,
  paymentReference: 100,
  notes: 3000,
}

export async function submitMembershipApplication(
  _prev: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const get = (key: string) => String(formData.get(key) ?? '').trim()

  const values = {
    name: get('name'),
    email: get('email'),
    phone: get('phone'),
    category: get('category'),
    region: get('region'),
    institution: get('institution'),
    position: get('position'),
    discipline: get('discipline'),
    paymentMethod: get('paymentMethod') || 'not-yet',
    paymentReference: get('paymentReference'),
    notes: get('notes'),
    privacyConsent: get('privacyConsent') === 'on' ? 'on' : '',
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (get('website')) return { status: 'success', values: { email: values.email } }

  const errors: ApplicationFormState['errors'] = {}
  if (!values.name) errors.name = 'Enter your full name.'
  if (!values.email) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(values.email))
    errors.email = 'Enter an email address like name@example.com.'
  if (!CATEGORIES.includes(values.category)) errors.category = 'Choose a membership category.'
  if (!REGIONS.includes(values.region)) errors.region = 'Choose your region.'
  if (!values.institution) errors.institution = 'Enter your institution or organization.'
  if (!PAYMENT_METHODS.includes(values.paymentMethod)) errors.paymentMethod = 'Choose how you paid.'
  if (values.paymentMethod !== 'not-yet' && !values.paymentReference)
    errors.paymentReference = 'Enter the reference number from your payment receipt.'
  if (!values.privacyConsent)
    errors.privacyConsent = 'Please give your consent so we can process your application.'

  for (const [field, max] of Object.entries(limits) as [ApplicationField, number][]) {
    if (!errors[field] && values[field].length > max) {
      errors[field] = `Use ${max.toLocaleString()} characters or fewer.`
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Check the highlighted fields and try again.',
      errors,
      values,
    }
  }

  try {
    const payload = await getPayload({ config })
    // Trusted server-side write after validation; the collection allows no public writes.
    await payload.create({
      collection: 'membership-applications',
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        category: values.category as Category,
        region: values.region as Region,
        institution: values.institution,
        position: values.position || undefined,
        discipline: values.discipline || undefined,
        paymentMethod: values.paymentMethod as PaymentMethod,
        paymentReference: values.paymentReference || undefined,
        notes: values.notes || undefined,
        privacyConsent: true,
        status: 'new',
      },
    })
  } catch (error) {
    console.error('Failed to save membership application', error)
    return {
      status: 'error',
      message:
        'Your application couldn’t be sent because of a problem on our side. Try again in a few minutes.',
      values,
    }
  }

  return { status: 'success', values: { email: values.email } }
}
