import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { runnerImport, type Plugin } from 'vite'
import type { PageMeta } from '../src/router/meta.ts'

type MetaModule = typeof import('../src/router/meta.ts')
type RoutesModule = typeof import('../src/router/routes.ts')

const ORIGIN = 'https://omkar-kadam.vercel.app'

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Replace the captured value of a tag in the template; a missing tag fails the build rather than shipping stale meta. */
function setValue(html: string, pattern: RegExp, value: string): string {
  if (!pattern.test(html)) throw new Error(`route-pages: ${pattern} not found in index.html`)
  return html.replace(pattern, (_match, before: string, after: string) => `${before}${escapeHtml(value)}${after}`)
}

const attr = (key: string, name: string) => new RegExp(`(<meta\\s+${key}="${name}"\\s+content=")[^"]*(")`)

/** The built index.html, retitled and redescribed for one route, so shared links and crawlers see the right page. */
export function pageHtml(template: string, path: string, meta: PageMeta): string {
  const url = `${ORIGIN}${path}`
  let html = template
  html = setValue(html, /(<title>)[^<]*(<\/title>)/, meta.title)
  html = setValue(html, attr('name', 'description'), meta.description)
  html = setValue(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, url)
  html = setValue(html, attr('property', 'og:url'), url)
  html = setValue(html, attr('property', 'og:title'), meta.title)
  html = setValue(html, attr('property', 'og:description'), meta.description)
  html = setValue(html, attr('name', 'twitter:title'), meta.title)
  html = setValue(html, attr('name', 'twitter:description'), meta.description)
  return html
}

/** Same shell for addresses that don't exist, kept out of search results. Vercel serves it with a 404 status. */
export function notFoundHtml(template: string, title: string): string {
  const html = setValue(template, /(<title>)[^<]*(<\/title>)/, title)
  return setValue(html, attr('name', 'robots'), 'noindex')
}

export function sitemapXml(paths: readonly string[], lastmod: string): string {
  const urls = paths.map(
    (path) => `  <url>\n    <loc>${ORIGIN}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
  )
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  return `${head}\n${urls.join('\n')}\n</urlset>\n`
}

/**
 * After the build, writes one HTML file per route (work.html, work/chakravyuh.html, ...),
 * a 404.html, and the sitemap. Vercel's cleanUrls serves /work from work.html.
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
      // Loaded through Vite so the app's own modules (extensionless imports and all) run unchanged.
      const [{ module: routes }, { module: meta }] = await Promise.all([
        runnerImport<RoutesModule>(resolve(root, 'src/router/routes.ts')),
        runnerImport<MetaModule>(resolve(root, 'src/router/meta.ts')),
      ])
      const template = await readFile(join(outDir, 'index.html'), 'utf8')
      const paths = routes.allPaths()
      const write = async (file: string, content: string) => {
        await mkdir(dirname(join(outDir, file)), { recursive: true })
        await writeFile(join(outDir, file), content)
      }
      const pages = paths
        .filter((path) => path !== '/')
        .map((path) => write(`${path.slice(1)}.html`, pageHtml(template, path, meta.metaFor(routes.parseRoute(path)))))
      await Promise.all(pages)
      await write('404.html', notFoundHtml(template, meta.metaFor({ kind: 'notFound' }).title))
      await write('sitemap.xml', sitemapXml(paths, new Date().toISOString().slice(0, 10)))
    },
  }
}
