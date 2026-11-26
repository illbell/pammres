// Server-only: the signed-in member, read from the Payload auth cookie.
import config from '@payload-config'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Member } from '@/payload-types'

/** Payload's auth cookie (default cookiePrefix "payload"). Shared by editors and members. */
export const AUTH_COOKIE = 'payload-token'

/**
 * The signed-in member, or null. An editor's admin session doesn't count:
 * only accounts from the `members` collection are returned.
 */
export const getCurrentMember = cache(async (): Promise<Member | null> => {
  // Skip the database entirely for visitors without a session cookie.
  if (!(await cookies()).has(AUTH_COOKIE)) return null
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'members') return null
    // Re-read as the member so field access (e.g. internalNotes) applies.
    return await payload.findByID({
      collection: 'members',
      id: user.id,
      depth: 1,
      overrideAccess: false,
      user,
    })
  } catch (error) {
    console.error('[member] Could not read the session', error)
    return null
  }
})

/** The signed-in member; otherwise redirects to the login page and back here afterwards. */
export async function requireMember(next: string): Promise<Member> {
  const member = await getCurrentMember()
  if (!member) redirect(`/login?next=${encodeURIComponent(next)}`)
  return member
}

/** Only same-site paths are allowed as a post-login destination. */
export function safeNext(next: unknown, fallback = '/member'): string {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}
