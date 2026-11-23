'use client'

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { LogoMark } from './LogoMark'
import { membershipHref, navItems } from './navigation'

const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()
  const menuId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const isCurrent = (href: string) => href === pathname

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
      className={`sticky top-0 z-40 border-b bg-ground/95 backdrop-blur-md transition-[border-color] duration-200 motion-reduce:transition-none ${
        scrolled || open ? 'border-rule' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1280px] items-center gap-6 px-4 md:px-6">
        <Link href="/" className={`flex items-center gap-3 rounded-lg no-underline ${focusRing}`}>
          <LogoMark />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl font-bold tracking-[-0.01em]" translate="no">
              PAMMRES
            </span>
            <span className="hidden text-xs text-ink-muted xl:block">
              Philippine Association of Mixed Methods Researchers &amp; Emergent Scholars
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-2 text-base font-semibold no-underline transition-colors duration-150 hover:bg-ink/6 hover:text-ink motion-reduce:transition-none aria-[current=page]:bg-ink/8 aria-[current=page]:text-ink ${isCurrent(item.href) ? '' : 'text-ink-muted'} ${focusRing}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={membershipHref}
          className={`ml-auto hidden rounded-full bg-ink px-5 py-2.5 text-base font-semibold text-ground no-underline transition-colors duration-150 hover:bg-ink/85 motion-reduce:transition-none sm:inline-block lg:ml-0 ${focusRing}`}
        >
          Become a member
        </a>

        <button
          ref={buttonRef}
          type="button"
          className={`ml-auto -mr-2 grid size-11 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-ink/6 motion-reduce:transition-none sm:ml-0 lg:hidden ${focusRing}`}
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

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id={menuId}
            aria-label="Main"
            className="overflow-hidden lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="mx-auto flex max-w-[1280px] flex-col px-4 pt-2 pb-6 md:px-6">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className={`block rounded-xl px-3 py-3 font-display text-2xl font-semibold tracking-[-0.01em] text-ink no-underline hover:bg-ink/6 aria-[current=page]:bg-ink/8 ${focusRing}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-4 sm:hidden">
                <a
                  href={membershipHref}
                  onClick={() => setOpen(false)}
                  className={`block rounded-full bg-ink px-5 py-3.5 text-center font-semibold text-ground no-underline ${focusRing}`}
                >
                  Become a member
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
