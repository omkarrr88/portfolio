import { projectById, projects } from '../content/projects'
import { achievements, education, experience, leadership, person, publication } from '../content/profile'
import { ABOUT_IDS, type AboutId, type Route } from './routes'

export interface Crumb {
  readonly label: string
  readonly href: string
}

export interface PageMeta {
  /** Document title. */
  readonly title: string
  readonly description: string
  /** Short name: the ring label and the last breadcrumb. */
  readonly label: string
  /** Section, then item; empty on the home page. */
  readonly crumbs: readonly Crumb[]
}

export interface Placement {
  /** Formation stage: 0 frames the outer ring, 7 is the centre. */
  readonly stage: number
  /** Rotation of the formation, radians; each section and item faces a different way. */
  readonly yaw: number
}

const SITE = person.name
/**
 * Each section's pages sit one ring deeper than its chapter in the home scroll
 * (Work 1, Record 3, About 5), so opening one dives a ring further in.
 */
const DETAIL_STAGE = { work: 2, record: 4, about: 6 } as const
const MISSING_STAGE = 1
const SECTION_YAW = { about: -0.7, work: 0, record: 0.7 } as const
/** Neighbouring items sit this far apart around the ring, so Next turns the formation. */
const ITEM_YAW_STEP = 0.5

export const ABOUT_LABELS: Record<AboutId, string> = {
  riamona: 'Riamona',
  terna: 'Terna',
  leadership: 'Leadership',
  toolkit: 'Toolkit',
}

const ABOUT_TITLES: Record<AboutId, string> = {
  riamona: 'Full Stack Engineer at Riamona',
  terna: 'BE Information Technology, Terna',
  leadership: 'Leadership',
  toolkit: 'Toolkit',
}

const [job] = experience
const [degree] = education

/** One line per About page, for search results and link previews. */
const ABOUT_DESCRIPTIONS: Record<AboutId, string> = {
  riamona: `${job.role} at ${job.org}, ${job.place}. ${job.period}.`,
  terna: `${degree.title}, ${degree.school}, ${degree.place}. ${degree.period}.`,
  leadership: `Three committees at Terna: ${leadership.map((l) => l.peak).join('; ')}.`,
  toolkit: 'The languages, frameworks, ML and infrastructure tools I work with, grouped by area.',
}

const titled = (...parts: string[]) => [...parts, SITE].join(' · ')
const itemYaw = (base: number, index: number) => base + ((index % 3) - 1) * ITEM_YAW_STEP

const WORK: Crumb = { label: 'Work', href: '/#work' }
const RECORD: Crumb = { label: 'Record', href: '/#record' }
const ABOUT: Crumb = { label: 'About', href: '/#about' }

const recordItem = (id: string) => {
  if (id === publication.id) {
    return { label: publication.short, title: 'V2V paper', event: publication.title, detail: publication.status }
  }
  const a = achievements.find((x) => x.id === id)
  return a ? { label: a.short, title: a.event, event: a.event, detail: `${a.result} ${a.field ?? ''}`.trim() } : null
}

export function metaFor(route: Route): PageMeta {
  switch (route.kind) {
    case 'home':
      return {
        title: `${SITE} · ${person.role}`,
        description: `${person.intro} ${person.role} in ${person.place}.`,
        label: 'Home',
        crumbs: [],
      }
    case 'project': {
      const p = projectById(route.id)
      const label = p?.short ?? p?.title ?? 'Project'
      return {
        title: titled(p?.title ?? 'Project', 'Work'),
        description: p ? `${p.subtitle}. ${p.placement ?? ''}`.trim() : '',
        label,
        crumbs: [WORK, { label, href: `/work/${route.id}` }],
      }
    }
    case 'achievement': {
      const item = recordItem(route.id)
      const label = item?.label ?? 'Result'
      return {
        title: titled(item?.title ?? 'Result', 'Record'),
        description: item ? `${item.detail}: ${item.event}.` : '',
        label,
        crumbs: [RECORD, { label, href: `/record/${route.id}` }],
      }
    }
    case 'aboutItem':
      return {
        title: titled(ABOUT_TITLES[route.id], 'About'),
        description: ABOUT_DESCRIPTIONS[route.id],
        label: ABOUT_LABELS[route.id],
        crumbs: [ABOUT, { label: ABOUT_LABELS[route.id], href: `/about/${route.id}` }],
      }
    case 'notFound':
      return { title: titled('Not found'), description: '', label: 'Nothing here', crumbs: [] }
  }
}

/** Home's own depth comes from the scroll; everything else has a fixed place. */
export function placementFor(route: Route): Placement {
  switch (route.kind) {
    case 'home':
      return { stage: 0, yaw: 0 }
    case 'project':
      return { stage: DETAIL_STAGE.work, yaw: itemYaw(SECTION_YAW.work, projects.findIndex((p) => p.id === route.id)) }
    case 'achievement': {
      const ids = [...achievements.map((a) => a.id), publication.id]
      return { stage: DETAIL_STAGE.record, yaw: itemYaw(SECTION_YAW.record, ids.indexOf(route.id)) }
    }
    case 'aboutItem':
      return { stage: DETAIL_STAGE.about, yaw: itemYaw(SECTION_YAW.about, ABOUT_IDS.indexOf(route.id)) }
    case 'notFound':
      return { stage: MISSING_STAGE, yaw: 0 }
  }
}
