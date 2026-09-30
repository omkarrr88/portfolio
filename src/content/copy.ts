import { achievements, education, experience, leadership, person, publication } from './profile'
import { featured, projectById, projects } from './projects'
import type { Achievement, Publication } from './types'

/**
 * Headlines and ledes that count or date things, worked out from the data so
 * they stay true as projects, results and roles are added.
 */

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/** "three" up to twelve, digits beyond: how a sentence would say it. */
export const numberWord = (n: number): string => WORDS[n] ?? String(n)

export const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

/** "a", "a and b", "a, b and c". */
export function listJoin(items: readonly string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

const plural = (n: number, word: string) => (n === 1 ? word : `${word}s`)

/** The years a set of dated things spans: "2026", "2025–2026"; empty when none carries a year. */
export function yearSpan(dates: readonly string[]): string {
  const years = dates.flatMap((d) => d.match(/\d{4}/g) ?? []).map(Number)
  if (years.length === 0) return ''
  const first = Math.min(...years)
  const last = Math.max(...years)
  return first === last ? String(first) : `${first}–${last}`
}

const MONTHS: Record<string, string> = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Sept: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December',
}

/** The start of a period such as "Jan 2026 – Present", spelled out: "January 2026". */
export function periodStart(period: string): string {
  const [start = ''] = period.split(/\s+[–-]\s+/)
  return start.replace(/^([A-Z][a-z]+)\b/, (month) => MONTHS[month] ?? month)
}

/** How a headline refers to the paper, by where it is in publishing. */
export function paperPhrase(paper: Pick<Publication, 'stage'>): string {
  switch (paper.stage) {
    case 'under-review':
      return 'a paper under review'
    case 'accepted':
      return 'an accepted paper'
    case 'published':
      return 'a published paper'
  }
}

/** The event's name where space is tight. */
export const eventName = (a: Achievement): string => a.eventShort ?? a.event

export const hackathons: readonly Achievement[] = achievements.filter((a) => a.kind === 'hackathon')
const competitions: readonly Achievement[] = achievements.filter((a) => a.kind !== 'hackathon')

/** The hero lists this many results; the Record chapter has the rest. */
const HERO_RESULTS = 3
export const heroResults: readonly Achievement[] = hackathons.slice(0, HERO_RESULTS)

/** The project a result was finally won with (the last round). */
export function finalProjectName(a: Achievement): string | undefined {
  const last = a.wonWith[a.wonWith.length - 1]
  const p = last ? projectById(last.projectId) : undefined
  return p?.short ?? p?.title
}

/** "2026, in three results": the label over the hero's results. */
export const heroResultsLabel = (): string => {
  const years = yearSpan(heroResults.map((a) => a.date))
  const count = `in ${numberWord(heroResults.length)} ${plural(heroResults.length, 'result')}`
  return years ? `${years}, ${count}` : capitalise(count)
}

/** The number in a field size: "of 31,000+ teams" gives "31,000". */
const fieldSize = (a: Achievement) => a.field?.match(/\d[\d,]*/)?.[0]

export const work = {
  title: (): string =>
    `${capitalise(numberWord(projects.length))} ${plural(projects.length, 'build')}, ${numberWord(hackathons.length)} hackathon ${plural(hackathons.length, 'result')}.`,
  lede: (): string => {
    // The featured projects that placed against a counted field, with the size of each field.
    const placed = featured.flatMap((p) => {
      const won = hackathons.find((a) => a.wonWith[a.wonWith.length - 1]?.projectId === p.id)
      const size = won ? fieldSize(won) : undefined
      return size ? [{ name: p.short ?? p.title, size }] : []
    })
    const open = 'Open any project for the full write-up.'
    if (placed.length === 0) return open
    return `${listJoin(placed.map((x) => x.name))} placed against ${listJoin(placed.map((x) => x.size))} teams. ${open}`
  },
}

export const record = {
  title: (): string => {
    const years = yearSpan(hackathons.map((a) => a.date))
    const results = `${capitalise(numberWord(hackathons.length))} hackathon ${plural(hackathons.length, 'result')}`
    return `${results}${years ? ` in ${years}` : ''}, and ${paperPhrase(publication)}.`
  },
  lede: (): string => {
    const open = 'Open any of them for the story and the project behind it.'
    if (competitions.length === 0) return open
    const asides = competitions.map((a) => a.aside ?? `${a.result.toLowerCase()} at ${a.event}`)
    return `Plus ${listJoin(asides)}. ${open}`
  },
}

const [job] = experience
const [degree] = education

export const about = {
  title: (): string => `I build full-stack products at ${job.short}.`,
  lede: (): string =>
    `${job.role} since ${periodStart(job.period)}: the code, the tests, the CI/CD, and running it all in production. Alongside it, a degree at Terna, ${numberWord(leadership.length)} ${plural(leadership.length, 'committee')}, and the tools I use.`,
  degreeYears: (): string => yearSpan([degree.period]),
}

/** "I'm looking for …", with the availability and the reply-time promise: the lede at the centre. */
export const contactLede = (): string =>
  `I’m looking for ${person.lookingFor.charAt(0).toLowerCase()}${person.lookingFor.slice(1, -1)}, and I take on freelance and contract work. I reply within ${person.replyWithin}.`
