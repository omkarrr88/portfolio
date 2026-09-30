import { person } from '../content/profile'
import { ringName } from '../lib/format'
import type { Crumb } from '../router/meta'
import { Link } from '../router/Router'
import { SECTIONS, type SectionKey } from '../router/routes'
import { ExternalLink } from './ExternalLink'

interface HudProps {
  readonly ring: number
  readonly section: SectionKey | null
  readonly crumbs: readonly Crumb[]
  /** Shown instead of the crumbs where there are none (the home page, a missing page). */
  readonly label: string
  readonly onOpenIndex: () => void
}

const TICKS = [7, 6, 5, 4, 3, 2, 1] as const

/** Fixed frame around the page: name, the four chapters, Index, Resume, and where you are. */
export function Hud({ ring, section, crumbs, label, onOpenIndex }: HudProps) {
  const where = crumbs.map((c) => c.label).join(' / ') || label
  return (
    <>
      <header className="hud hud--top">
        <Link to="/" className="hud__name">
          {person.name}
        </Link>
        <nav className="hud__nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <Link
              key={s.key}
              to={s.href}
              className={s.key === section ? 'hud__link is-current' : 'hud__link'}
              aria-current={s.key === section ? 'location' : undefined}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="hud__actions">
          <button type="button" className="hud__button" onClick={onOpenIndex} aria-haspopup="dialog">
            Index
          </button>
          <ExternalLink className="hud__button" href={person.resume}>
            Resume
          </ExternalLink>
        </div>
      </header>
      <footer className="hud hud--bottom" aria-hidden="true">
        {/* Keyed so the text rolls in fresh each time you arrive somewhere new. */}
        <p key={where} className="hud__ring">
          {ring === 0 ? 'Centre' : `${ringName(ring)} / 07`}
          <span className="hud__chapter">{where}</span>
        </p>
        <ol className="hud__ticks">
          {TICKS.map((r) => (
            <li key={r} className={r === ring ? 'is-active' : r > ring ? 'is-passed' : undefined} />
          ))}
          <li className={ring === 0 ? 'hud__centre is-active' : 'hud__centre'} />
        </ol>
      </footer>
    </>
  )
}
