'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import React, { useEffect, useState } from 'react'

import { markSiteReady } from './siteReady'

/** Never hold the page longer than this, even if an image is slow or broken. */
const MAX_WAIT_MS = 6000

/** Images the browser is fetching now: eager ones, plus lazy ones already in view. */
function imagesToWaitFor(): HTMLImageElement[] {
  return Array.from(document.images).filter((img) => {
    if (img.closest('#site-loader') || img.complete) return false
    if (img.loading !== 'lazy') return true
    const r = img.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight
  })
}

function whenLoaded(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(), { once: true })
    img.addEventListener('error', () => resolve(), { once: true })
  })
}

/**
 * Full-screen loading screen with the PAMMRES emblem, shown on the first page
 * load until the visible images (and fonts) have loaded. It lives in the root
 * layout, so client-side navigation between pages doesn't show it again.
 * If JavaScript doesn't run, the CSS in styles.css hides it after a few seconds.
 */
export function SiteLoader() {
  const [visible, setVisible] = useState(true)
  const reduce = useReducedMotion()

  useEffect(() => {
    let cancelled = false
    const ready = Promise.all([
      ...imagesToWaitFor().map(whenLoaded),
      document.fonts?.ready ?? Promise.resolve(),
    ])
    const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS))
    Promise.race([ready, timeout]).then(() => {
      if (cancelled) return
      setVisible(false)
      markSiteReady()
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="site-loader"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] grid place-items-center bg-white"
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative grid size-36 place-items-center md:size-44">
              {/* Gold ring that spins around the emblem */}
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-spin rounded-full border-4 border-gold/20 border-t-gold [animation-duration:1.1s] motion-reduce:animate-none"
              />
              {/* Small pre-sized copy, served as-is so it shows before the image optimizer warms up */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/pammres-logo-288.webp"
                alt=""
                width={144}
                height={144}
                fetchPriority="high"
                className="size-28 rounded-full object-cover md:size-34"
              />
            </div>
            <p className="font-display text-xl font-semibold tracking-wide text-navy">
              <span translate="no">PAMMRES</span>
              <span className="sr-only"> is loading</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
