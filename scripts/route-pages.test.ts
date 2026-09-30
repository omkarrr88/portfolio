import { describe, expect, it } from 'vitest'
import { metaFor } from '../src/router/meta'
import { parseRoute } from '../src/router/routes'
import { notFoundHtml, pageHtml, sitemapXml } from './route-pages'

const render = (path: string, template = TEMPLATE) => pageHtml(template, path, metaFor(parseRoute(path)))

const TEMPLATE = `<head>
    <title>Omkar Kadam · Full-stack &amp; ML engineer</title>
    <meta
      name="description"
      content="Home description"
    />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://omkar-kadam.vercel.app/" />
    <meta property="og:url" content="https://omkar-kadam.vercel.app/" />
    <meta property="og:title" content="Home" />
    <meta
      property="og:description"
      content="Home og"
    />
    <meta name="twitter:title" content="Home" />
    <meta
      name="twitter:description"
      content="Home twitter"
    />
</head>`

describe('pageHtml', () => {
  it('retitles and relinks the shell for a project', () => {
    const html = render('/work/chakravyuh')
    expect(html).toContain('<title>Chakravyuh · Work · Omkar Kadam</title>')
    expect(html).toContain('<link rel="canonical" href="https://omkar-kadam.vercel.app/work/chakravyuh" />')
    expect(html).toContain('<meta property="og:url" content="https://omkar-kadam.vercel.app/work/chakravyuh" />')
    expect(html).not.toContain('Home description')
    expect(html).not.toContain('Home og')
    expect(html).not.toContain('Home twitter')
  })

  it('escapes characters that would break an attribute', () => {
    const html = render('/about/leadership')
    expect(html).toContain('T&amp;P Cell')
    expect(html).not.toMatch(/content="[^"]*&P/)
  })

  it('fails loudly when the template lost a tag', () => {
    expect(() => render('/work', '<title>x</title>')).toThrow(/not found/)
  })
})

describe('notFoundHtml', () => {
  it('keeps the page out of search results', () => {
    const html = notFoundHtml(TEMPLATE, metaFor({ kind: 'notFound' }).title)
    expect(html).toContain('<meta name="robots" content="noindex" />')
    expect(html).toContain('<title>Not found · Omkar Kadam</title>')
  })
})

describe('sitemapXml', () => {
  it('lists every path with the build date', () => {
    const xml = sitemapXml(['/', '/work'], '2026-09-30')
    expect(xml).toContain('<loc>https://omkar-kadam.vercel.app/</loc>')
    expect(xml).toContain('<loc>https://omkar-kadam.vercel.app/work</loc>')
    expect(xml.match(/<lastmod>2026-09-30<\/lastmod>/g)).toHaveLength(2)
  })
})
