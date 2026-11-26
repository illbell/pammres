'use client'

import { useSyncExternalStore } from 'react'

/*
 * "Site ready" signal: SiteLoader marks it when the loading screen starts to
 * fade, so entrance animations (e.g. the welcome hero) play where visitors can
 * see them instead of behind the loader. After client-side navigation it is
 * already set, so animations start straight away.
 */

let ready = false
const listeners = new Set<() => void>()

export function markSiteReady() {
  if (ready) return
  ready = true
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** False during server render and hydration; true once the loader is fading. */
export function useSiteReady() {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  )
}
