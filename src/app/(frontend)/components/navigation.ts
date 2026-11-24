// Site navigation shared by the header and footer (labels from the website guide).

export type NavLink = { label: string; href: string }

export const navItems: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Membership', href: '/membership' },
  { label: 'Events & Training', href: '/events' },
  { label: 'Research & Policy', href: '/research' },
  { label: 'Mentorship', href: '/mentorship' },
]

/** "Join PAMMRES" / "Become a Member" calls to action. */
export const joinHref = '/membership#apply'

// TODO: point at the real member portal once its scope is decided (Payload auth or external).
export const memberLoginHref = '/membership#member-login'

export const contactHref = '/contact'

export const partnerHref = '/contact#partner'

export const footerQuickLinks: NavLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Vision & Core Values', href: '/about#vision-mission' },
  { label: 'National Officers', href: '/about#officers' },
  { label: 'Constitution & By-Laws', href: '/about#governance' },
]

export const footerProgramLinks: NavLink[] = [
  { label: 'Membership Portal', href: '/membership' },
  { label: 'Mentorship Program', href: '/mentorship' },
  { label: 'Research Journal', href: '/research#journal' },
  { label: 'Upcoming Events', href: '/events' },
]

export const regions = ['Luzon', 'Visayas', 'Mindanao'] as const

// Contact email, Facebook and the announcement bar are edited in the admin: Site Settings.
