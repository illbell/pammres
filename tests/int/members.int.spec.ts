// @vitest-environment node
// (jsdom's Uint8Array breaks JWT signing in payload.login, so this file runs in Node.)
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { safeNext } from '@/app/(frontend)/data/member'
import { addOneYear, membershipStanding, nextExpiry } from '@/collections/membership'
import { signUp } from '@/app/(frontend)/member/actions'
import type { Member } from '@/payload-types'

// Runs against the database in .env; removes the members it creates.
let payload: Payload
const context = { disableRevalidate: true }
const stamp = Date.now()
const emailA = `int-member-a-${stamp}@example.invalid`
const emailB = `int-member-b-${stamp}@example.invalid`
const password = 'correct-horse-battery'
// Payload's access-denied error, so a test can't pass by failing for another reason
const FORBIDDEN = /not allowed/i

// A signed-in member, as Payload sees them in access functions.
type MemberUser = Member & { collection: 'members' }
let memberA: MemberUser
let memberB: MemberUser

const form = (fields: Record<string, string>) => {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const makeMember = async (email: string) =>
  ({
    ...(await payload.create({
      collection: 'members',
      data: {
        email,
        password,
        firstName: 'Test',
        lastName: 'Member',
        privacyConsent: true,
        status: 'incomplete',
      },
      overrideAccess: true,
    })),
    collection: 'members',
  }) as MemberUser

describe('member accounts', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    memberA = await makeMember(emailA)
    memberB = await makeMember(emailB)
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'members',
      where: { email: { in: [emailA, emailB] } },
      overrideAccess: true,
    })
  })

  it('starts new members as incomplete with no steps done', async () => {
    const doc = await payload.findByID({ collection: 'members', id: memberA.id, overrideAccess: true })
    expect(doc).toMatchObject({ status: 'incomplete', completedSteps: 0, fullName: 'Test Member' })
  })

  it('validates sign-up before touching the database', async () => {
    const result = await signUp(
      { status: 'idle' },
      form({ firstName: '', lastName: 'X', email: 'not-an-email', password: 'short', confirmPassword: 'short' }),
    )
    expect(result.status).toBe('error')
    expect(Object.keys(result.errors ?? {}).sort()).toEqual(
      ['email', 'firstName', 'password', 'privacyConsent'].sort(),
    )
  })

  it('rejects a sign-up with an email that already has an account', async () => {
    const result = await signUp(
      { status: 'idle' },
      form({
        firstName: 'Dup',
        lastName: 'Licate',
        email: emailA,
        password,
        confirmPassword: password,
        privacyConsent: 'on',
      }),
    )
    expect(result.errors?.email).toMatch(/already exists/)
  })

  it('logs a member in with the right password only', async () => {
    const ok = await payload.login({ collection: 'members', data: { email: emailA, password } })
    expect(ok.token).toBeTruthy()
    await expect(
      payload.login({ collection: 'members', data: { email: emailA, password: 'wrong-password' } }),
    ).rejects.toThrow()
  })

  it('lets a member read and update only their own record', async () => {
    const own = await payload.find({ collection: 'members', overrideAccess: false, user: memberA })
    expect(own.docs.map((d) => d.id)).toEqual([memberA.id])

    await expect(
      payload.findByID({ collection: 'members', id: memberB.id, overrideAccess: false, user: memberA }),
    ).rejects.toThrow()

    const updated = await payload.update({
      collection: 'members',
      id: memberA.id,
      data: { institution: 'Test University' },
      overrideAccess: false,
      user: memberA,
    })
    expect(updated.institution).toBe('Test University')

    await expect(
      payload.update({
        collection: 'members',
        id: memberB.id,
        data: { institution: 'Hijacked' },
        overrideAccess: false,
        user: memberA,
      }),
    ).rejects.toThrow()
  })

  it('never lets a member approve themselves', async () => {
    await payload.update({
      collection: 'members',
      id: memberA.id,
      data: { status: 'approved', completedSteps: 4 },
      overrideAccess: false,
      user: memberA,
    })
    const doc = await payload.findByID({ collection: 'members', id: memberA.id, overrideAccess: true })
    // Field access silently drops editor-only fields from a member's update.
    expect(doc.status).toBe('incomplete')
    expect(doc.completedSteps).toBe(0)
  })

  it('treats members as visitors everywhere else', async () => {
    await expect(
      payload.create({
        collection: 'officers',
        data: { name: 'Member Officer', role: 'Tester', group: 'executive' },
        overrideAccess: false,
        user: memberA,
        context,
      }),
    ).rejects.toThrow(FORBIDDEN)
    await expect(
      payload.create({
        collection: 'users',
        data: { email: `int-escalate-${stamp}@example.invalid`, password },
        overrideAccess: false,
        user: memberA,
      }),
    ).rejects.toThrow(FORBIDDEN)
    await expect(
      payload.find({ collection: 'users', overrideAccess: false, user: memberA }),
    ).rejects.toThrow(FORBIDDEN)
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        data: { contactEmail: 'member@example.com' },
        overrideAccess: false,
        user: memberA,
        context,
      }),
    ).rejects.toThrow(FORBIDDEN)
    await expect(
      payload.find({ collection: 'contact-messages', overrideAccess: false, user: memberA }),
    ).rejects.toThrow(FORBIDDEN)
  })

  it('only allows same-site paths after login (no open redirects)', () => {
    for (const bad of [
      String.raw`/\evil.com`, // browsers read "/\" as "//"
      '//evil.com',
      'https://evil.com',
      '/%5Cevil.com',
      '/\tevil',
      'javascript:alert(1)',
      '',
      undefined,
    ]) {
      expect(safeNext(bad), String(bad)).toBe('/member')
    }
    expect(safeNext('/member/apply/2')).toBe('/member/apply/2')
    expect(safeNext('/resources?x=1#top')).toBe('/resources?x=1#top')
  })

  it('starts a one-year membership when an editor approves a member', async () => {
    const before = Date.now()
    const approved = await payload.update({
      collection: 'members',
      id: memberB.id,
      data: { status: 'approved' },
      overrideAccess: true,
    })
    expect(approved.memberSince).toBeTruthy()
    const expires = new Date(approved.membershipExpires!).getTime()
    const year = 365 * 86_400_000
    expect(expires - before).toBeGreaterThan(year - 2 * 86_400_000)
    expect(expires - before).toBeLessThan(year + 2 * 86_400_000)
  })

  it('extends an unexpired membership by a year when a renewal is approved', async () => {
    const current = await payload.findByID({ collection: 'members', id: memberB.id, overrideAccess: true })
    const oldExpiry = current.membershipExpires!
    const oldSince = current.memberSince
    await payload.update({ collection: 'members', id: memberB.id, data: { status: 'renewal-pending' }, overrideAccess: true })
    const renewed = await payload.update({
      collection: 'members',
      id: memberB.id,
      data: { status: 'approved' },
      overrideAccess: true,
    })
    expect(renewed.membershipExpires).toBe(addOneYear(new Date(oldExpiry)).toISOString())
    expect(renewed.memberSince).toBe(oldSince)
  })

  it('never lets a member change their own expiry or receipt link', async () => {
    await payload.update({
      collection: 'members',
      id: memberA.id,
      data: { membershipExpires: '2099-01-01T00:00:00.000Z' },
      overrideAccess: false,
      user: memberA,
    })
    const doc = await payload.findByID({ collection: 'members', id: memberA.id, overrideAccess: true })
    expect(doc.membershipExpires ?? null).toBeNull()
  })

  it('keeps payment receipts private to their owner and editors', async () => {
    await expect(
      payload.find({ collection: 'payment-receipts', overrideAccess: false }),
    ).rejects.toThrow(FORBIDDEN)
    const own = await payload.find({ collection: 'payment-receipts', overrideAccess: false, user: memberA })
    expect(own.docs.every((d) => (typeof d.owner === 'object' ? d.owner.id : d.owner) === memberA.id)).toBe(true)
  })

  it('works out expiry, renewal window and expired memberships', () => {
    const now = new Date('2026-06-15T00:00:00.000Z')
    const day = 86_400_000
    const at = (offsetDays: number) => new Date(now.getTime() + offsetDays * day).toISOString()
    expect(membershipStanding({ status: 'pending' }, now)).toMatchObject({ standing: 'none', canRenew: false })
    expect(membershipStanding({ status: 'approved', membershipExpires: at(90) }, now)).toMatchObject({ standing: 'active', canRenew: false })
    expect(membershipStanding({ status: 'approved', membershipExpires: at(20) }, now)).toMatchObject({ standing: 'expiring', canRenew: true })
    expect(membershipStanding({ status: 'approved', membershipExpires: at(-1) }, now)).toMatchObject({ standing: 'expired', canRenew: true })
    // A renewal already sent can't be sent twice
    expect(membershipStanding({ status: 'renewal-pending', membershipExpires: at(-1) }, now).canRenew).toBe(false)
    // Early renewal keeps the remaining time; a lapsed one restarts from today
    expect(nextExpiry(at(10), now).toISOString()).toBe(addOneYear(new Date(at(10))).toISOString())
    expect(nextExpiry(at(-10), now).toISOString()).toBe(addOneYear(now).toISOString())
    // 29 February rolls to 28 February
    expect(addOneYear(new Date('2028-02-29T00:00:00.000Z')).toISOString()).toBe('2029-02-28T00:00:00.000Z')
  })
})
