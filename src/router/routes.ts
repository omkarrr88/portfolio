import { projects } from '../content/projects'
import { achievements, publication } from '../content/profile'

/**
 * Every page on the site. Home is one long scroll with a chapter per section
 * (Work, Record, About, Contact), each shown whole on one screen; every item in
 * them opens its own page with its own URL.
 */
export type Route =
  | { readonly kind: 'home' }
  | { readonly kind: 'project'; readonly id: string }
  | { readonly kind: 'achievement'; readonly id: string }
  | { readonly kind: 'aboutItem'; readonly id: AboutId }
  | { readonly kind: 'notFound' }

export const ABOUT_IDS = ['riamona', 'terna', 'leadership', 'toolkit'] as const
export type AboutId = (typeof ABOUT_IDS)[number]

/** The four sections, in navigation order. */
export type SectionKey = 'work' | 'record' | 'about' | 'contact'

export interface Section {
  readonly key: SectionKey
  readonly label: string
  readonly href: string
}

/** Each section is a chapter of the home scroll: /#work and so on. */
export const SECTIONS: readonly Section[] = [
  { key: 'work', label: 'Work', href: '/#work' },
  { key: 'record', label: 'Record', href: '/#record' },
  { key: 'about', label: 'About', href: '/#about' },
  { key: 'contact', label: 'Contact', href: '/#contact' },
]

const SECTION_KEYS: readonly string[] = SECTIONS.map((s) => s.key)

/** "/work" and friends are chapters of the home scroll, not pages: the anchor to land on, or null. */
export function sectionAnchor(pathname: string): SectionKey | null {
  const key = normalisePath(pathname).slice(1)
  return SECTION_KEYS.includes(key) ? (key as SectionKey) : null
}

const RECORD_IDS: readonly string[] = [...achievements.map((a) => a.id), publication.id]
const PROJECT_IDS: readonly string[] = projects.map((p) => p.id)

const isAboutId = (id: string): id is AboutId => (ABOUT_IDS as readonly string[]).includes(id)

/** "/work/" and "/work" are the same page; the root stays "/". */
export function normalisePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function parseRoute(pathname: string): Route {
  const parts = normalisePath(pathname).split('/').filter(Boolean)
  const [section, id, ...rest] = parts
  if (rest.length > 0) return { kind: 'notFound' }
  if (!section) return { kind: 'home' }
  // A bare section is its chapter in the home scroll.
  if (!id) return sectionAnchor(`/${section}`) ? { kind: 'home' } : { kind: 'notFound' }
  switch (section) {
    case 'work':
      return PROJECT_IDS.includes(id) ? { kind: 'project', id } : { kind: 'notFound' }
    case 'record':
      return RECORD_IDS.includes(id) ? { kind: 'achievement', id } : { kind: 'notFound' }
    case 'about':
      return isAboutId(id) ? { kind: 'aboutItem', id } : { kind: 'notFound' }
    default:
      return { kind: 'notFound' }
  }
}

export function hrefFor(route: Route): string {
  switch (route.kind) {
    case 'home':
    case 'notFound':
      return '/'
    case 'project':
      return `/work/${route.id}`
    case 'achievement':
      return `/record/${route.id}`
    case 'aboutItem':
      return `/about/${route.id}`
  }
}

/** The section a page belongs to, for the HUD and the Index; null for home and a missing page. */
export function sectionOf(route: Route): SectionKey | null {
  switch (route.kind) {
    case 'project':
      return 'work'
    case 'achievement':
      return 'record'
    case 'aboutItem':
      return 'about'
    default:
      return null
  }
}

/** Every URL the site serves, for prerendering and the sitemap. */
export function allPaths(): string[] {
  return [
    '/',
    ...PROJECT_IDS.map((id) => `/work/${id}`),
    ...RECORD_IDS.map((id) => `/record/${id}`),
    ...ABOUT_IDS.map((id) => `/about/${id}`),
  ]
}
