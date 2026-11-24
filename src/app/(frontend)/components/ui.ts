// Shared class strings for the PAMMRES design system (navy / crimson / gold / white).

export const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-navy'

/** Focus ring for controls sitting on navy or crimson backgrounds. */
export const focusRingOnDark =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold no-underline transition-colors duration-150 motion-reduce:transition-none'

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-base',
} as const

const buttonVariants = {
  /** Solid crimson: the main call to action (e.g. Join PAMMRES). */
  primary: `bg-crimson text-white hover:bg-crimson-hover ${focusRing}`,
  /** Navy outline: secondary actions on light backgrounds (e.g. Member Login). */
  outline: `border-2 border-navy text-navy hover:bg-navy hover:text-white ${focusRing}`,
  /** Gold: primary action on navy or crimson backgrounds. */
  gold: `bg-gold text-navy-deep hover:bg-gold-soft ${focusRingOnDark}`,
  /** White outline: secondary action on navy or crimson backgrounds. */
  outlineOnDark: `border-2 border-white/70 text-white hover:border-white hover:bg-white/10 ${focusRingOnDark}`,
} as const

export function button(
  variant: keyof typeof buttonVariants = 'primary',
  size: keyof typeof buttonSizes = 'lg',
) {
  return `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]}`
}

export const buttonPrimary = button('primary')
export const buttonOutline = button('outline')
export const buttonGold = button('gold')
export const buttonOutlineOnDark = button('outlineOnDark')

/** Inline text link (e.g. "Meet Our National Officers & Board →"). */
export const textLink = `rounded-sm font-semibold text-navy underline decoration-navy/25 decoration-2 underline-offset-4 transition-colors duration-150 hover:decoration-crimson motion-reduce:transition-none ${focusRing}`
