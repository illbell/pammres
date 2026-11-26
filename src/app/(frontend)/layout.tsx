import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google'
import React from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { SiteLoader } from './components/SiteLoader'
import './styles.css'

// Classic serif for headings, clean sans for body (per the website guide).
const display = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
})

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-plex',
})

export const metadata: Metadata = {
  title: { default: 'PAMMRES', template: '%s | PAMMRES' },
  description:
    'An engaged, interdisciplinary community of Filipino practitioner-scholars, educators, and emergent researchers advancing quality research education and evidence-based nation-building. The official Philippine affiliate of MMIRA.',
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col bg-ground font-sans text-lg/relaxed text-ink [&>main]:mb-10 [&>main]:w-full">
        <SiteLoader />
        <noscript>
          <style>
            {'#site-loader{display:none}[data-hero-reveal]{opacity:1!important;transform:none!important}'}
          </style>
        </noscript>
        <a
          className="absolute left-[-9999px] top-4 z-50 rounded-md bg-ink px-4 py-2 text-ground no-underline focus:left-4 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
          href="#main"
        >
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
