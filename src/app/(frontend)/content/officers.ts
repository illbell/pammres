/**
 * Current national officers and theme group leaders, verbatim from the website
 * guide (About Us page, Sections 4–6). Headshots are optional: add
 * /public/images/officers/<slug>.jpg (square) and it appears automatically.
 * TODO: move to Payload `Officers` / `ThemeGroups` collections in phase 5.
 */

export type Officer = {
  slug: string
  name: string
  role: string
  institution: string
}

export type OfficerGroup = {
  id: string
  title: string
  size: 'lg' | 'md'
  /** Tailwind grid columns at desktop width */
  columns: string
  officers: Officer[]
}

export const officerGroups: OfficerGroup[] = [
  {
    id: 'executive',
    title: 'Executive Leadership',
    size: 'lg',
    columns: 'sm:grid-cols-2',
    officers: [
      {
        slug: 'benito-teehankee',
        name: 'Dr. Benito L. Teehankee',
        role: 'President',
        institution: 'De La Salle University',
      },
      {
        slug: 'maribel-gaite',
        name: 'Dr. Maribel R. Gaite',
        role: 'Executive Vice President',
        institution: 'UP Diliman / Mater Dei Academy',
      },
    ],
  },
  {
    id: 'regional',
    title: 'Regional Vice Presidents',
    size: 'md',
    columns: 'sm:grid-cols-2 lg:grid-cols-3',
    officers: [
      {
        slug: 'jeremaiah-opiniano',
        name: 'Dr. Jeremaiah M. Opiniano',
        role: 'Vice President for Luzon',
        institution: 'University of Santo Tomas',
      },
      {
        slug: 'alvin-tenorio',
        name: 'Dr. Alvin D. Tenorio',
        role: 'Vice President for Visayas',
        institution: 'UP Diliman',
      },
      {
        slug: 'amelia-buan',
        name: 'Dr. Amelia Buan',
        role: 'Vice President for Mindanao',
        institution: 'MSU–Iligan Institute of Technology',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Secretariat, Treasury & Governance Officers',
    size: 'md',
    columns: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    officers: [
      {
        slug: 'maria-elizabeth-grageda',
        name: 'Dr. Maria Elizabeth M. Grageda',
        role: 'Secretary (SUCs)',
        institution: 'UP-NTTCHP',
      },
      {
        slug: 'mark-rey-santos',
        name: 'Dr. Mark Rey C. Santos',
        role: 'Secretary (Private HEIs)',
        institution: 'La Consolacion University Philippines',
      },
      {
        slug: 'roger-carlo-pineda',
        name: 'Dr. Roger Carlo P. Pineda',
        role: 'Treasurer',
        institution: "Dr. Yanga's Colleges, Inc.",
      },
      {
        slug: 'joseline-santos',
        name: 'Dr. Joseline M. Santos',
        role: 'Assistant Treasurer',
        institution: 'Bulacan State University',
      },
      {
        slug: 'nicanor-san-gabriel',
        name: 'Dr. Nicanor M. San Gabriel Jr.',
        role: 'Internal Auditor',
        institution: 'Department of Education',
      },
      {
        slug: 'niceta-vargas',
        name: 'Sr. Niceta M. Vargas, OSA, Ph.D.',
        role: 'Spiritual Director',
        institution: 'La Consolacion University Philippines',
      },
    ],
  },
  {
    id: 'technology',
    title: 'Social Media & Technology Officers',
    size: 'md',
    columns: 'sm:grid-cols-2 lg:grid-cols-3',
    officers: [
      {
        slug: 'jason-paz',
        name: 'Engr. Jason S. Paz, MBA',
        role: 'Social Media & Technology Officer',
        institution: 'DLSU / Mater Dei Academy',
      },
      {
        slug: 'simon-zandro-san-diego',
        name: 'Simon Zandro F. San Diego',
        role: 'Social Media & Technology Officer',
        institution: 'Mater Dei Academy',
      },
      {
        slug: 'simon-isaac-san-diego',
        name: 'Simon Isaac F. San Diego',
        role: 'Social Media & Technology Officer',
        institution: 'Mater Dei Academy',
      },
    ],
  },
]

export type ThemeGroup = {
  number: number
  title: string
  leader: string
  institution: string
  mandate: string
}

export const themeGroups: ThemeGroup[] = [
  {
    number: 1,
    title: 'Global Recognition and Standard Setting',
    leader: 'Irma M. Peñalba',
    institution: 'DLSMHSI',
    mandate:
      'Oversees MMIRA engagements, international conferences, research ethics and methodology committees, digital presence, and scholarly publications.',
  },
  {
    number: 2,
    title: 'Societal Impact and Policy Influence',
    leader: 'Dr. Celso P. Pagatpatan, Jr.',
    institution: 'DLSMHSI',
    mandate:
      'Leads marginalized sector immersion, UN SDG 1–10 research mapping, LGU research hubs, and legislative policy dialogues.',
  },
  {
    number: 3,
    title: 'Organizational Growth and Sustainability',
    leader: 'Dr. Roger Carlo P. Pineda',
    institution: "Dr. Yanga's Colleges, Inc.",
    mandate:
      'Directs nationwide inclusive membership expansion, institutional MOAs/MOUs, tiered mentoring frameworks, and the indigenized Filipino MMR agenda.',
  },
  {
    number: 4,
    title: 'Collaboration and Knowledge Production',
    leader: 'Prof. Valeriano Fojas',
    institution: 'DLSMHSI',
    mandate:
      'Coordinates the member expertise directory, regional and school chapters, free mini-webinars, emergent scholar mentorship, and the PAMMRES Research Journal.',
  },
]

/** 2019 inaugural officers (guide Section 6, Tab 1). */
export const foundingOfficers: { role: string; name: string }[] = [
  { role: 'President', name: 'Maribel R. Gaite, Ph.D.' },
  { role: 'Vice President', name: 'Rosario Alonzo, Ph.D.' },
  { role: 'Secretary', name: 'Teodora Salubayba, Ph.D.' },
  { role: 'Asst. Secretary', name: 'Ma. Cristina Somo' },
  { role: 'Treasurer', name: 'Alvin Tenorio, Ph.D.' },
]
