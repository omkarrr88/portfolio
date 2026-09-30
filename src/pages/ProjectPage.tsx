import { BrandMarks } from '../components/BrandMarks'
import { brandsForProject } from '../content/profile'
import { projects } from '../content/projects'
import { pad } from '../lib/format'
import { Marker } from '../components/PageHead'
import { PageFoot, neighbours } from '../components/PageFoot'
import { Facts, KeyNumbers, LinkRow, SheetFigure } from '../components/ProjectParts'
import { metaFor } from '../router/meta'

const crumb = (id: string) => {
  const p = projects.find((x) => x.id === id)
  return { label: p?.short ?? p?.title ?? '', href: `/work/${id}` }
}

/**
 * One project in full: the problem, set large over the formation, then the
 * project sheet landing on top like a page put down on a table.
 */
export function ProjectPage({ id, ring }: { readonly id: string; readonly ring: number }) {
  const index = projects.findIndex((x) => x.id === id)
  const p = projects[index]
  if (!p) return null
  const { prev, next } = neighbours(projects, index)
  const layout = p.figureLayout ?? 'chart'
  // Alternate the landing swing so consecutive sheets don't feel stamped out.
  const tilt = index % 2 === 0 ? 'right' : 'left'

  return (
    <article className="project project--page" aria-labelledby="project-title">
      <header className="project__open" data-quiet>
        <Marker ring={ring} crumbs={metaFor({ kind: 'project', id }).crumbs} />
        {p.hook ? (
          <p className="project__hook" data-split>
            {p.hook}
          </p>
        ) : null}
      </header>

      <div className={`sheet sheet--${layout}`} data-sheet={tilt} data-dense>
        <p className="sheet__meta">
          <span>
            No. {pad(index + 1)} / {pad(projects.length)}
          </span>
          <span>{p.category}</span>
          <span>{p.date}</span>
          {p.place ? <span>{p.place}</span> : null}
        </p>
        <h1 id="project-title" className="sheet__title" tabIndex={-1}>
          {p.title}
        </h1>
        <p className="sheet__subtitle">{p.subtitle}</p>
        {p.placement ? (
          <p className="sheet__placement">
            <BrandMarks ids={brandsForProject(p.id)} className="sheet__brands" />
            {p.placement}
          </p>
        ) : null}

        <SheetFigure layout={layout} figures={p.figures} caption={p.caption} />
        <KeyNumbers numbers={p.numbers} />

        <div className="sheet__columns">
          <div className="sheet__body">
            {p.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <LinkRow links={p.links} />
          </div>
          <Facts facts={p.facts} />
        </div>
      </div>

      <PageFoot within="Work" back={{ label: 'All work', href: '/#work' }} prev={crumb(prev.id)} next={crumb(next.id)} />
    </article>
  )
}
