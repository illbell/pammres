// Server-only: uses node:fs. Import from server components only.
import fs from 'node:fs'
import path from 'node:path'

/**
 * Site photos committed to /public/images. Pages render a labelled placeholder
 * for any photo that hasn't been added yet, so the layout works before PAMMRES
 * supplies images. Add the file at the listed path and it appears automatically.
 */
export type SitePhoto = {
  /** Path under /public, e.g. "/images/home/hero-1.jpg" */
  src: string
  alt: string
  /** What to put here; shown in the placeholder until the file exists */
  brief: string
}

export type ResolvedPhoto = SitePhoto & { exists: boolean }

/** Checks /public at render time (static pages: at build time). */
export function resolvePhoto(photo: SitePhoto): ResolvedPhoto {
  const exists = fs.existsSync(path.join(process.cwd(), 'public', photo.src))
  return { ...photo, exists }
}
