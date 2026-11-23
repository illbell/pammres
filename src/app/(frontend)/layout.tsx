import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, IBM_Plex_Sans } from 'next/font/google'
import React from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import './styles.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
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
    'The Philippine Association of Mixed Methods Researchers & Emergent Scholars brings together researchers who combine qualitative and quantitative methods.',
}

export const viewport: Viewport = {
  themeColor: '#F2F4EF',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col bg-ground font-sans text-lg/relaxed text-ink [&>main]:mb-10 [&>main]:w-full">
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
