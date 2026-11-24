/**
 * PAMMRES's finalized Vision, Mission and Core Values, verbatim from the
 * website guide ("Your Finalized Vision & Mission Statements" and the About Us
 * page). Shared by the About page and anywhere else they appear.
 */

export const vision =
  'PAMMRES envisions an inclusive Filipino fellowship of seasoned and emergent scholars united in bayanihan—championing an indigenized, globally recognized mixed methods scholarship in service of the Filipino nation and the upliftment of marginalized members of society.'

export const mission =
  'PAMMRES fosters a supportive Filipino mixed methods research community that unites seasoned and emergent scholars in mentorship, advances rigorous, indigenized, and globally relevant inquiry, and translates evidence into policies, programs, and practice to uplift marginalized members of society toward genuine nation-building.'

export type CoreValue = {
  title: string
  /** One-line version from the guide's "Quick-Scan Website Format" */
  tagline: string
  description: string
}

export const coreValues: CoreValue[] = [
  {
    title: 'Bayanihan and Inclusive Fellowship',
    tagline:
      'Uniting seasoned and emergent scholars nationwide in mutual mentorship and shared growth.',
    description:
      'We nurture a welcoming, multidisciplinary community where seasoned practitioners and emergent scholars across all Philippine regions, sectors, and backgrounds mentor one another in respectful camaraderie.',
  },
  {
    title: 'Methodological Rigor and Continuous Improvement',
    tagline:
      'Advancing world-class, indigenized mixed methods standards through lifelong learning.',
    description:
      'We pursue excellence in integrating qualitative and quantitative approaches—constantly refining our craft to uphold world-class standards while developing an indigenized Filipino mixed methods tradition.',
  },
  {
    title: 'Personal and Scholarly Integrity',
    tagline: 'Upholding ethical research, openness, and triangulation in the pursuit of truth.',
    description:
      'We anchor our inquiry in honesty, ethical stewardship, and openness to diverse perspectives—using methodological triangulation in a sincere quest for truth.',
  },
  {
    title: 'Sustained and Curious Inquiry',
    tagline: 'Fostering critical, creative, and context-rooted research across disciplines.',
    description:
      'We cultivate lifelong learning, critical thinking, and creative problem-solving to address complex, evolving questions rooted in Philippine realities.',
  },
  {
    title: 'Social Responsibility and Solidarity with the Marginalized',
    tagline: 'Translating evidence into action to uplift marginalized members of society.',
    description:
      'We view research as an instrument of justice—standing in solidarity with marginalized members of society to translate evidence into policies, programs, and practice for genuine nation-building.',
  },
]
