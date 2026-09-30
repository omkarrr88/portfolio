import { describe, expect, it } from 'vitest'
import {
  about,
  capitalise,
  contactLede,
  heroResults,
  heroResultsLabel,
  listJoin,
  numberWord,
  paperPhrase,
  periodStart,
  record,
  work,
  yearSpan,
} from './copy'

describe('the small helpers', () => {
  it('says small numbers in words and larger ones in digits', () => {
    expect(numberWord(3)).toBe('three')
    expect(numberWord(12)).toBe('twelve')
    expect(numberWord(13)).toBe('13')
    expect(capitalise('six')).toBe('Six')
  })

  it('joins lists the way a sentence does', () => {
    expect(listJoin([])).toBe('')
    expect(listJoin(['a'])).toBe('a')
    expect(listJoin(['a', 'b'])).toBe('a and b')
    expect(listJoin(['a', 'b', 'c'])).toBe('a, b and c')
  })

  it('finds the span of years in dates written any way', () => {
    expect(yearSpan(['Apr 2026', 'Aug 2026', 'Sept 2026'])).toBe('2026')
    expect(yearSpan(['2025', 'Apr 2026'])).toBe('2025–2026')
    expect(yearSpan(['Nov 2022 – June 2026'])).toBe('2022–2026')
    expect(yearSpan(['Ongoing'])).toBe('')
  })

  it('spells out when a period started', () => {
    expect(periodStart('Jan 2026 – Present')).toBe('January 2026')
    expect(periodStart('Sept 2024 - Oct 2025')).toBe('September 2024')
    expect(periodStart('2025')).toBe('2025')
  })

  it('names the paper by where it is in publishing', () => {
    expect(paperPhrase({ stage: 'under-review' })).toBe('a paper under review')
    expect(paperPhrase({ stage: 'accepted' })).toBe('an accepted paper')
    expect(paperPhrase({ stage: 'published' })).toBe('a published paper')
  })
})

describe('the copy worked out from the data', () => {
  it('reads as it did when it was written by hand', () => {
    expect(work.title()).toBe('Six builds, three hackathon results.')
    expect(work.lede()).toBe(
      'Chakravyuh, VayuNetra and Fitmon placed against 31,000, 15,000 and 7,000 teams. Open any project for the full write-up.',
    )
    expect(record.title()).toBe('Three hackathon results in 2026, and a paper under review.')
    expect(record.lede()).toBe(
      'Plus a finalist place in Mumbai University’s research competition. Open any of them for the story and the project behind it.',
    )
    expect(about.title()).toBe('I build full-stack products at Riamona.')
    expect(about.lede()).toContain('Full Stack Engineer since January 2026:')
    expect(about.lede()).toContain('three committees')
    expect(heroResultsLabel()).toBe('2026, in three results')
  })

  it('keeps the hero to three results, hackathons only', () => {
    expect(heroResults).toHaveLength(3)
    expect(heroResults.every((a) => a.kind === 'hackathon')).toBe(true)
  })

  it('states availability and the reply time at the centre', () => {
    expect(contactLede()).toBe(
      'I’m looking for full-stack, platform and ML engineering roles, and I take on freelance and contract work. I reply within 24 hours.',
    )
  })
})
