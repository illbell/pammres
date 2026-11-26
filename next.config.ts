import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Optional separate output folder, e.g. to build while `pnpm dev` is using .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    // Member profile step 3 uploads a 2x2 photo (up to 2 MB) through a server action.
    serverActions: { bodySizeLimit: '3mb' },
  },
  // Security headers on every response. Framing is limited to this site (clickjacking on
  // /login, /join, /admin); SAMEORIGIN keeps any of Payload's own admin frames working.
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ...(process.env.NODE_ENV === 'production'
        ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
        : []),
    ]
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  // The Mentorship page moved to /resources (client revision, 2026-11-26).
  async redirects() {
    return [{ source: '/mentorship', destination: '/resources', permanent: true }]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      // Site images committed to /public/images (e.g. the home page hero photo)
      {
        pathname: '/images/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
