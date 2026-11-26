/**
 * International mixed methods associations linked from the Affiliates page
 * (client revision, 2026-11-26). Names and descriptions follow each
 * organization's own website.
 */
export type Affiliate = {
  name: string
  short: string
  url: string
  /** Shown under the name; keep to one or two sentences */
  description: string
  region: string
}

export const affiliates: Affiliate[] = [
  {
    name: 'Mixed Methods International Research Association',
    short: 'MMIRA',
    url: 'https://mmira.wildapricot.org/',
    region: 'International',
    description:
      'The international community promoting interdisciplinary mixed methods research. PAMMRES is its official Philippine affiliate.',
  },
  {
    name: 'Mixed Methods International Research Association – Caribbean Chapter',
    short: 'MMIRA-CC',
    url: 'https://www.mmiracc.com/',
    region: 'Caribbean',
    description:
      'The Caribbean chapter of MMIRA, offering workshops, webinars, conferences and events for mixed methods researchers in the region.',
  },
  {
    name: 'MMIRA-Oceania',
    short: 'MMIRA-Oceania',
    url: 'https://www.mmira-oceania.org/',
    region: 'Oceania',
    description:
      'Building a community of, and sharing expertise amongst, mixed methods researchers throughout the Oceania region.',
  },
  {
    name: 'Japan Society for Mixed Methods Research',
    short: 'JSMMR',
    url: 'https://jsmmr.smoosy.atlas.jp/ja',
    region: 'Japan',
    description:
      'An academic society advancing the theory and practice of mixed methods research in Japan and the Asia-Pacific region.',
  },
]
