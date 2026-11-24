import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { validateUrl } from '@/fields/url'

// These run against the database in .env, so every test removes what it creates.
let payload: Payload
const context = { disableRevalidate: true }
const createdEventIds: (string | number)[] = []
const createdOfficerIds: (string | number)[] = []

describe('CMS content', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    for (const id of createdEventIds) {
      await payload.delete({ collection: 'events', id, context })
    }
    for (const id of createdOfficerIds) {
      await payload.delete({ collection: 'officers', id, context })
    }
  })

  it('lets visitors read officers but not create them', async () => {
    await expect(
      payload.find({ collection: 'officers', overrideAccess: false, limit: 1 }),
    ).resolves.toBeDefined()

    await expect(
      payload.create({
        collection: 'officers',
        overrideAccess: false,
        data: { name: 'Test Visitor', role: 'Tester', group: 'executive' },
        context,
      }),
    ).rejects.toThrow()
  })

  it('blocks visitors from updating Site Settings', async () => {
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        overrideAccess: false,
        data: { contactEmail: 'attacker@example.com' },
        context,
      }),
    ).rejects.toThrow()
  })

  it('hides draft events from visitors', async () => {
    const draft = await payload.create({
      collection: 'events',
      draft: true,
      data: {
        title: 'Test draft event (int spec)',
        startDate: new Date().toISOString(),
        summary: 'Draft only.',
        type: 'webinar',
        _status: 'draft',
      },
      context,
    })
    createdEventIds.push(draft.id)

    const publicView = await payload.find({
      collection: 'events',
      overrideAccess: false,
      where: { id: { equals: draft.id } },
    })
    expect(publicView.totalDocs).toBe(0)
  })

  it('requires a group for current officers and fills the slug', async () => {
    await expect(
      payload.create({
        collection: 'officers',
        data: { name: 'Test No Group', role: 'Tester', current: true },
        context,
      }),
    ).rejects.toThrow()

    const past = await payload.create({
      collection: 'officers',
      data: { name: 'Dr. Test Past-Officer', role: 'Tester', current: false, term: 'Test term' },
      context,
    })
    createdOfficerIds.push(past.id)
    expect(past.slug).toBe('dr-test-past-officer')
  })
})

describe('validateUrl', () => {
  const check = (v: string) => (validateUrl as (v: string) => true | string)(v)

  it('accepts http(s) links and site paths', () => {
    expect(check('https://www.facebook.com/pammres')).toBe(true)
    expect(check('/events#upcoming')).toBe(true)
  })

  it('rejects script and protocol-relative links', () => {
    expect(check('javascript:alert(1)')).not.toBe(true)
    expect(check('//evil.example.com')).not.toBe(true)
    expect(check('not a url')).not.toBe(true)
  })
})
