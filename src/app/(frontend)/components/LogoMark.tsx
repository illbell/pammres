import Image from 'next/image'
import React from 'react'

/**
 * The official PAMMRES Q+Q emblem (public/images/pammres-logo.svg): red and
 * blue cyclical arrows around the Q+Q triangle. The file has a white square
 * background, so it's clipped to a circle to sit cleanly on navy too.
 * Decorative wherever the PAMMRES name sits beside it, so the default alt is
 * empty; pass `alt` where the emblem stands alone.
 */
export function LogoMark({
  className = 'size-8',
  alt = '',
  priority = false,
}: {
  /** Size classes, e.g. "size-10 lg:size-12" */
  className?: string
  alt?: string
  priority?: boolean
}) {
  return (
    <Image
      src="/images/pammres-logo.svg"
      alt={alt}
      width={214}
      height={210}
      priority={priority}
      unoptimized
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  )
}
