import type { Ref } from 'react'
import { ChapterHead } from '../ChapterHead'
import { moreWork } from '../../content/projects'
import { Facts, KeyNumbers, LinkRow, SheetFigure } from '../ProjectParts'

interface MoreWorkProps {
  readonly ref?: Ref<HTMLElement>
}

/** Ring 02: three smaller builds on one ledger sheet, each entry ruled off from the next. */
export function MoreWork({ ref }: MoreWorkProps) {
  return (
    <section ref={ref} id="more-work" className="chapter chapter--ledger" aria-labelledby="more-title">
      <ChapterHead
        ring={2}
        label="More work"
        titleId="more-title"
        title="Three more builds, from a debugger for broken training runs to a paper under review."
      />

      <div className="ledger" data-sheet="left" data-dense>
        <p className="ledger__head">
          <span>No. 02</span>
          <span>{moreWork.length} entries</span>
        </p>
        {moreWork.map((p, i) => (
          <article key={p.id} id={p.id} className="entry" aria-labelledby={`${p.id}-title`}>
            <header className="entry__meta">
              <span className="entry__index">2.{i + 1}</span>
              <span>{p.category}</span>
              <span>{p.date}</span>
              {p.placement ? <span className="entry__placement">{p.placement}</span> : null}
            </header>
            <div className="entry__main">
              <h3 id={`${p.id}-title`} className="entry__title">
                {p.title}
              </h3>
              <p className="entry__subtitle">{p.subtitle}</p>
              {p.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="entry__text">
                  {paragraph}
                </p>
              ))}
              <Facts facts={p.facts} />
              <LinkRow links={p.links} />
            </div>
            <div className="entry__aside">
              <KeyNumbers numbers={p.numbers} compact />
              <SheetFigure layout="chart" figures={p.figures} caption={p.caption} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
