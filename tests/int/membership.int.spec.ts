import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { submitMembershipApplication } from '@/app/(frontend)/membership/actions'

// Runs against the database in .env; removes the application it creates.
let payload: Payload
const testEmail = `int-spec-${Date.now()}@example.invalid`

const form = (fields: Record<string, string>) => {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const valid = {
  name: 'Test Applicant',
  email: testEmail,
  category: 'student',
  region: 'luzon',
  institution: 'Test University',
  paymentMethod: 'gcash',
  paymentReference: 'REF-123',
  privacyConsent: 'on',
}

describe('membership applications', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'membership-applications',
      where: { email: { equals: testEmail } },
    })
  })

  it('rejects missing consent, bad category and a missing payment reference', async () => {
    const result = await submitMembershipApplication(
      { status: 'idle' },
      form({ ...valid, category: 'vip', paymentReference: '', privacyConsent: '' }),
    )
    expect(result.status).toBe('error')
    expect(Object.keys(result.errors ?? {}).sort()).toEqual(
      ['category', 'paymentReference', 'privacyConsent'].sort(),
    )
  })

  it('saves a valid application with status "new"', async () => {
    const result = await submitMembershipApplication({ status: 'idle' }, form(valid))
    expect(result.status).toBe('success')

    const { docs } = await payload.find({
      collection: 'membership-applications',
      where: { email: { equals: testEmail } },
    })
    expect(docs).toHaveLength(1)
    expect(docs[0]).toMatchObject({ status: 'new', privacyConsent: true, category: 'student' })
  })

  it('treats a filled honeypot as spam and saves nothing', async () => {
    const spamEmail = `spam-${testEmail}`
    const result = await submitMembershipApplication(
      { status: 'idle' },
      form({ ...valid, email: spamEmail, website: 'http://spam.example' }),
    )
    expect(result.status).toBe('success')
    const { totalDocs } = await payload.count({
      collection: 'membership-applications',
      where: { email: { equals: spamEmail } },
    })
    expect(totalDocs).toBe(0)
  })

  it('never exposes applications to visitors', async () => {
    await expect(
      payload.find({ collection: 'membership-applications', overrideAccess: false }),
    ).rejects.toThrow()
  })
})
