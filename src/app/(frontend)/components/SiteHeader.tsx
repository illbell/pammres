'use client'

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { LogoMark } from './LogoMark'
import { joinHref, memberAreaHref, memberLoginHref, navItems } from './navigation'
import { button, buttonOutline, buttonPrimary, focusRing, focusRingOnDark } from './ui'

/**
 * Whether a member is signed in, from Payload's /api/members/me (sent with the
 * auth cookie). Re-checked on navigation so login and logout show up at once.
 */
function useSignedInMember(pathname: string) {
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/members/me', { credentials: 'same-origin', signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { user?: unknown } | null) => setSignedIn(Boolean(data?.user)))
      .catch(() => {})
    return () => ctrl.abort()
  }, [pathname])
  return signedIn
}

/**
 * Sticky site header from the website guide.
 * Desktop (lg+): brand and CTAs on the top row, main links centered in a navy bar below.
 * Smaller screens: brand, Join button and a menu toggle; links and both CTAs live in the menu.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()
  const menuId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  // Signed-in member? Checked in the browser so every page can stay static.
  const signedIn = useSignedInMember(pathname)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  // Close the mobile menu with Escape and hand focus back to the toggle.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow duration-200 motion-reduce:transition-none ${
        scrolled || open ? 'shadow-[0_6px_24px_-12px_rgb(11_26_51/0.35)]' : ''
      }`}
    >
      {/* Top row: brand + CTAs */}
      <div className="mx-auto flex h-18 max-w-[1280px] items-center gap-4 px-4 md:px-6 lg:h-20">
        <Link
          href="/"
          className={`flex min-w-0 items-center gap-3 rounded-lg no-underline ${focusRing}`}
        >
          <LogoMark className="size-10 lg:size-12" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-display text-xl font-bold text-navy lg:text-2xl" translate="no">
              PAMMRES
            </span>
            <span className="hidden max-w-[19rem] text-xs leading-snug text-ink-muted sm:block lg:max-w-none lg:text-sm">
              Philippine Association of Mixed Methods Researchers and Emergent Scholars
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {signedIn ? (
            <Link href={memberAreaHref} className={button('outline', 'md')}>
              My account
            </Link>
          ) : (
            <>
              <Link href={memberLoginHref} className={button('outline', 'md')}>
                Member Login
              </Link>
              <Link
                href={joinHref}
                className={`${button('primary', 'md')} border-2 border-crimson hover:border-crimson-hover`}
              >
                Join PAMMRES
              </Link>
            </>
          )}
        </div>

        <Link
          href={signedIn ? memberAreaHref : joinHref}
          className={`${button(signedIn ? 'outline' : 'primary', 'sm')} ml-auto whitespace-nowrap max-sm:hidden lg:hidden`}
        >
          {signedIn ? 'My account' : 'Join PAMMRES'}
        </Link>

        <button
          ref={buttonRef}
          type="button"
          className={`-mr-2 ml-auto grid size-11 shrink-0 place-items-center rounded-full text-navy transition-colors duration-150 hover:bg-navy/6 motion-reduce:transition-none sm:ml-0 lg:hidden ${focusRing}`}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
            <motion.path
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ d: open ? 'M6 6 L18 18' : 'M4 8 L20 8' }}
              transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            />
            <motion.path
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ d: open ? 'M6 18 L18 6' : 'M4 16 L20 16' }}
              transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            />
          </svg>
        </button>
      </div>

      {/* Desktop: main links in a navy bar with a gold rule */}
      <nav aria-label="Main" className="hidden border-b-[3px] border-gold bg-navy lg:block">
        <ul className="mx-auto flex max-w-[1280px] items-center justify-center gap-1 px-6">
          {navItems.map((item) => {
            const current = isCurrent(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`relative block px-4 py-3.5 text-[0.95rem] font-semibold no-underline transition-colors duration-150 motion-reduce:transition-none xl:px-5 ${
                    current ? 'text-white' : 'text-white/75 hover:text-white'
                  } after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-gold after:transition-opacity after:duration-150 xl:after:inset-x-5 ${
                    current ? 'after:opacity-100' : 'after:opacity-0 hover:after:opacity-60'
                  } ${focusRingOnDark} focus-visible:-outline-offset-3`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Mobile and tablet menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id={menuId}
            aria-label="Main"
            className="overflow-hidden border-t border-rule lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="mx-auto flex max-h-[calc(100svh-4.5rem)] max-w-[1280px] flex-col overflow-y-auto px-4 pt-3 pb-6 md:px-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className={`block rounded-xl border-l-4 border-transparent px-3 py-3 font-display text-2xl font-semibold text-navy no-underline hover:bg-cream aria-[current=page]:border-gold aria-[current=page]:bg-cream ${focusRing}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-5 grid gap-3 sm:grid-cols-2">
                {signedIn ? (
                  <Link
                    href={memberAreaHref}
                    onClick={() => setOpen(false)}
                    className={buttonOutline}
                  >
                    My account
                  </Link>
                ) : (
                  <>
                    <Link
                      href={memberLoginHref}
                      onClick={() => setOpen(false)}
                      className={buttonOutline}
                    >
                      Member Login
                    </Link>
                    <Link href={joinHref} onClick={() => setOpen(false)} className={buttonPrimary}>
                      Join PAMMRES
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
