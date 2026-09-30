import type { Ref } from 'react'
import { Block } from '../Block'
import { ChapterHead } from '../ChapterHead'
import { ExternalLink } from '../ExternalLink'
import { achievements, leadership, publication } from '../../content/profile'

interface BeyondProps {
  readonly ref?: Ref<HTMLElement>
}

/** Ring 01: results, the paper, and the college committees, oldest role at the bottom of each ladder. */
export function Beyond({ ref }: BeyondProps) {
  return (
    <section ref={ref} id="beyond" className="chapter" aria-labelledby="beyond-title">
      <ChapterHead
        ring={1}
        label="Beyond code"
        titleId="beyond-title"
        title="Results, a paper, and the teams I helped run at college."
        lede="Three hackathon results in 2026, a research paper under review, and three committees at Terna, where I started as a member and went on to lead."
      />

      <div className="chapter__blocks" data-dense>
        <Block id="record-label" label="Record">
          <ol className="record" data-stagger>
            {achievements.map((a) => (
              <li key={a.event} className="record__row">
                <p className="record__result">{a.result}</p>
                <div className="record__body">
                  <p className="record__event">
                    {a.href ? (
                      <ExternalLink href={a.href} className="text-link">
                        {a.event}
                      </ExternalLink>
                    ) : (
                      a.event
                    )}
                    {a.field ? <span className="record__field"> · {a.field}</span> : null}
                  </p>
                  <p className="record__meta">
                    {a.organiser} · {a.place} · {a.date}
                  </p>
                  <p className="record__detail">{a.detail}</p>
                </div>
                {a.projectId ? (
                  <a className="record__jump" href={`#${a.projectId}`}>
                    {a.projectLabel} <span aria-hidden="true">→</span>
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        </Block>

        <Block id="publication-label" label="Publication">
          <article className="citation" data-reveal>
            <p className="citation__status">
              {publication.status} · {publication.date}
            </p>
            <h4 className="citation__title">{publication.title}</h4>
            <p className="citation__venue">
              {publication.role}. <i>{publication.venue}</i>.
            </p>
            <a className="record__jump" href={`#${publication.projectId}`}>
              The V2V work behind it <span aria-hidden="true">→</span>
            </a>
          </article>
        </Block>

        <Block id="leadership-label" label="Leadership">
          <ul className="ladders" data-stagger>
            {leadership.map((l) => (
              <li key={l.org} className="ladder">
                <h4 className="ladder__org">{l.org}</h4>
                <p className="ladder__detail">{l.detail}</p>
                <ol className="ladder__roles" aria-label={`Roles at ${l.org}, most recent first`}>
                  {l.roles.map((r, i) => (
                    <li key={r.title} className={i === 0 ? 'ladder__role is-latest' : 'ladder__role'}>
                      <span className="ladder__title">{r.title}</span>
                      <span className="ladder__period">{r.period}</span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </section>
  )
}
