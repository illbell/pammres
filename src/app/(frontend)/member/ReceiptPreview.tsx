import React from 'react'

import { textLink } from '../components/ui'

/**
 * Shows a payment receipt: the image itself, or the PDF in an embedded viewer
 * (with a link to open it, since some phones can't show PDFs inline).
 * Works for files on the server and for not-yet-uploaded files (blob: URLs).
 */
export function ReceiptPreview({
  url,
  mimeType,
  label,
  openLink = true,
}: {
  url: string
  mimeType?: string | null
  /** Describes the receipt for screen readers, e.g. "Your payment receipt" */
  label: string
  /** Show an "Open in a new tab" link (not useful for a file that isn't uploaded yet) */
  openLink?: boolean
}) {
  const isPdf = mimeType === 'application/pdf'

  if (isPdf) {
    // Many phone browsers can't show PDFs inline, so the viewer is for wider screens;
    // the bar below always works.
    return (
      <figure className="overflow-hidden rounded-xl border border-rule bg-cream">
        <object
          data={url}
          type="application/pdf"
          aria-label={label}
          className="hidden h-80 w-full bg-white md:block"
        />
        <figcaption className="flex items-center justify-between gap-3 border-rule bg-white px-4 py-3 md:border-t">
          <span className="flex items-center gap-2 text-sm font-semibold text-navy">
            <span aria-hidden="true" className="rounded bg-crimson px-1.5 py-0.5 text-xs font-bold text-white">
              PDF
            </span>
            PDF receipt
          </span>
          <a href={url} target="_blank" rel="noopener" className={`${textLink} text-sm`}>
            Open PDF<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </figcaption>
      </figure>
    )
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-rule bg-cream">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={label} className="mx-auto block max-h-80 w-auto object-contain" />
      {openLink && (
        <figcaption className="border-t border-rule bg-white px-4 py-2 text-sm">
          <a href={url} target="_blank" rel="noopener" className={textLink}>
            Open full size<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </figcaption>
      )}
    </figure>
  )
}
