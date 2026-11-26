import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { ArrowRightIcon, MegaphoneIcon } from '../components/icons'
import { PageHeader } from '../components/PageHeader'
import { focusRing, textLink } from '../components/ui'
import { getNews } from '../data/cms'
import { formatNewsDate } from './date'

export const metadata: Metadata = {
  title: 'News',
  description: 'News and announcements from PAMMRES.',
}

// Refreshed when a post is saved in the admin; hourly as a fallback.
export const revalidate = 3600

export default async function NewsPage() {
  const posts = await getNews()

  return (
    <main id="main">
      <PageHeader
        eyebrow="Latest from PAMMRES"
        title="News"
        subtitle="Announcements, milestones and stories from the PAMMRES community."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />

      <section aria-label="News posts" className="bg-white">
        <div className="mx-auto max-w-[1080px] px-4 py-16 md:px-6 md:py-20">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-[36rem] rounded-xl border border-dashed border-gold bg-cream px-6 py-12 text-center">
              <div
                aria-hidden="true"
                className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold [&>svg]:size-6"
              >
                <MegaphoneIcon />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy">No news yet</h2>
              <p className="mt-3 text-base text-ink-muted">
                Check back soon, or see{' '}
                <Link href="/events" className={textLink}>
                  upcoming events
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <li key={post.id} className="flex">
                  <article className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-rule border-t-4 border-t-navy bg-white shadow-sm transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    {post.coverImage && (
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={post.coverImage.url}
                          alt={post.coverImage.alt}
                          fill
                          sizes="(min-width: 768px) 520px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <p className="text-sm font-semibold tracking-[0.12em] text-crimson uppercase">
                        <time dateTime={post.publishedDate}>
                          {formatNewsDate(post.publishedDate)}
                        </time>
                      </p>
                      <h2 className="mt-2 font-display text-2xl leading-snug font-semibold text-balance text-navy">
                        {/* The link covers the whole card */}
                        <Link
                          href={`/news/${post.slug}`}
                          className={`rounded-sm no-underline after:absolute after:inset-0 hover:underline hover:decoration-crimson hover:decoration-2 hover:underline-offset-4 ${focusRing}`}
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-3 text-base/relaxed text-ink-muted">{post.summary}</p>
                      <span
                        aria-hidden="true"
                        className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-navy"
                      >
                        Read more
                        <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
