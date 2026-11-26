/**
 * PAMMRES's finalized Vision, Mission and Core Values, verbatim from the
 * website guide ("Your Finalized Vision & Mission Statements" and the About Us
 * page). Shared by the About page and anywhere else they appear.
 */

import type { SitePhoto } from './images'

export const vision =
  'PAMMRES envisions an inclusive Filipino fellowship of seasoned and emergent scholars united in bayanihan—championing an indigenized, globally recognized mixed methods scholarship in service of the Filipino nation and the upliftment of marginalized members of society.'

export const mission =
  'PAMMRES fosters a supportive Filipino mixed methods research community that unites seasoned and emergent scholars in mentorship, advances rigorous, indigenized, and globally relevant inquiry, and translates evidence into policies, programs, and practice to uplift marginalized members of society toward genuine nation-building.'

export type CoreValue = {
  title: string
  /** One-line version from the guide's "Quick-Scan Website Format" */
  tagline: string
  description: string
  /**
   * Card photo (client request). Shows a labelled placeholder until the file
   * is added at `src`. TODO: describe the real photo in `alt` once added.
   */
  photo: SitePhoto
}

export const coreValues: CoreValue[] = [
  {
    title: 'Bayanihan and Inclusive Fellowship',
    tagline:
      'Uniting seasoned and emergent scholars nationwide in mutual mentorship and shared growth.',
    description:
      'We nurture a welcoming, multidisciplinary community where seasoned practitioners and emergent scholars across all Philippine regions, sectors, and backgrounds mentor one another in respectful camaraderie.',
    photo: {
      src: '/images/value-1.webp',
      alt: 'Educators working together around tables with laptops and papers during a group workshop',
      brief: 'members together, fellowship or mentoring moment, 3:2',
    },
  },
  {
    title: 'Methodological Rigor and Continuous Improvement',
    tagline:
      'Advancing world-class, indigenized mixed methods standards through lifelong learning.',
    description:
      'We pursue excellence in integrating qualitative and quantitative approaches—constantly refining our craft to uphold world-class standards while developing an indigenized Filipino mixed methods tradition.',
    photo: {
      src: '/images/value-2.webp',
      alt: 'A PAMMRES member going over printed materials with a fellow researcher at an international conference',
      brief: 'hands-on workshop or training session, 3:2',
    },
  },
  {
    title: 'Personal and Scholarly Integrity',
    tagline: 'Upholding ethical research, openness, and triangulation in the pursuit of truth.',
    description:
      'We anchor our inquiry in honesty, ethical stewardship, and openness to diverse perspectives—using methodological triangulation in a sincere quest for truth.',
    photo: {
      src: '/images/value-3.webp',
      alt: 'A participant writing on a paper wall headed "Theme 2: Societal Impact" during a planning workshop',
      brief: 'research presentation or ethics discussion, 3:2',
    },
  },
  {
    title: 'Sustained and Curious Inquiry',
    tagline: 'Fostering critical, creative, and context-rooted research across disciplines.',
    description:
      'We cultivate lifelong learning, critical thinking, and creative problem-solving to address complex, evolving questions rooted in Philippine realities.',
    photo: {
      src: '/images/value-4.webp',
      alt: 'PAMMRES members seated at tables listening to a speaker during a training session',
      brief: 'fieldwork, data analysis or small-group discussion, 3:2',
    },
  },
  {
    title: 'Social Responsibility and Solidarity with the Marginalized',
    tagline: 'Translating evidence into action to uplift marginalized members of society.',
    description:
      'We view research as an instrument of justice—standing in solidarity with marginalized members of society to translate evidence into policies, programs, and practice for genuine nation-building.',
    photo: {
      src: '/images/value-5.webp',
      alt: 'Three PAMMRES members, including a religious sister, warmly clasping hands',
      brief: 'community or LGU engagement, outreach, 3:2',
    },
  },
]
