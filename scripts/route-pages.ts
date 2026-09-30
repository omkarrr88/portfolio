import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { runnerImport, type Plugin } from 'vite'
import type { PageMeta } from '../src/router/meta.ts'
import { loadFonts, renderCard } from './og-cards.ts'

type MetaModule = typeof import('../src/router/meta.ts')
type RoutesModule = typeof import('../src/router/routes.ts')
/** src/entry-server.tsx (TSX, which this node-side project doesn't compile; Vite runs it). */
interface ServerModule {
  render(path: string): string
}
type StructuredDataModule = typeof import('../src/seo/structuredData.ts')
type CardsModule = typeof import('../src/seo/cards.ts')
type SiteModule = typeof import('../src/seo/site.ts')

/** What goes into one page's HTML besides its title and description. */
export interface PageParts {
  readonly origin: string
  /** The page itself, prerendered; the browser hydrates it. */
  readonly body: string
  /** schema.org JSON-LD, already escaped for a script element. */
  readonly jsonLd: string
  /** Absolute URL of the page's share image, and what it shows. */
  readonly image: string
  readonly imageAlt: string
}

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Replace the captured value of a tag in the template; a missing tag fails the build rather than shipping stale meta. */
function setValue(html: string, pattern: RegExp, value: string, escape = true): string {
  if (!pattern.test(html)) throw new Error(`route-pages: ${pattern} not found in index.html`)
  const text = escape ? escapeHtml(value) : value
  return html.replace(pattern, (_match, before: string, after: string) => `${before}${text}${after}`)
}

const attr = (key: string, name: string) => new RegExp(`(<meta\\s+${key}="${name}"\\s+content=")[^"]*(")`)
const ROOT = /<div id="root"><\/div>/
const JSON_LD = /(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/

/** The built index.html, filled in for one route, so crawlers and shared links see the real page. */
export function pageHtml(template: string, path: string, meta: PageMeta, parts: PageParts): string {
  const url = `${parts.origin}${path}`
  let html = template
  html = setValue(html, /(<title>)[^<]*(<\/title>)/, meta.title)
  html = setValue(html, attr('name', 'description'), meta.description)
  html = setValue(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, url)
  html = setValue(html, attr('property', 'og:url'), url)
  html = setValue(html, attr('property', 'og:title'), meta.title)
  html = setValue(html, attr('property', 'og:description'), meta.description)
  html = setValue(html, attr('property', 'og:image'), parts.image)
  html = setValue(html, attr('property', 'og:image:alt'), parts.imageAlt)
  html = setValue(html, attr('name', 'twitter:title'), meta.title)
  html = setValue(html, attr('name', 'twitter:description'), meta.description)
  html = setValue(html, attr('name', 'twitter:image'), parts.image)
  html = setValue(html, attr('name', 'twitter:image:alt'), parts.imageAlt)
  html = setValue(html, JSON_LD, `\n      ${parts.jsonLd}\n    `, false)
  // The path says which page this HTML is, so the browser only hydrates it at the same route (src/main.tsx).
  // A function replacement, so "$" in the page's text is never read as a replacement pattern.
  if (!ROOT.test(html)) throw new Error('route-pages: <div id="root"></div> not found in index.html')
  return html.replace(ROOT, () => `<div id="root" data-path="${escapeHtml(path)}">${parts.body}</div>`)
}

/**
 * An address that doesn't exist: kept out of search results, with no canonical URL of its own and previews that point
 * home. Vercel serves it with a 404 status.
 */
export function notFoundHtml(html: string, origin: string): string {
  const noCanonical = html.replace(/\n\s*<link\s+rel="canonical"[^>]*>/, '')
  if (noCanonical === html) throw new Error('route-pages: canonical link not found in index.html')
  return setValue(setValue(noCanonical, attr('name', 'robots'), 'noindex'), attr('property', 'og:url'), `${origin}/`)
}

export function sitemapXml(origin: string, paths: readonly string[], lastmod: string): string {
  const urls = paths.map(
    (path) => `  <url>\n    <loc>${origin}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
  )
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  return `${head}\n${urls.join('\n')}\n</urlset>\n`
}

/** Fonts the first screen is set in, so they download alongside the CSS instead of after it. */
const PRELOAD_FONTS = [/^familjen-grotesk-latin-400-normal-.*\.woff2$/, /^familjen-grotesk-latin-600-normal-.*\.woff2$/, /^ibm-plex-mono-latin-500-normal-.*\.woff2$/]
/** The entrance animations: every page waits on them, so fetch them with the main script. */
const PRELOAD_MODULES = [/^reveals-.*\.js$/]

/** Preload tags for the built assets that the first paint depends on. */
export function preloadTags(assets: readonly string[]): string {
  const find = (patterns: readonly RegExp[]) => patterns.flatMap((p) => assets.filter((a) => p.test(a)).slice(0, 1))
  const fonts = find(PRELOAD_FONTS).map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  const modules = find(PRELOAD_MODULES).map((m) => `<link rel="modulepreload" crossorigin href="/assets/${m}" />`)
  return [...fonts, ...modules].map((tag) => `    ${tag}\n`).join('')
}

/**
 * After the build, writes every route's HTML with its content prerendered
 * (index.html, work/chakravyuh.html, ...), its structured data and its own
 * share image (og/<page>.png), plus 404.html and the sitemap. Vercel's
 * cleanUrls serves /work/chakravyuh from work/chakravyuh.html.
 */
export function routePages(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'
  return {
    name: 'route-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      // Loaded through Vite so the app's own modules (extensionless imports, JSX, ?raw) run unchanged.
      const load = <T>(file: string) => runnerImport<T>(resolve(root, file)).then((r) => r.module)
      const [routes, meta, server, data, cards, site] = await Promise.all([
        load<RoutesModule>('src/router/routes.ts'),
        load<MetaModule>('src/router/meta.ts'),
        load<ServerModule>('src/entry-server.tsx'),
        load<StructuredDataModule>('src/seo/structuredData.ts'),
        load<CardsModule>('src/seo/cards.ts'),
        load<SiteModule>('src/seo/site.ts'),
      ])
      const write = async (file: string, content: string | Buffer) => {
        await mkdir(dirname(join(outDir, file)), { recursive: true })
        await writeFile(join(outDir, file), content)
      }

      const assets = await readdir(join(outDir, 'assets'))
      const built = await readFile(join(outDir, 'index.html'), 'utf8')
      const template = built.replace('</head>', `${preloadTags(assets)}  </head>`)
      const fonts = await loadFonts()
      const host = new URL(site.ORIGIN).host
      const homeCard = cards.cardFor({ kind: 'home' })

      const paths = routes.allPaths()
      await Promise.all(
        paths.map(async (path) => {
          const route = routes.parseRoute(path)
          const pageMeta = meta.metaFor(route)
          const card = cards.cardFor(route) ?? homeCard
          if (card) await write(`${site.shareImagePath(path).slice(1)}`, await renderCard(card, fonts, host))
          const html = pageHtml(template, path, pageMeta, {
            origin: site.ORIGIN,
            body: server.render(path),
            jsonLd: data.jsonLdScript(data.structuredData(route, path, pageMeta)),
            image: `${site.ORIGIN}${site.shareImagePath(path)}`,
            imageAlt: card?.alt ?? '',
          })
          await write(path === '/' ? 'index.html' : `${path.slice(1)}.html`, html)
        }),
      )

      const missing = { kind: 'notFound' } as const
      const missingMeta = meta.metaFor(missing)
      const notFound = pageHtml(template, '/404', missingMeta, {
        origin: site.ORIGIN,
        body: server.render('/404'),
        jsonLd: data.jsonLdScript({ '@context': 'https://schema.org', '@type': 'WebPage', name: missingMeta.title }),
        image: `${site.ORIGIN}${site.shareImagePath('/')}`,
        imageAlt: homeCard?.alt ?? '',
      })
      await write('404.html', notFoundHtml(notFound, site.ORIGIN))
      await write('sitemap.xml', sitemapXml(site.ORIGIN, paths, new Date().toISOString().slice(0, 10)))
    },
  }
}
