import { yearSpan } from '../content/copy'
import { achievements, education, experience, person, publication, skills } from '../content/profile'
import { projectById } from '../content/projects'
import type { PageMeta } from '../router/meta'
import type { Route } from '../router/routes'
import { ORIGIN, shareImagePath } from './site'

/**
 * schema.org JSON-LD for each page, from the same data as the page itself:
 * a ProfilePage about the person at home; elsewhere a WebPage with a
 * breadcrumb and the thing it describes (a project, a result, the paper).
 * The person is the same node everywhere (one @id), so search engines tie
 * every page to one entity.
 */

type Node = Record<string, unknown>

const PERSON_ID = `${ORIGIN}/#person`
const WEBSITE_ID = `${ORIGIN}/#website`

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** "April 2026" → "2026-04", "Sept 2026" → "2026-09", "2025" → "2025"; undefined without a year. */
export function isoDate(date: string): string | undefined {
  const year = date.match(/\d{4}/)?.[0]
  if (!year) return undefined
  const month = MONTHS.indexOf(date.trim().slice(0, 3).toLowerCase())
  return month >= 0 ? `${year}-${String(month + 1).padStart(2, '0')}` : year
}

const [job] = experience
const [degree] = education

/** The skills that say the most in few words: languages first, then the main frameworks and ML tools. */
const KNOWS_ABOUT = ['Full-stack development', 'Machine learning', ...skills.flatMap((g) => g.items.slice(0, 4))]

export function personNode(): Node {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: person.name,
    url: `${ORIGIN}/`,
    description: person.intro,
    jobTitle: job.role,
    worksFor: { '@type': 'Organization', name: job.org },
    alumniOf: { '@type': 'CollegeOrUniversity', name: degree.school.split(',')[0], parentOrganization: degree.place },
    address: { '@type': 'PostalAddress', addressLocality: person.place, addressRegion: 'Maharashtra', addressCountry: 'IN' },
    email: `mailto:${person.email}`,
    knowsAbout: KNOWS_ABOUT,
    award: achievements.map((a) => [a.result, a.field, `${a.event} (${yearSpan([a.date])})`].filter(Boolean).join(' ')),
    sameAs: [person.github, person.linkedin],
  }
}

const websiteNode = (): Node => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${ORIGIN}/`,
  name: person.name,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
})

const breadcrumb = (url: string, label: string): Node => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: person.name, item: `${ORIGIN}/` },
    { '@type': 'ListItem', position: 2, name: label, item: url },
  ],
})

/** The thing a detail page is about, when it has a schema.org type of its own. */
function subjectNode(route: Route, url: string): Node | null {
  if (route.kind === 'project') {
    const p = projectById(route.id)
    if (!p) return null
    const repo = p.links.find((l) => l.href.startsWith('https://github.com/'))?.href
    return {
      '@type': repo ? 'SoftwareSourceCode' : 'CreativeWork',
      '@id': `${url}#work`,
      name: p.title,
      description: p.subtitle,
      url,
      author: { '@id': PERSON_ID },
      dateCreated: isoDate(p.date),
      keywords: p.category.split('·').map((k) => k.trim()),
      ...(p.figures[0] ? { image: `${ORIGIN}${p.figures[0].src}` } : {}),
      ...(p.placement ? { award: p.placement } : {}),
      ...(repo ? { codeRepository: repo } : {}),
    }
  }
  if (route.kind === 'achievement' && route.id === publication.id) {
    return {
      '@type': 'ScholarlyArticle',
      '@id': `${url}#article`,
      headline: publication.title,
      name: publication.title,
      author: { '@id': PERSON_ID },
      dateCreated: isoDate(publication.date),
      creativeWorkStatus: publication.status,
      about: projectById(publication.projectId)?.title,
    }
  }
  return null
}

/** Projects a result was won with, so the result page points at their pages. */
function mentionsFor(route: Route): Node[] {
  if (route.kind !== 'achievement') return []
  const a = achievements.find((x) => x.id === route.id)
  return (a?.wonWith ?? []).map((w) => ({ '@id': `${ORIGIN}/work/${w.projectId}#work` }))
}

export function structuredData(route: Route, path: string, meta: PageMeta): Node {
  const url = `${ORIGIN}${path === '/' ? '/' : path}`
  const image = `${ORIGIN}${shareImagePath(path)}`
  if (route.kind === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': `${url}#page`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: { '@id': PERSON_ID },
          primaryImageOfPage: image,
          inLanguage: 'en',
        },
        personNode(),
        websiteNode(),
      ],
    }
  }
  const subject = subjectNode(route, url)
  const mentions = mentionsFor(route)
  const label = meta.crumbs[meta.crumbs.length - 1]?.label ?? meta.label
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: meta.title,
        description: meta.description,
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        about: subject ? { '@id': subject['@id'] } : { '@id': PERSON_ID },
        ...(mentions.length > 0 ? { mentions } : {}),
        primaryImageOfPage: image,
        inLanguage: 'en',
      },
      breadcrumb(url, label),
      ...(subject ? [subject] : []),
      personNode(),
      websiteNode(),
    ],
  }
}

/** JSON for a <script> element: "<" is escaped so no text in the data can close the tag. */
export const jsonLdScript = (data: Node): string => JSON.stringify(data).replace(/</g, '\\u003c')
