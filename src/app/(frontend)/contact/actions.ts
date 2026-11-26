'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

import { contactTopics } from '@/collections/ContactMessages'
import { allowRequest, HOUR } from '@/lib/rateLimit'

export type ContactField = 'name' | 'email' | 'affiliation' | 'topic' | 'message'

export type ContactFormState = {
  status: 'idle' | 'error' | 'success'
  /** Form-level message, announced to screen readers */
  message?: string
  errors?: Partial<Record<ContactField, string>>
  /** Submitted values, so the form keeps them after a failed attempt */
  values?: Partial<Record<ContactField, string>>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
type Topic = (typeof contactTopics)[number]['value']
const TOPICS = contactTopics.map((t) => t.value) as readonly string[]

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const get = (key: string) => String(formData.get(key) ?? '').trim()

  const values = {
    name: get('name'),
    email: get('email'),
    affiliation: get('affiliation'),
    topic: get('topic') || 'general',
    message: get('message'),
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (get('website')) {
    return { status: 'success', values: { email: values.email } }
  }

  const errors: ContactFormState['errors'] = {}
  if (!values.name) errors.name = 'Enter your name.'
  else if (values.name.length > 120) errors.name = 'Use 120 characters or fewer.'

  if (!values.email) errors.email = 'Enter your email address so we can reply.'
  else if (!EMAIL_PATTERN.test(values.email))
    errors.email = 'Enter an email address like name@example.com.'

  if (values.affiliation.length > 200) errors.affiliation = 'Use 200 characters or fewer.'

  if (!TOPICS.includes(values.topic)) errors.topic = 'Choose a topic from the list.'

  if (!values.message) errors.message = 'Enter your message.'
  else if (values.message.length < 10)
    errors.message = 'Add a little more detail (at least 10 characters).'
  else if (values.message.length > 5000) errors.message = 'Use 5,000 characters or fewer.'

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Check the highlighted fields and try again.',
      errors,
      values,
    }
  }

  // At most 5 messages an hour from one visitor (spam and flooding).
  if (!(await allowRequest('contact', 5, HOUR))) {
    return {
      status: 'error',
      message:
        'You’ve sent several messages in a short time. Please wait a while before sending another, or email the secretariat directly.',
      values,
    }
  }

  try {
    const payload = await getPayload({ config })
    // Trusted server-side write after validation; the collection itself
    // allows no public writes.
    await payload.create({
      collection: 'contact-messages',
      data: {
        name: values.name,
        email: values.email,
        affiliation: values.affiliation || undefined,
        topic: values.topic as Topic,
        message: values.message,
        status: 'new',
      },
    })
  } catch (error) {
    console.error('Failed to save contact message', error)
    return {
      status: 'error',
      message:
        'Your message couldn’t be sent because of a problem on our side. Try again in a few minutes.',
      values,
    }
  }

  return { status: 'success', values: { email: values.email } }
}
