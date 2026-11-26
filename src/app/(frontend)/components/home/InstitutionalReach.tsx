import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { resolvePhoto, type SitePhoto as SitePhotoData } from '../../content/images'
import { getHomePartners, type PartnerView } from '../../data/cms'
import { ArrowRightIcon } from '../icons'
import { SectionHeading } from '../SectionHeading'
import { SitePhoto } from '../SitePhoto'
import { textLink } from '../ui'

// Captions per the client (2026-11-26).
const gallery: (SitePhotoData & { caption: string })[] = [
  {
    src: '/images/workshop-3.webp',
    alt: 'A speaker at a seminar-workshop pointing to a slide on Humanistic and Safe AI for Human and National Development',
    brief: 'Seminar-workshop, 4:3',
    caption: 'Seminar-Workshop on Research Methods',
  },
  {
    src: '/images/workshop-1.jpg',
    alt: "A speaker at Halo-Halo 3: The Filipino Mixed Methods Fair, with Dr. John W. Creswell's session, Motivating a Mixed Methods Mindset, on screen",
    brief: 'Filipino Mixed Methods Fair, 4:3',
    caption: 'Halo-Halo 3: The Filipino Mixed Methods Fair',
  },
  {
    src: '/images/members-7.webp',
    alt: 'PAMMRES members in matching shirts standing in a wide arc around the Philippine flag and the association plaque',
    brief: 'PAMMRES members, 4:3',
    caption: 'PAMMRES Members',
  },
]

function InstitutionBadge({ institution }: { institution: PartnerView }) {
  return (
    <div
      title={institution.name}
      className="flex h-20 w-48 shrink-0 flex-col items-center justify-center rounded-xl border border-rule bg-white px-4 text-center"
    >
      {institution.logo ? (
        <Image
          src={institution.logo.url}
          alt={institution.logo.alt || institution.name}
          width={160}
          height={56}
          className="max-h-14 w-auto object-contain"
        />
      ) : (
        <>
          <span className="font-display text-xl font-semibold text-navy">{institution.short}</span>
          <span className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{institution.name}</span>
        </>
      )}
    </div>
  )
}

/** Institutional Reach & Past Highlights (guide Section 5): logo carousel + 3-photo strip. */
export async function InstitutionalReach() {
  const institutions = await getHomePartners()
  const photos = gallery.map((g) => ({ ...resolvePhoto(g), caption: g.caption }))

  return (
    <section aria-labelledby="reach-title" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 pt-20 md:px-6 md:pt-28">
        <SectionHeading
          id="reach-title"
          eyebrow="Institutional Reach"
          title="Trusted by Scholars Across Leading Philippine Institutions"
          intro="Over 100+ active researchers and educators from De La Salle University (DLSU), UP Diliman, UP Manila, University of Santo Tomas (UST), DLSMHSI, La Consolacion University Philippines, Bulacan State University, PUP, MSU-IIT, Dr. Yanga's Colleges, Mater Dei Academy, and the Department of Education."
          align="center"
        />
      </div>

      {/* Logo carousel: scrolls slowly, pauses on hover; static and wrapped for reduced motion */}
      <div className="group/marquee relative mt-12 overflow-hidden py-2 motion-reduce:overflow-visible">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent motion-reduce:hidden md:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent motion-reduce:hidden md:w-32"
        />
        <div className="animate-marquee motion-reduce:animate-none flex w-max gap-4 group-hover/marquee:[animation-play-state:paused] motion-reduce:mx-auto motion-reduce:w-auto motion-reduce:max-w-[1280px] motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-4">
          <ul
            aria-label="Member institutions"
            className="flex shrink-0 gap-4 motion-reduce:contents"
          >
            {institutions.map((inst) => (
              <li key={inst.id}>
                <InstitutionBadge institution={inst} />
              </li>
            ))}
          </ul>
          {/* Duplicate for a seamless loop; hidden from assistive tech */}
          <ul aria-hidden="true" className="flex shrink-0 gap-4 motion-reduce:hidden">
            {institutions.map((inst) => (
              <li key={inst.id}>
                <InstitutionBadge institution={inst} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-20 md:px-6 md:pb-28">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {photos.map((photo) => (
            <li key={photo.src}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-b-4 border-gold">
                  <SitePhoto photo={photo} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <figcaption className="mt-3 text-base/snug text-pretty text-ink-muted italic">
                  {photo.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link href="/events#past" className={`${textLink} inline-flex items-center gap-1.5`}>
            Browse Past Trainings & Event Gallery
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
