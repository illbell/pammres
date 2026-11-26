'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import React from 'react'

import { useSiteReady } from '../siteReady'

const ease = [0.22, 1, 0.36, 1] as const

// Every element starts from the same hidden state on server and client (so
// hydration matches); with reduced motion the transition is instant.

/**
 * Hero photo layer: settles in from a slight zoom once the page is ready, then
 * drifts down a little as the page scrolls (parallax). Static for reduced motion.
 */
export function HeroBackground({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const ready = useSiteReady()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 160])

  return (
    // Extra height above and below so the parallax shift never shows an edge
    <motion.div className="absolute inset-x-0 -top-24 -bottom-24 -z-20" style={{ y }}>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={ready || reduce ? { scale: 1 } : undefined}
        transition={reduce ? { duration: 0 } : { duration: 2.4, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const tags = { span: motion.span, p: motion.p } as const

/**
 * One line of hero text that rises and fades in after `delay` seconds,
 * counted from when the loading screen starts to fade.
 */
export function HeroReveal({
  as = 'span',
  delay = 0,
  className = '',
  children,
}: {
  as?: keyof typeof tags
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  const ready = useSiteReady()
  const Tag = tags[as]

  return (
    <Tag
      data-hero-reveal=""
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={ready || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={reduce ? { duration: 0 } : { duration: 0.9, ease, delay }}
    >
      {children}
    </Tag>
  )
}

/** Gold rule under the name, drawn outward from the center. */
export function HeroRule({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion()
  const ready = useSiteReady()

  return (
    <motion.div
      aria-hidden="true"
      data-hero-reveal=""
      className="mx-auto mt-8 h-1 w-20 rounded-full bg-gold"
      initial={{ scaleX: 0 }}
      animate={ready || reduce ? { scaleX: 1 } : undefined}
      transition={reduce ? { duration: 0 } : { duration: 0.8, ease, delay }}
    />
  )
}
