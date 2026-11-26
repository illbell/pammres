import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { joinHref } from '../components/navigation'
import { PageHeader } from '../components/PageHeader'
import { textLink } from '../components/ui'
import { getCurrentMember, safeNext } from '../data/member'
import { LoginForm } from '../member/forms'

export const metadata: Metadata = {
  title: 'Member Login',
  description: 'Log in to your PAMMRES member account.',
}

type Props = { searchParams: Promise<{ next?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next)
  if (await getCurrentMember()) redirect(next)

  return (
    <main id="main">
      <PageHeader
        image="membership"
        title="Member Login"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Member Login' }]}
      />
      <div className="mx-auto max-w-[520px] px-4 py-16 md:px-6 md:py-20">
        <LoginForm next={next} />
        <p className="mt-10 border-t border-rule pt-6 text-base text-ink-muted">
          Not a member yet?{' '}
          <Link href={joinHref} className={textLink}>
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
