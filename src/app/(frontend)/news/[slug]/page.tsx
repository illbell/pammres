import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ArrowRightIcon } from '../../components/icons'
import { PageHeader } from '../../components/PageHeader'
import { textLink } from '../../components/ui'
import { getNewsBySlug } from '../../data/cms'
import { formatNewsDate } from '../date'

type Props = { params: Promise<{ slug: string }> }

// Built on first visit, then cached (an empty generateStaticParams enables that);
// edits in the admin refresh it.
export const revalidate = 3600
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getNewsBySlug((await params).slug)
  if (!post) return { title: 'News post not found' }
  return { title: post.title, description: post.summary }
}

export default async function NewsPostPage({ params }: Props) {
  const post = await getNewsBySlug((await params).slug)
  if (!post) notFound()

  return (
    <main id="main">
      <PageHeader
        eyebrow={formatNewsDate(post.publishedDate)}
        title={post.title}
        subtitle={post.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label: post.title },
        ]}
      />

      <article className="mx-auto max-w-[760px] px-4 py-16 md:px-6 md:py-20">
        {post.coverImage && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              fill
              priority
              sizes="(min-width: 768px) 712px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        {post.content ? (
          <RichText
            data={post.content}
            className="space-y-4 text-lg/relaxed text-ink-muted [&_a]:font-semibold [&_a]:text-navy [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-navy [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-navy [&_li]:ml-6 [&_ol]:list-decimal [&_strong]:text-navy [&_ul]:list-disc"
          />
        ) : (
          <p className="text-lg/relaxed text-ink-muted">{post.summary}</p>
        )}

        <p className="mt-14 border-t border-rule pt-6">
          <Link href="/news" className={`${textLink} inline-flex items-center gap-1.5`}>
            All news
            <ArrowRightIcon className="size-4" />
          </Link>
        </p>
      </article>
    </main>
  )
}
