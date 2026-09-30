import { describe, expect, it } from 'vitest'
import { metaFor } from '../src/router/meta'
import { parseRoute } from '../src/router/routes'
import { notFoundHtml, pageHtml, preloadTags, sitemapXml, type PageParts } from './route-pages'

const ORIGIN = 'https://omkar-kadam.vercel.app'

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
    <meta property="og:image" content="https://omkar-kadam.vercel.app/og/home.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="Home card" />
    <meta name="twitter:title" content="Home" />
    <meta
      name="twitter:description"
      content="Home twitter"
    />
    <meta name="twitter:image" content="https://omkar-kadam.vercel.app/og/home.png" />
    <meta name="twitter:image:alt" content="Home card" />
    <script type="application/ld+json">
      { "@type": "Person" }
    </script>
</head>
<body><div id="root"></div></body>`

const PARTS: PageParts = {
  origin: ORIGIN,
  body: '<main><h1>Chakravyuh</h1><p>Costs $5 &amp; $& more</p></main>',
  jsonLd: '{"@type":"WebPage"}',
  image: `${ORIGIN}/og/work-chakravyuh.png`,
  imageAlt: 'Chakravyuh & more',
}

const render = (path: string, template = TEMPLATE, parts = PARTS) =>
  pageHtml(template, path, metaFor(parseRoute(path)), parts)

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

  it('gives the page its own share image, alt text and structured data', () => {
    const html = render('/work/chakravyuh')
    expect(html).toContain('<meta property="og:image" content="https://omkar-kadam.vercel.app/og/work-chakravyuh.png" />')
    expect(html).toContain('<meta name="twitter:image" content="https://omkar-kadam.vercel.app/og/work-chakravyuh.png" />')
    expect(html).toContain('<meta property="og:image:type" content="image/png" />')
    expect(html).toContain('<meta property="og:image:alt" content="Chakravyuh &amp; more" />')
    expect(html).toContain('{"@type":"WebPage"}')
    expect(html).not.toContain('"@type": "Person"')
  })

  it('puts the prerendered page inside the root, "$" and all', () => {
    const html = render('/work/chakravyuh')
    expect(html).toContain(
      '<div id="root" data-path="/work/chakravyuh"><main><h1>Chakravyuh</h1><p>Costs $5 &amp; $& more</p></main></div>',
    )
  })

  it('escapes characters that would break an attribute', () => {
    const html = render('/about/leadership')
    expect(html).toContain('T&amp;P Cell')
    expect(html).not.toMatch(/content="[^"]*&P/)
  })

  it('fails loudly when the template lost a tag', () => {
    expect(() => render('/work/chakravyuh', '<title>x</title>')).toThrow(/not found/)
    expect(() => render('/work/chakravyuh', TEMPLATE.replace('<div id="root"></div>', ''))).toThrow(/root/)
  })
})

describe('notFoundHtml', () => {
  it('keeps the page out of search results, with no canonical of its own', () => {
    const html = notFoundHtml(render('/404'), ORIGIN)
    expect(html).toContain('<meta name="robots" content="noindex" />')
    expect(html).toContain('<title>Not found · Omkar Kadam</title>')
    expect(html).not.toContain('rel="canonical"')
    expect(html).toContain('<meta property="og:url" content="https://omkar-kadam.vercel.app/" />')
    expect(html).not.toMatch(/name="description"\s+content=""/)
  })
})

describe('preloadTags', () => {
  it('preloads the first screen’s fonts and the entrance script, once each', () => {
    const tags = preloadTags([
      'familjen-grotesk-latin-400-normal-abc.woff2',
      'familjen-grotesk-latin-400-normal-abc.woff',
      'familjen-grotesk-latin-ext-400-normal-xyz.woff2',
      'familjen-grotesk-latin-600-normal-def.woff2',
      'ibm-plex-mono-latin-500-normal-ghi.woff2',
      'reveals-123.js',
      'RingScene-456.js',
    ])
    expect(tags).toContain('href="/assets/familjen-grotesk-latin-400-normal-abc.woff2"')
    expect(tags).toContain('href="/assets/familjen-grotesk-latin-600-normal-def.woff2"')
    expect(tags).toContain('href="/assets/ibm-plex-mono-latin-500-normal-ghi.woff2"')
    expect(tags).toContain('<link rel="modulepreload" crossorigin href="/assets/reveals-123.js" />')
    expect(tags).not.toContain('latin-ext')
    expect(tags).not.toContain('.woff"')
    expect(tags).not.toContain('RingScene')
  })
})

describe('sitemapXml', () => {
  it('lists every path with the build date', () => {
    const xml = sitemapXml(ORIGIN, ['/', '/work/chakravyuh'], '2026-09-30')
    expect(xml).toContain('<loc>https://omkar-kadam.vercel.app/</loc>')
    expect(xml).toContain('<loc>https://omkar-kadam.vercel.app/work/chakravyuh</loc>')
    expect(xml.match(/<lastmod>2026-09-30<\/lastmod>/g)).toHaveLength(2)
  })
})
