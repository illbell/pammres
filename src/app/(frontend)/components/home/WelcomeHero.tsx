import React from 'react'

import { resolvePhoto } from '../../content/images'
import { SitePhoto } from '../SitePhoto'
import { HeroBackground, HeroReveal, HeroRule } from './WelcomeHeroMotion'

const background = resolvePhoto({
  src: '/images/hero-img.webp',
  alt: 'PAMMRES members in matching shirts holding the Philippine flag and a framed PAMMRES emblem',
  brief: 'wide group or event photo for the welcome hero, landscape',
})

/**
 * Opening hero (client revision, 2026-11-26): a full-width event photo under a
 * navy overlay, with "Welcome to PAMMRES", the full association name and the
 * tagline on three lines. The split hero follows directly below it.
 *
 * Motion (WelcomeHeroMotion): the photo settles in from a slight zoom and
 * drifts on scroll; the lines rise in one after another and the gold rule
 * draws outward. It starts when the loading screen fades.
 */
export function WelcomeHero() {
  return (
    <section
      aria-labelledby="welcome-title"
      className="relative isolate grid min-h-[min(80svh,46rem)] place-items-center overflow-hidden border-b-4 border-gold bg-navy-deep text-white"
    >
      <HeroBackground>
        <SitePhoto photo={background} sizes="100vw" priority tone="dark" />
      </HeroBackground>
      {/* Navy overlay keeps the white text readable over any photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-navy-deep/75 via-navy/70 to-navy-deep/85"
      />

      <div className="mx-auto max-w-[1280px] px-4 py-24 text-center md:px-6 md:py-32">
        <h1 id="welcome-title" className="font-display font-semibold text-balance">
          <HeroReveal
            delay={0.1}
            className="block font-sans text-[clamp(1rem,1.8vw,1.35rem)] font-semibold tracking-[0.16em] text-gold-soft uppercase"
          >
            Welcome to <span translate="no">PAMMRES</span>
          </HeroReveal>
          {/* Two lines from md up; wraps naturally on phones, where two lines would be too small */}
          <span className="mt-5 block text-[2.25rem] leading-[1.1] md:text-[clamp(1.75rem,4.4vw,4rem)]">
            <HeroReveal delay={0.25} className="inline-block md:block md:whitespace-nowrap">
              Philippine Association of Mixed Methods
            </HeroReveal>{' '}
            <HeroReveal delay={0.4} className="inline-block md:block md:whitespace-nowrap">
              Researchers and Emergent Scholars
            </HeroReveal>
          </span>
        </h1>
        <HeroRule delay={0.65} />
        <HeroReveal
          as="p"
          delay={0.8}
          className="mt-8 font-sans text-[clamp(1rem,1.8vw,1.35rem)] font-semibold tracking-[0.16em] text-gold-soft uppercase"
        >
          Bridging Philippine and Global Scholarship
        </HeroReveal>
      </div>
    </section>
  )
}
