// Event dates are shown in Philippine time regardless of the server's timezone.
const TZ = 'Asia/Manila'

const dayFmt = new Intl.DateTimeFormat('en-PH', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TZ,
})
const timeFmt = new Intl.DateTimeFormat('en-PH', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: TZ,
})
const monthFmt = new Intl.DateTimeFormat('en-PH', { month: 'short', timeZone: TZ })
const dayNumFmt = new Intl.DateTimeFormat('en-PH', { day: 'numeric', timeZone: TZ })
const yearFmt = new Intl.DateTimeFormat('en-PH', { year: 'numeric', timeZone: TZ })
const dateKeyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }) // YYYY-MM-DD

export const sameDay = (a: Date, b: Date) => dateKeyFmt.format(a) === dateKeyFmt.format(b)

/** e.g. "Sat, 14 March 2026 · 9:00 AM – 12:00 PM" or a multi-day range. */
export function formatEventDates(start: string, end?: string) {
  const s = new Date(start)
  if (!end) return `${dayFmt.format(s)} · ${timeFmt.format(s)} (PHT)`
  const e = new Date(end)
  if (sameDay(s, e)) {
    return `${dayFmt.format(s)} · ${timeFmt.format(s)} – ${timeFmt.format(e)} (PHT)`
  }
  return `${dayFmt.format(s)} – ${dayFmt.format(e)}`
}

/** Calendar badge parts for an event card. */
export function dateBadge(start: string) {
  const d = new Date(start)
  return { month: monthFmt.format(d), day: dayNumFmt.format(d), year: yearFmt.format(d) }
}
