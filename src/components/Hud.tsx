import { chapterForRing, ringName } from '../content/chapters'
import { person } from '../content/profile'

interface HudProps {
  readonly activeRing: number
  readonly onOpenIndex: () => void
  readonly onHome: () => void
}

const TICKS = [7, 6, 5, 4, 3, 2, 1] as const

/** Fixed frame around the page: name, Index, Resume, and where you are in the formation. */
export function Hud({ activeRing, onOpenIndex, onHome }: HudProps) {
  const atCentre = activeRing === 0
  return (
    <>
      <header className="hud hud--top">
        <button type="button" className="hud__name" onClick={onHome}>
          {person.name}
          <span className="hud__deva" lang="sa">
            चक्रव्यूह
          </span>
        </button>
        <nav className="hud__actions" aria-label="Site">
          <button type="button" className="hud__button" onClick={onOpenIndex} aria-haspopup="dialog">
            Index
          </button>
          <a className="hud__button" href={person.resume} target="_blank" rel="noopener noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <footer className="hud hud--bottom" aria-hidden="true">
        <p className="hud__ring">
          {atCentre ? 'Centre' : `${ringName(activeRing)} / 07`}
          <span className="hud__chapter">{atCentre ? 'Contact' : chapterForRing(activeRing).label}</span>
        </p>
        <ol className="hud__ticks">
          {TICKS.map((ring) => (
            <li key={ring} className={ring === activeRing ? 'is-active' : ring > activeRing ? 'is-passed' : undefined} />
          ))}
          <li className={atCentre ? 'hud__centre is-active' : 'hud__centre'} />
        </ol>
      </footer>
    </>
  )
}
