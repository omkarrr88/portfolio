import { leadership } from '../content/profile'
import { ExternalLink } from './ExternalLink'

/** Each committee as a ladder, latest role at the top, with a link to the committee's own page. */
export function Ladders() {
  return (
    <ul className="ladders" data-stagger>
      {leadership.map((l) => (
        <li key={l.org} className="ladder">
          <h3 className="ladder__org">{l.org}</h3>
          <p className="ladder__detail">{l.detail}</p>
          <ol className="ladder__roles" aria-label={`Roles at ${l.org}, most recent first`}>
            {l.roles.map((r, i) => (
              <li key={r.title} className={i === 0 ? 'ladder__role is-latest' : 'ladder__role'}>
                <span className="ladder__title">{r.title}</span>
                <span className="ladder__period">{r.period}</span>
              </li>
            ))}
          </ol>
          {l.href ? (
            <ExternalLink href={l.href} className="ladder__link">
              Instagram
            </ExternalLink>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
