'use client'

import React, { useDeferredValue, useEffect, useId, useMemo, useState } from 'react'

import type { DirectoryMember } from '../content/member-directory'
import { inputClass } from '../components/form'

/** The four research interest groups on the membership form. */
export const interestGroups = [
  'Educational Research',
  'Research Methodology',
  'Science Research',
  'Business Research',
] as const

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * Searchable member list, grouped by institution. The research interest filter
 * can be preset with ?interest=<group> (the Resources page links use this).
 */
export function MemberDirectory({ members }: { members: DirectoryMember[] }) {
  const [query, setQuery] = useState('')
  const [interest, setInterest] = useState('')
  const deferredQuery = useDeferredValue(query)
  const searchId = useId()
  const interestId = useId()

  // Read ?interest= after mount so the page itself stays static.
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('interest')
    if (preset && (interestGroups as readonly string[]).includes(preset)) setInterest(preset)
  }, [])

  const groups = useMemo(() => {
    const terms = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean)
    const matches = members.filter((m) => {
      if (interest && !m.interests.includes(interest)) return false
      if (!terms.length) return true
      const haystack = [m.name, m.institution, m.position, m.education, ...m.interests]
        .join(' ')
        .toLowerCase()
      return terms.every((t) => haystack.includes(t))
    })
    const byInstitution = new Map<string, DirectoryMember[]>()
    for (const m of matches) {
      if (!byInstitution.has(m.institution)) byInstitution.set(m.institution, [])
      byInstitution.get(m.institution)!.push(m)
    }
    return [...byInstitution.entries()]
  }, [members, deferredQuery, interest])

  const shown = groups.reduce((n, [, list]) => n + list.length, 0)

  return (
    <div>
      <div className="grid gap-4 rounded-xl border border-rule bg-white p-5 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:p-6">
        <div>
          <label htmlFor={searchId} className="block text-base font-semibold text-navy">
            Search members
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, institution, position or topic"
            autoComplete="off"
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor={interestId} className="block text-base font-semibold text-navy">
            Research interest
          </label>
          <select
            id={interestId}
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className={`mt-2 ${inputClass}`}
          >
            <option value="">All interests</option>
            {interestGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p role="status" className="mt-6 text-base text-ink-muted">
        Showing {plural(shown, 'member')} from {plural(groups.length, 'institution')}.
      </p>

      {groups.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-rule bg-white p-8 text-center text-base text-ink-muted">
          No members match your search. Try a different name or interest.
        </p>
      ) : (
        <div className="mt-8 space-y-12">
          {groups.map(([institution, list]) => (
            <section key={institution} aria-label={institution}>
              <h2 className="flex items-center gap-4 text-sm font-semibold tracking-[0.14em] text-crimson uppercase after:h-px after:flex-1 after:bg-rule">
                {institution}
                <span className="font-normal tracking-normal text-ink-muted normal-case">
                  {list.length}
                </span>
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {list.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-col rounded-xl border border-rule border-t-4 border-t-navy bg-white p-5"
                  >
                    <p className="font-display text-xl font-semibold text-navy">{m.name}</p>
                    {m.position && <p className="mt-1 text-base text-ink">{m.position}</p>}
                    {m.education && <p className="mt-1 text-sm text-ink-muted">{m.education}</p>}
                    {m.interests.length > 0 && (
                      <ul aria-label="Research interests" className="mt-3 flex flex-wrap gap-2">
                        {m.interests.map((i) => (
                          <li
                            key={i}
                            className="rounded-full bg-cream px-3 py-1 text-sm text-navy"
                          >
                            {i}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.published + m.ongoing > 0 && (
                      <p className="mt-auto pt-4 text-sm font-semibold text-ink-muted">
                        {m.published} published · {m.ongoing} ongoing
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
