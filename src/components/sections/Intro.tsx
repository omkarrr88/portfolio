import type { Ref } from 'react'
import { achievements, person } from '../../content/profile'

interface IntroProps {
  readonly ref?: Ref<HTMLElement>
}

const HACKATHONS = achievements.filter((a) => a.field)

/** Ring 07: who, what, and the three results, each a way into its chapter. */
export function Intro({ ref }: IntroProps) {
  return (
    <section ref={ref} id="intro" className="hero" aria-labelledby="hero-title">
      <div className="hero__body" data-quiet>
        <p className="eyebrow" data-reveal>
          {person.role} · {person.place}
        </p>
        <h1 id="hero-title" className="hero__title" data-split>
          Omkar
          <br />
          Kadam
        </h1>
        <p className="hero__intro" data-reveal>
          {person.intro}
        </p>
      </div>
      <div className="hero__side" data-reveal data-quiet>
        <p className="hero__side-label">2026, in three results</p>
        <ul className="hero__results">
          {HACKATHONS.map((a) => (
            <li key={a.event}>
              <a href={`#${a.projectId}`} className="hero__result">
                <span className="hero__rank">{a.result}</span>
                <span className="hero__field">{a.field}</span>
                <span className="hero__event">
                  {a.event.replace(', Pune City Battle', '')} · {a.projectLabel}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        Seven rings, one chapter each. Scroll inward.
      </p>
    </section>
  )
}
