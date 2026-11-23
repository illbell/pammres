import fs from 'node:fs'
import path from 'node:path'
import React from 'react'

import { HeroHeadline } from './components/HeroHeadline'
import { HeroPhoto } from './components/HeroPhoto'
import { membershipHref } from './components/navigation'
import { PublicationsSection } from './components/PublicationsSection'

// Hero photo lives in /public. Until it's added, the hero shows a placeholder.
const HERO_PHOTO = '/images/hero.jpg'
// TODO: describe the actual photo once it's added.
const HERO_PHOTO_ALT = 'PAMMRES researchers working together'

const focusRingOnDark =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-quan'

export default function HomePage() {
  const hasPhoto = fs.existsSync(path.join(process.cwd(), 'public', HERO_PHOTO))

  return (
    <main id="main">
      <section
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[min(860px,calc(100svh-72px))] items-end overflow-hidden bg-ink text-ground"
      >
        <HeroPhoto src={hasPhoto ? HERO_PHOTO : null} alt={HERO_PHOTO_ALT} />

        {/* Darken the photo where the text sits so it stays readable over any image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/70 to-ink/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden bg-linear-to-r from-ink/80 via-ink/35 to-transparent md:block"
        />

        <div className="mx-auto w-full max-w-[1280px] px-6 pt-48 pb-14 md:px-14 md:pb-20">
          <HeroHeadline
            id="hero-title"
            text="A home for Filipino researchers who work across methods."
            className="max-w-[17ch] text-[clamp(2.75rem,6.4vw,6rem)] [text-shadow:0_2px_28px_rgb(29_37_53/0.55)]"
          />
          <p className="mt-7 max-w-[36rem] text-lg/relaxed text-pretty text-ground/85 md:text-xl/relaxed">
            <span translate="no">PAMMRES</span> brings together established and emerging scholars
            who combine qualitative and quantitative research. Learn the methods, share your work,
            and find collaborators.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={membershipHref}
              className={`inline-block rounded-full bg-integrate px-7 py-3.5 font-semibold text-ink no-underline transition-colors duration-150 hover:bg-integrate-hover motion-reduce:transition-none ${focusRingOnDark}`}
            >
              Become a member
            </a>
            <a
              href="/contact"
              className={`font-semibold text-ground underline decoration-ground/50 decoration-1 underline-offset-[6px] transition-colors duration-150 hover:decoration-ground motion-reduce:transition-none ${focusRingOnDark}`}
            >
              Contact us
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-3 pb-6 md:px-6">
        <PublicationsSection />
      </div>
    </main>
  )
}
