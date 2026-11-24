/**
 * PAMMRES's four strategic pillars (theme groups), copy verbatim from the
 * website guide (homepage Section 3). The About page's Theme Group Leaders
 * section reuses the titles.
 */
export type PillarIcon = 'globe' | 'impact' | 'growth' | 'network'

export type Pillar = {
  number: number
  title: string
  summary: string
  icon: PillarIcon
}

export const pillars: Pillar[] = [
  {
    number: 1,
    title: 'Global Recognition & Standard Setting',
    summary:
      'Elevating Filipino scholarship on the world stage through active affiliation with the Mixed Methods International Research Association (MMIRA), international conferences, and peer-reviewed publications.',
    icon: 'globe',
  },
  {
    number: 2,
    title: 'Societal Impact & Policy Influence',
    summary:
      'Translating research findings into actionable programs that address UN Sustainable Development Goals (SDGs 1–10), empower marginalized sectors, and inform local government policies.',
    icon: 'impact',
  },
  {
    number: 3,
    title: 'Organizational Growth & Sustainability',
    summary:
      'Building an inclusive nationwide network spanning diverse disciplines, regions, and institutions, anchored by an indigenized Filipino mixed methods framework.',
    icon: 'growth',
  },
  {
    number: 4,
    title: 'Collaboration & Knowledge Production',
    summary:
      'Connecting seasoned practitioners with emergent scholars through tiered mentorship programs, regional chapters, training workshops, and the PAMMRES Research Journal.',
    icon: 'network',
  },
]
