import type { Ref } from 'react'
import { Block } from '../Block'
import { ChapterHead } from '../ChapterHead'
import { pad } from '../../content/chapters'
import { education, experience, skills } from '../../content/profile'

interface NowProps {
  readonly ref?: Ref<HTMLElement>
}

/** Ring 06: the job, the degree, and the toolkit, set as a spec sheet. */
export function Now({ ref }: NowProps) {
  return (
    <section ref={ref} id="now" className="chapter" aria-labelledby="now-title">
      <ChapterHead
        ring={6}
        label="Now"
        titleId="now-title"
        title="I’m a Full Stack Engineer at Riamona Luxury & Fashion Brands."
        lede="Since January 2026 I’ve built full-stack products end to end: the code, the tests, the CI/CD, and running them in production."
      />

      <div className="chapter__blocks" data-dense>
        <Block id="experience-label" label="Experience">
          {experience.map((job) => (
            <article key={job.org} className="job">
              <header className="job__head" data-reveal>
                <h4 className="job__role">{job.role}</h4>
                <p className="job__period">{job.period}</p>
                <p className="job__org">
                  {job.org} <span className="job__place">· {job.place}</span>
                </p>
              </header>
              <ol className="job__points" data-stagger>
                {job.points.map((point, i) => (
                  <li key={point}>
                    <span className="job__index" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>
              <p className="inline-list" data-reveal>
                <span className="inline-list__label">Day to day</span>
                {job.stack.map((item) => (
                  <span key={item} className="inline-list__item">
                    {item}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </Block>

        <Block id="education-label" label="Education">
          <ul className="rows" data-stagger>
            {education.map((e) => (
              <li key={e.title} className="row row--education">
                <span className="row__period">{e.period}</span>
                <span className="row__title">{e.title}</span>
                <span className="row__detail">
                  {e.school}
                  {e.place !== 'Navi Mumbai' ? ` · ${e.place}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="toolkit-label" label="Toolkit" note="What I reach for, grouped the way my resume lists it.">
          <dl className="spec" data-stagger>
            {skills.map((group) => (
              <div key={group.group} className="spec__row">
                <dt className="spec__group">{group.group}</dt>
                <dd className="spec__items">
                  {group.items.map((item) => (
                    <span key={item} className="spec__item">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Block>
      </div>
    </section>
  )
}
