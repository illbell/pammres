'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import React from 'react'

/**
 * Full-bleed background photo for the home page hero. It settles from a slight
 * zoom on load. Without a photo it shows a labelled placeholder instead.
 */
export function HeroPhoto({ src, alt }: { src: string | null; alt: string }) {
  const reduce = useReducedMotion()

  if (!src) {
    return (
      <div className="bg-dot-grid absolute inset-0 -z-10 bg-ink">
        <div className="absolute top-6 right-6 left-6 rounded-xl border border-dashed border-qual/70 bg-qual/10 px-4 py-3 text-sm text-qual md:left-auto md:max-w-[22rem]">
          [Hero photo: save a wide photo of PAMMRES researchers as <code>public/images/hero.jpg</code>,
          ideally 2400×1400px or larger]
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="absolute inset-0 -z-10"
      initial={{ scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
    </motion.div>
  )
}
