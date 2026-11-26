// News dates are shown in Philippine time regardless of the server's timezone.
const fmt = new Intl.DateTimeFormat('en-PH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Manila',
})

/** e.g. "26 November 2026" */
export const formatNewsDate = (iso: string) => fmt.format(new Date(iso))
