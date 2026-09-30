import { describe, expect, it } from 'vitest'
import { chapters } from '../content/chapters'
import { allPaths, hrefFor, normalisePath, parseRoute, sectionAnchor, sectionOf, SECTIONS } from './routes'
import { metaFor, placementFor } from './meta'

describe('normalisePath', () => {
  it('drops trailing slashes but keeps the root', () => {
    expect(normalisePath('/work/')).toBe('/work')
    expect(normalisePath('/work//')).toBe('/work')
    expect(normalisePath('/')).toBe('/')
    expect(normalisePath('')).toBe('/')
  })
})

describe('parseRoute', () => {
  it('reads home and every item', () => {
    expect(parseRoute('/')).toEqual({ kind: 'home' })
    expect(parseRoute('/work/chakravyuh')).toEqual({ kind: 'project', id: 'chakravyuh' })
    expect(parseRoute('/record/meta-pytorch')).toEqual({ kind: 'achievement', id: 'meta-pytorch' })
    expect(parseRoute('/record/paper')).toEqual({ kind: 'achievement', id: 'paper' })
    expect(parseRoute('/about/toolkit/')).toEqual({ kind: 'aboutItem', id: 'toolkit' })
  })

  it('treats a bare section as its chapter of the home scroll', () => {
    for (const path of ['/work', '/record/', '/about', '/contact']) {
      expect(parseRoute(path), path).toEqual({ kind: 'home' })
    }
    expect(sectionAnchor('/record/')).toBe('record')
    expect(sectionAnchor('/work/chakravyuh')).toBeNull()
    expect(sectionAnchor('/')).toBeNull()
  })

  it('sends unknown ids, sections and extra depth to not found', () => {
    for (const path of ['/work/nope', '/record/x', '/about/y', '/contact/z', '/blog', '/work/chakravyuh/more']) {
      expect(parseRoute(path), path).toEqual({ kind: 'notFound' })
    }
  })
})

describe('sections and chapters', () => {
  it('every section links to a chapter of the home scroll', () => {
    const anchors = chapters.map((c) => c.anchor)
    for (const s of SECTIONS) {
      expect(s.href).toBe(`/#${s.key}`)
      expect(anchors).toContain(s.key)
    }
  })

  it('chapters go steadily inward and end at the centre', () => {
    const stages = chapters.map((c) => c.stage)
    expect(stages[0]).toBe(0)
    expect(stages[stages.length - 1]).toBe(7)
    expect([...stages].sort((a, b) => a - b)).toEqual(stages)
  })
})

describe('allPaths', () => {
  const paths = allPaths()

  it('lists every page once, and each parses and round-trips', () => {
    expect(new Set(paths).size).toBe(paths.length)
    for (const path of paths) {
      const route = parseRoute(path)
      expect(route.kind, path).not.toBe('notFound')
      expect(hrefFor(route)).toBe(path)
    }
  })

  it('covers home, six projects, five record items and four about items', () => {
    expect(paths[0]).toBe('/')
    expect(paths.filter((p) => p.startsWith('/work/'))).toHaveLength(6)
    expect(paths.filter((p) => p.startsWith('/record/'))).toHaveLength(5)
    expect(paths.filter((p) => p.startsWith('/about/'))).toHaveLength(4)
    expect(paths).toHaveLength(16)
  })
})

describe('metaFor and placementFor', () => {
  it('gives every page a title, a label and a place in the formation', () => {
    for (const path of allPaths()) {
      const route = parseRoute(path)
      const meta = metaFor(route)
      expect(meta.title, path).toMatch(/Omkar Kadam/)
      expect(meta.label.length, path).toBeGreaterThan(0)
      const { stage } = placementFor(route)
      expect(stage, path).toBeGreaterThanOrEqual(0)
      expect(stage, path).toBeLessThanOrEqual(7)
    }
  })

  it('puts each page one ring deeper than its chapter', () => {
    const stageOf = (anchor: string) => chapters.find((c) => c.anchor === anchor)?.stage ?? NaN
    expect(placementFor({ kind: 'project', id: 'fitmon' }).stage).toBe(stageOf('work') + 1)
    expect(placementFor({ kind: 'achievement', id: 'iqoo' }).stage).toBe(stageOf('record') + 1)
    expect(placementFor({ kind: 'aboutItem', id: 'terna' }).stage).toBe(stageOf('about') + 1)
  })

  it('turns the formation between neighbouring projects', () => {
    const a = placementFor({ kind: 'project', id: 'chakravyuh' }).yaw
    const b = placementFor({ kind: 'project', id: 'vayunetra' }).yaw
    expect(a).not.toBeCloseTo(b, 3)
  })

  it('builds breadcrumbs from chapter to item', () => {
    expect(metaFor({ kind: 'project', id: 'debugger' }).crumbs.map((c) => c.href)).toEqual(['/#work', '/work/debugger'])
    expect(sectionOf({ kind: 'achievement', id: 'iqoo' })).toBe('record')
    expect(sectionOf({ kind: 'home' })).toBeNull()
  })
})
