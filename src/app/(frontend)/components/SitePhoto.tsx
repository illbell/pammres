import Image from 'next/image'
import React from 'react'

import type { ResolvedPhoto } from '../content/images'

/**
 * Fills its (positioned, sized) parent with a photo from /public, or with a
 * labelled placeholder telling editors which file to add.
 */
export function SitePhoto({
  photo,
  sizes,
  priority = false,
  tone = 'light',
}: {
  photo: ResolvedPhoto
  sizes: string
  priority?: boolean
  /** "dark" when the placeholder sits on navy */
  tone?: 'light' | 'dark'
}) {
  if (photo.exists) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    )
  }

  const dark = tone === 'dark'
  return (
    <div
      role="img"
      aria-label={photo.alt}
      className={`absolute inset-0 flex items-end p-3 ${
        dark ? 'bg-dot-grid bg-navy-soft/60' : 'bg-cream'
      }`}
    >
      <p
        className={`max-w-full min-w-0 rounded-lg border border-dashed px-3 py-2 text-xs/snug [overflow-wrap:anywhere] ${
          dark
            ? 'border-gold/60 bg-navy-deep/60 text-gold-soft'
            : 'border-gold bg-white/80 text-ink-muted'
        }`}
      >
        [Photo: {photo.brief} → <code>public{photo.src}</code>]
      </p>
    </div>
  )
}
