'use client'

import { motion, useReducedMotion } from 'motion/react'
import React from 'react'

/**
 * Headline whose words rise into place one after another. Each word sits in
 * a clipping span so it appears to slide up from behind a baseline.
 */
export function HeroHeadline({
  id,
  text,
  className = 'text-[clamp(2.5rem,5.2vw,4.75rem)]',
}: {
  id: string
  text: string
  /** Size and width classes */
  className?: string
}) {
  // Same starting state on server and client; reduced motion finishes instantly.
  const reduce = useReducedMotion()
  const words = text.split(' ')

  return (
    <h1
      id={id}
      className={`font-display leading-[1.08] font-semibold tracking-[-0.01em] text-balance ${className}`}
    >
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.06 }
              }
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </h1>
  )
}
