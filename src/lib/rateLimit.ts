// Server-only: a small in-memory rate limiter for public forms (sign-up, contact).
import { headers } from 'next/headers'

/*
 * Fixed-window counters per key, kept in this server process's memory. That's
 * enough for the single Coolify instance; counters reset when the server
 * restarts, and several instances would each count separately.
 */

type Window = { count: number; resetAt: number }
const windows = new Map<string, Window>()
let lastSweep = 0

function sweep(now: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, w] of windows) if (w.resetAt <= now) windows.delete(key)
}

/** The visitor's IP: the first hop in X-Forwarded-For (set by the Coolify proxy). */
export async function clientIp(): Promise<string> {
  try {
    const h = await headers()
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  } catch {
    // Outside a request (e.g. tests or scripts)
    return 'unknown'
  }
}

/**
 * Counts one attempt for `action` from this visitor. Returns false once the
 * visitor has used up `limit` attempts in the current `windowMs` window.
 */
export async function allowRequest(action: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now()
  sweep(now)
  const key = `${action}:${await clientIp()}`
  const w = windows.get(key)
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  w.count += 1
  return w.count <= limit
}

export const HOUR = 60 * 60 * 1000
