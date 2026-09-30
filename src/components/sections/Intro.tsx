import { achievements, person } from '../../content/profile'
import { projectById } from '../../content/projects'
import { Link } from '../../router/Router'
import { BrandMarks } from '../BrandMarks'

const HACKATHONS = achievements.filter((a) => a.field)

/** The project a result was finally won with (the last round). */
const finalProject = (a: (typeof achievements)[number]) => {
  const last = a.wonWith[a.wonWith.length - 1]
  const p = last ? projectById(last.projectId) : undefined
  return p?.short ?? p?.title
}

/** Ring 07: who, what, and the three results, each opening its own page. */
export function Intro() {
  return (
    <section id="intro" className="hero" aria-labelledby="hero-title" data-chapter data-stage={0}>
      <div className="hero__body" data-quiet>
        <p className="eyebrow" data-reveal>
          {person.role} · {person.place}
        </p>
        <h1 id="hero-title" className="hero__title" data-split tabIndex={-1}>
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
            <li key={a.id}>
              <Link to={`/record/${a.id}`} className="hero__result">
                <span className="hero__rank">{a.result}</span>
                <span className="hero__field">{a.field}</span>
                <span className="hero__event">
                  {a.event.replace(', Pune City Battle', '')} · {finalProject(a)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <BrandMarks ids={HACKATHONS.flatMap((a) => a.brands)} className="hero__brands" />
      </div>
      <p className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        Work, record, about, contact. Scroll inward.
      </p>
    </section>
  )
}
