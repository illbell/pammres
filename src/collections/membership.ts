// Membership categories, fees and payment methods (client revision, 2026-11-26).
// Used by the Members collection, the Membership and Join pages, and the profile steps.

export const membershipCategories = [
  { label: 'Regular Member (individual)', value: 'regular' },
  { label: 'Student (individual)', value: 'student' },
  { label: 'Institutional Member', value: 'institutional' },
] as const

/** Membership fee per category, in Philippine pesos. */
export const membershipFees: Record<(typeof membershipCategories)[number]['value'], number> = {
  regular: 500,
  student: 300,
  institutional: 2000,
}

export const paymentMethods = [
  { label: 'Bank transfer', value: 'bank-transfer' },
  { label: 'GCash', value: 'gcash' },
  { label: 'Not paid yet', value: 'not-yet' },
] as const

/* ------------------------------ Annual expiry ------------------------------ */

/** Days before expiry when members can renew (and see a reminder). */
export const RENEWAL_WINDOW_DAYS = 30

/** The same calendar date one year later (29 Feb → 28 Feb). */
export function addOneYear(from: Date): Date {
  const d = new Date(from)
  const month = d.getUTCMonth()
  d.setUTCFullYear(d.getUTCFullYear() + 1)
  if (d.getUTCMonth() !== month) d.setUTCDate(0)
  return d
}

/**
 * New expiry when the secretariat approves: one year after the current expiry
 * if it hasn't passed yet (early renewals keep their remaining time),
 * otherwise one year from now.
 */
export function nextExpiry(currentExpiry: string | Date | null | undefined, now = new Date()): Date {
  const current = currentExpiry ? new Date(currentExpiry) : null
  return addOneYear(current && current > now ? current : now)
}

export type MembershipStanding = 'none' | 'active' | 'expiring' | 'expired'

/**
 * Where an approved membership stands today. "expiring" means within the
 * renewal window. Members without an approval yet are "none".
 */
export function membershipStanding(
  m: { status?: string | null; membershipExpires?: string | null; memberSince?: string | null },
  now = new Date(),
): { standing: MembershipStanding; expires: Date | null; canRenew: boolean } {
  const approvedBefore = m.status === 'approved' || m.status === 'renewal-pending' || Boolean(m.memberSince)
  // Members approved before expiry dates existed: one year from when they joined.
  const expires = m.membershipExpires
    ? new Date(m.membershipExpires)
    : m.memberSince
      ? addOneYear(new Date(m.memberSince))
      : null
  if (!approvedBefore || !expires) return { standing: 'none', expires: null, canRenew: false }

  const msLeft = expires.getTime() - now.getTime()
  const standing: MembershipStanding =
    msLeft <= 0 ? 'expired' : msLeft <= RENEWAL_WINDOW_DAYS * 86_400_000 ? 'expiring' : 'active'
  const canRenew = m.status === 'approved' && standing !== 'active'
  return { standing, expires, canRenew }
}
