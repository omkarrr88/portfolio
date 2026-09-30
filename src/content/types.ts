import type { BrandId } from './brands'

/** Shapes of everything the site says. Facts come from public/resume.tex and each project's repo. */

export interface Link {
  readonly label: string
  readonly href: string
}

export interface Figure {
  readonly src: string
  readonly width: number
  readonly height: number
  readonly alt: string
  /** Short label under a single phone screenshot; the sheet-level caption lives on the project. */
  readonly label?: string
}

export interface Fact {
  readonly term: string
  readonly detail: string
}

export interface KeyNumber {
  readonly value: string
  readonly label: string
}

/** How a project's figures are framed on the sheet. */
export type FigureLayout = 'chart' | 'screen' | 'phones'

export interface Project {
  /** URL slug: /work/<id>. */
  readonly id: string
  readonly title: string
  /** Shorter name for breadcrumbs and the ring label, when the title is long. */
  readonly short?: string
  readonly subtitle: string
  readonly category: string
  readonly date: string
  readonly place?: string
  readonly placement?: string
  /** One-line hook shown large over the formation before the sheet lands. */
  readonly hook?: string
  readonly figureLayout?: FigureLayout
  readonly figures: readonly Figure[]
  readonly caption?: string
  readonly numbers: readonly KeyNumber[]
  readonly body: readonly string[]
  readonly facts: readonly Fact[]
  readonly links: readonly Link[]
}

export interface Experience {
  readonly role: string
  readonly org: string
  readonly place: string
  readonly period: string
  readonly points: readonly string[]
  readonly stack: readonly string[]
}

export interface Education {
  readonly title: string
  readonly school: string
  readonly place: string
  readonly period: string
}

export interface SkillGroup {
  readonly group: string
  readonly items: readonly string[]
}

/** A project an achievement was won with, and at what stage. */
export interface WonWith {
  readonly projectId: string
  readonly note: string
}

export interface Achievement {
  /** URL slug: /record/<id>. */
  readonly id: string
  /** Short name for labels and breadcrumbs. */
  readonly short: string
  readonly result: string
  readonly field?: string
  readonly event: string
  readonly organiser: string
  readonly place: string
  readonly date: string
  readonly detail: string
  readonly href?: string
  readonly wonWith: readonly WonWith[]
  /** Organisers' logos, shown beside the result. */
  readonly brands: readonly BrandId[]
}

export interface Role {
  readonly title: string
  readonly period: string
}

export interface Leadership {
  readonly org: string
  /** The role that best sums up the ladder, for one-line summaries. */
  readonly peak: string
  /** Most recent first. */
  readonly roles: readonly Role[]
  readonly detail: string
  /** The committee's own page (Instagram). */
  readonly href?: string
}

export interface Publication {
  /** URL slug: /record/<id>. */
  readonly id: string
  readonly short: string
  readonly title: string
  readonly role: string
  readonly venue: string
  readonly status: string
  readonly date: string
  readonly projectId: string
}


/** A chapter of the home scroll. */
export interface Chapter {
  /** Where the camera settles for it: 0 is the outer ring, 7 the centre. */
  readonly stage: number
  readonly label: string
  /** Element id, so links can jump to it: /#work. */
  readonly anchor: string
}
