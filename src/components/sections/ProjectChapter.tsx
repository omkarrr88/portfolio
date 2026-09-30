import type { Ref } from 'react'
import { pad } from '../../content/chapters'
import type { Project } from '../../content/types'
import { Facts, KeyNumbers, LinkRow, SheetFigure } from '../ProjectParts'

interface ProjectChapterProps {
  readonly ref?: Ref<HTMLElement>
  readonly ring: number
  readonly project: Project
  /** Which way the sheet swings as it lands; alternating keeps three sheets from feeling stamped out. */
  readonly tilt: 'left' | 'right'
}

/**
 * Rings 05–03: the problem, set large over the formation, then the project
 * sheet landing on top like a page put down on a table.
 */
export function ProjectChapter({ ref, ring, project: p, tilt }: ProjectChapterProps) {
  const titleId = `${p.id}-title`
  return (
    <section ref={ref} id={p.id} className="project" aria-labelledby={titleId}>
      <div className="project__open" data-quiet>
        <p className="marker" data-reveal>
          <span className="marker__ring">{pad(ring)}</span>
          <span className="marker__rule" aria-hidden="true" />
          <span className="marker__label">{p.title}</span>
        </p>
        {p.hook ? (
          <p className="project__hook" data-split>
            {p.hook}
          </p>
        ) : null}
      </div>

      <article className={`sheet sheet--${p.figureLayout ?? 'chart'}`} data-sheet={tilt} data-dense>
        <header className="sheet__meta">
          <span>No. {pad(ring)}</span>
          <span>{p.category}</span>
          <span>{p.date}</span>
          {p.place ? <span>{p.place}</span> : null}
        </header>
        <div className="sheet__heading">
          <h2 id={titleId} className="sheet__title">
            {p.title}
          </h2>
          {p.devanagari ? (
            <span className="sheet__deva" lang="sa">
              {p.devanagari}
            </span>
          ) : null}
        </div>
        <p className="sheet__subtitle">{p.subtitle}</p>
        {p.placement ? <p className="sheet__placement">{p.placement}</p> : null}

        <SheetFigure layout={p.figureLayout ?? 'chart'} figures={p.figures} caption={p.caption} />
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
      </article>
    </section>
  )
}
