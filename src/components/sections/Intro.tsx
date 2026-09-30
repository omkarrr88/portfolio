import { eventName, finalProjectName, heroResults, heroResultsLabel } from '../../content/copy'
import { person } from '../../content/profile'
import { Link } from '../../router/Router'
import { BrandMarks } from '../BrandMarks'
import { ExternalLink } from '../ExternalLink'

/** Ring 07: who, what, whether I'm available, and the latest results, each opening its own page. */
export function Intro() {
  return (
    <section id="intro" className="hero" aria-labelledby="hero-title" data-chapter data-stage={0}>
      <div className="hero__body" data-quiet>
        <p className="eyebrow" data-reveal>
          {person.role} · {person.place}
        </p>
        {/* The space keeps the name two words for anything that reads the text rather than the layout. */}
        <h1 id="hero-title" className="hero__title" data-split tabIndex={-1}>
          Omkar{' '}
          <br />
          Kadam
        </h1>
        <p className="hero__intro" data-reveal>
          {person.intro}
        </p>
        <div className="hero__next" data-reveal>
          <p className="hero__status">
            <span className="hero__dot" aria-hidden="true" />
            {person.availability}
          </p>
          <p className="hero__actions">
            <Link to="/#contact" className="hero__action">
              Start a conversation <span aria-hidden="true">→</span>
            </Link>
            <ExternalLink href={person.resume} className="hero__action">
              Resume
            </ExternalLink>
          </p>
        </div>
      </div>
      <div className="hero__side" data-reveal data-quiet>
        <p className="hero__side-label">{heroResultsLabel()}</p>
        <ul className="hero__results">
          {heroResults.map((a) => (
            <li key={a.id}>
              <Link to={`/record/${a.id}`} className="hero__result">
                <span className="hero__rank">{a.result}</span>
                <span className="hero__field">{a.field ?? a.organiser}</span>
                <span className="hero__event">
                  {eventName(a)}
                  {finalProjectName(a) ? ` · ${finalProjectName(a)}` : ''}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <BrandMarks ids={heroResults.flatMap((a) => a.brands)} className="hero__brands" />
      </div>
      <p className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        Work, record, about, contact. Scroll inward.
      </p>
    </section>
  )
}
