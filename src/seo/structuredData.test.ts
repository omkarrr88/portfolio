import { describe, expect, it } from 'vitest'
import { metaFor } from '../router/meta'
import { allPaths, parseRoute } from '../router/routes'
import { isoDate, jsonLdScript, personNode, structuredData } from './structuredData'
import { ORIGIN, pathSlug, shareImagePath } from './site'

type Node = Record<string, unknown>
const graphOf = (path: string): Node[] => {
  const route = parseRoute(path)
  return (structuredData(route, path, metaFor(route))['@graph'] as Node[]) ?? []
}
const byType = (graph: Node[], type: string) => graph.find((n) => n['@type'] === type)

describe('structured data', () => {
  it('describes home as a profile page about one person', () => {
    const graph = graphOf('/')
    const page = byType(graph, 'ProfilePage')
    expect(page?.mainEntity).toEqual({ '@id': `${ORIGIN}/#person` })
    const person = byType(graph, 'Person')
    expect(person?.name).toBe('Omkar Kadam')
    expect(person?.sameAs).toEqual(['https://github.com/omkarrr88', 'https://www.linkedin.com/in/omkarrrr'])
    expect(person?.award).toContain('7th of 31,000+ teams Meta PyTorch Hackathon (2026)')
  })

  it('gives every other page a breadcrumb and the same person', () => {
    for (const path of allPaths().filter((p) => p !== '/')) {
      const graph = graphOf(path)
      const crumbs = byType(graph, 'BreadcrumbList')?.itemListElement as Node[]
      expect(crumbs, path).toHaveLength(2)
      expect(crumbs[1]?.item, path).toBe(`${ORIGIN}${path}`)
      expect(byType(graph, 'Person')?.['@id'], path).toBe(`${ORIGIN}/#person`)
    }
  })

  it('names a project as source code, with its repo', () => {
    const code = byType(graphOf('/work/chakravyuh'), 'SoftwareSourceCode')
    expect(code?.codeRepository).toBe('https://github.com/omkarrr88/Chakravyuh')
    expect(code?.dateCreated).toBe('2026-04')
    expect(code?.author).toEqual({ '@id': `${ORIGIN}/#person` })
  })

  it('names the paper as a scholarly article with its status', () => {
    const article = byType(graphOf('/record/paper'), 'ScholarlyArticle')
    expect(article?.creativeWorkStatus).toBe('Submitted, under peer review')
  })

  it('points a result at the projects it was won with', () => {
    const page = byType(graphOf('/record/meta-pytorch'), 'WebPage')
    expect(page?.mentions).toEqual([
      { '@id': `${ORIGIN}/work/debugger#work` },
      { '@id': `${ORIGIN}/work/chakravyuh#work` },
    ])
  })

  it('reads dates written any way', () => {
    expect(isoDate('April 2026')).toBe('2026-04')
    expect(isoDate('Sept 2026')).toBe('2026-09')
    expect(isoDate('2025')).toBe('2025')
    expect(isoDate('Ongoing')).toBeUndefined()
  })

  it('can never close its own script tag', () => {
    expect(jsonLdScript({ name: '</script><script>alert(1)</script>' })).not.toContain('</script>')
    expect(JSON.parse(jsonLdScript(personNode())).name).toBe('Omkar Kadam')
  })
})

describe('site paths', () => {
  it('names per-page files after the path', () => {
    expect(pathSlug('/')).toBe('home')
    expect(pathSlug('/work/chakravyuh')).toBe('work-chakravyuh')
    expect(shareImagePath('/record/paper')).toBe('/og/record-paper.png')
  })
})
