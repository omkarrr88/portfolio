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
  /** Section anchor. */
  readonly id: string
  readonly title: string
  readonly devanagari?: string
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

export interface Achievement {
  readonly result: string
  readonly field?: string
  readonly event: string
  readonly organiser: string
  readonly place: string
  readonly date: string
  readonly detail: string
  readonly href?: string
  /** Anchor of the chapter the result was won with. */
  readonly projectId?: string
  readonly projectLabel?: string
}

export interface Role {
  readonly title: string
  readonly period: string
}

export interface Leadership {
  readonly org: string
  /** Most recent first. */
  readonly roles: readonly Role[]
  readonly detail: string
}

export interface Publication {
  readonly title: string
  readonly role: string
  readonly venue: string
  readonly status: string
  readonly date: string
  readonly projectId: string
}

export interface Chapter {
  /** 7 (outer ring) to 1 (inner ring); 0 is the centre. */
  readonly ring: number
  readonly label: string
  readonly anchor: string
}
