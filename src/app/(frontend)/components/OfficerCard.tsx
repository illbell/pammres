import Image from 'next/image'
import React from 'react'

export type OfficerPhoto = { url: string; alt?: string | null }

/** Initials from a name, skipping honorifics/suffixes like "Dr.", "Engr." or "Jr." */
function initials(name: string) {
  const honorifics = /^(dr|engr|prof|sr|fr|mr|ms|mrs|atty|jr|ii|iii|iv)\.?$/i
  const parts = name
    .replace(/,.*$/, '')
    .split(/\s+/)
    .filter((p) => p && !honorifics.test(p) && !/^[A-Z]\.$/.test(p))
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

const sizes = {
  lg: { box: 'size-36 md:size-40', text: 'text-4xl', px: 160, name: 'text-2xl' },
  md: { box: 'size-28', text: 'text-3xl', px: 112, name: 'text-xl' },
} as const

/**
 * Officer profile from the website guide: circular headshot, bold name,
 * official title, and institutional affiliation. Without a photo it shows
 * the officer's initials on navy.
 */
export function OfficerCard({
  name,
  role,
  institution,
  photo,
  size = 'md',
}: {
  name: string
  role: string
  institution?: string
  photo?: OfficerPhoto | null
  size?: keyof typeof sizes
}) {
  const s = sizes[size]

  return (
    <article className="flex flex-col items-center text-center">
      <div
        className={`${s.box} relative overflow-hidden rounded-full bg-navy ring-4 ring-gold/40 ring-offset-4 ring-offset-white`}
      >
        {photo?.url ? (
          <Image
            src={photo.url}
            alt={photo.alt || `Portrait of ${name}`}
            fill
            sizes={`${s.px}px`}
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`flex size-full items-center justify-center font-display font-semibold text-gold-soft ${s.text}`}
          >
            {initials(name)}
          </span>
        )}
      </div>
      <h3 className={`mt-5 font-display font-semibold text-balance text-navy ${s.name}`}>{name}</h3>
      <p className="mt-1 text-base font-semibold text-crimson">{role}</p>
      {institution && <p className="mt-1 text-sm text-ink-muted">{institution}</p>}
    </article>
  )
}
