import Link from 'next/link'
import React from 'react'

import { resolvePhoto, type SitePhoto as SitePhotoData } from '../../content/images'
import { HeroHeadline } from '../HeroHeadline'
import { ArrowRightIcon } from '../icons'
import { joinHref } from '../navigation'
import { SitePhoto } from '../SitePhoto'
import { button, focusRingOnDark } from '../ui'

// TODO: replace the alt text with a description of each real photo once added.
const collage: SitePhotoData[] = [
  {
    src: '/images/home/hero-1.jpg',
    alt: 'Participants at a PAMMRES seminar-workshop',
    brief: 'workshop group photo, portrait 4:5',
  },
  {
    src: '/images/home/hero-2.jpg',
    alt: 'A speaker at a PAMMRES symposium',
    brief: 'symposium speaker, 4:3',
  },
  {
    src: '/images/home/hero-3.jpg',
    alt: 'PAMMRES members together after an event',
    brief: 'members together, 4:3',
  },
]

/**
 * Homepage hero (guide Section 1): 60% navy gradient text block, 40% photo
 * collage of PAMMRES workshops, speakers and camaraderie.
 */
export function HomeHero() {
  const [main, top, bottom] = collage.map(resolvePhoto)

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-linear-to-br from-navy-deep via-navy to-navy-soft text-white"
    >
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-[0.08em] text-gold-soft uppercase sm:px-4 sm:text-sm sm:tracking-[0.14em]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
            Official Philippine Affiliate of MMIRA
          </p>
          <HeroHeadline
            id="hero-title"
            text="Bridging Philippine and Global Scholarship Through Mixed Methods Research"
            className="mt-6 max-w-[20ch] text-[clamp(2.25rem,4.6vw,4rem)]"
          />
          <p className="mt-6 max-w-[38rem] text-lg/relaxed text-pretty text-white/85 md:text-xl/relaxed">
            An engaged, interdisciplinary community of Filipino practitioner-scholars, educators,
            and emergent researchers advancing quality research education and evidence-based
            nation-building.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href={joinHref} className={button('primary')}>
              Become a Member
            </Link>
            <Link
              href="/events#upcoming"
              className={`group inline-flex items-center gap-2 rounded-sm font-semibold text-white no-underline ${focusRingOnDark}`}
            >
              <span className="underline decoration-gold/60 decoration-2 underline-offset-[6px] transition-colors duration-150 group-hover:decoration-gold motion-reduce:transition-none">
                Explore Upcoming Webinars
              </span>
              <ArrowRightIcon className="size-5 text-gold transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>

        {/* Photo collage: one tall photo beside two stacked ones */}
        <div className="grid h-[22rem] grid-cols-[3fr_2fr] grid-rows-2 gap-3 sm:h-[28rem] lg:h-[34rem]">
          <div className="relative row-span-2 overflow-hidden rounded-2xl ring-1 ring-white/15">
            <SitePhoto photo={main} sizes="(min-width: 1024px) 300px, 60vw" priority tone="dark" />
          </div>
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/15">
            <SitePhoto photo={top} sizes="(min-width: 1024px) 200px, 40vw" tone="dark" />
          </div>
          <div className="relative overflow-hidden rounded-2xl border-b-4 border-gold ring-1 ring-white/15">
            <SitePhoto photo={bottom} sizes="(min-width: 1024px) 200px, 40vw" tone="dark" />
          </div>
        </div>
      </div>
    </section>
  )
}
