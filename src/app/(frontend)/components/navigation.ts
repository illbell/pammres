// Site navigation shared by the header and footer.
// Header items follow the client's 2026-11-26 revision, which replaces the guide's list.

export type NavLink = { label: string; href: string }

export const navItems: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Membership', href: '/membership' },
  { label: 'Events', href: '/events' },
  { label: 'News', href: '/news' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
  { label: 'Affiliates', href: '/affiliates' },
]

/** "Join PAMMRES" / "Become a Member" calls to action: create a member account. */
export const joinHref = '/join'

/** Member login, and the member area a signed-in member lands on. */
export const memberLoginHref = '/login'
export const memberAreaHref = '/member'

export const contactHref = '/contact'

/** Public member directory (client roster, 2026-11-27). */
export const membersHref = '/members'

export const partnerHref = '/contact#partner'

export const footerQuickLinks: NavLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Vision & Core Values', href: '/about#vision-mission' },
  { label: 'National Officers', href: '/about#officers' },
  { label: 'Constitution & By-Laws', href: '/about#governance' },
  { label: 'Member Directory', href: '/members' },
  { label: 'News', href: '/news' },
  { label: 'Affiliates', href: '/affiliates' },
]

export const footerProgramLinks: NavLink[] = [
  { label: 'Membership Portal', href: '/membership' },
  { label: 'Resources', href: '/resources' },
  { label: 'Upcoming Events', href: '/events' },
]

// Contact email, Facebook and the announcement bar are edited in the admin: Site Settings.
