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
