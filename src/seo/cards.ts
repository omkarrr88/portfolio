import { capitalise, eventName, finalProjectName, heroResults, numberWord } from '../content/copy'
import { achievements, education, experience, leadership, person, publication, skills } from '../content/profile'
import { projectById, projects } from '../content/projects'
import { pad } from '../lib/format'
import type { Route } from '../router/routes'

/** What a page's share image says, top to bottom. Drawn by scripts/og-cards.ts. */
export interface Card {
  readonly eyebrow: string
  readonly title: string
  readonly subtitle: string
  /** In the accent colour: the result, the placement, the period. */
  readonly accent: string
  /** Read aloud by platforms that describe images. */
  readonly alt: string
}

const [job] = experience
const [degree] = education
const toolCount = skills.reduce((n, g) => n + g.items.length, 0)

const describe = (card: Omit<Card, 'alt'>): Card => ({
  ...card,
  alt: [card.title, card.subtitle, card.accent].filter(Boolean).join('. ') + `. ${person.name}, ${person.role}.`,
})

/** The share image for a route; null for pages that use the home card (the 404). */
export function cardFor(route: Route): Card | null {
  switch (route.kind) {
    case 'home':
      return describe({
        eyebrow: `${person.role} · ${person.place}`,
        title: person.name,
        subtitle: person.availability,
        accent: heroResults.map((a) => `${a.result} ${a.field ?? ''} · ${eventName(a)}`.replace(/\s+/g, ' ')).join('\n'),
      })
    case 'project': {
      const index = projects.findIndex((p) => p.id === route.id)
      const p = projectById(route.id)
      if (!p) return null
      return describe({
        eyebrow: `Work · No. ${pad(index + 1)} · ${p.category}`,
        title: p.title,
        subtitle: p.subtitle,
        accent: p.placement ?? p.date,
      })
    }
    case 'achievement': {
      if (route.id === publication.id) {
        return describe({
          eyebrow: `Record · ${publication.status}`,
          title: publication.title,
          subtitle: `${publication.role} · ${publication.venue}`,
          accent: `Submitted ${publication.date}`,
        })
      }
      const a = achievements.find((x) => x.id === route.id)
      if (!a) return null
      const project = finalProjectName(a)
      return describe({
        eyebrow: `Record · ${a.place} · ${a.date}`,
        title: a.result,
        subtitle: [a.field, a.event].filter(Boolean).join(' · '),
        accent: project ? `With ${project}` : a.organiser,
      })
    }
    case 'aboutItem':
      switch (route.id) {
        case 'riamona':
          return describe({ eyebrow: 'About · Experience', title: job.role, subtitle: `${job.org} · ${job.place}`, accent: job.period })
        case 'terna':
          return describe({
            eyebrow: 'About · Education',
            title: degree.title,
            subtitle: `${degree.school} · ${degree.place}`,
            accent: degree.period,
          })
        case 'leadership':
          return describe({
            eyebrow: `About · Leadership · ${capitalise(numberWord(leadership.length))} committees`,
            title: 'Started as a member, went on to lead',
            subtitle: leadership.map((l) => l.peak).join(' · '),
            accent: leadership.map((l) => l.org.split(',')[0]).join(' · '),
          })
        case 'toolkit':
          return describe({
            eyebrow: 'About · Toolkit',
            title: 'What I reach for',
            subtitle: skills.map((g) => g.group).join(' · '),
            accent: `${skills.length} groups, ${toolCount} tools`,
          })
      }
      return null
    case 'notFound':
      return null
  }
}
