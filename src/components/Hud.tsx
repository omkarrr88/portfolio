import { chapterForRing, profile } from '../content/site'

interface HudProps {
  readonly activeRing: number
  readonly onOpenIndex: () => void
  readonly onHome: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')
const TICKS = [7, 6, 5, 4, 3, 2, 1] as const

/** Fixed frame around the page: name, Index, Resume, and where you are in the formation. */
export function Hud({ activeRing, onOpenIndex, onHome }: HudProps) {
  return (
    <>
      <header className="hud hud--top">
        <button type="button" className="hud__name" onClick={onHome}>
          {profile.name}
          <span className="hud__deva" lang="sa">चक्रव्यूह</span>
        </button>
        <nav className="hud__actions" aria-label="Site">
          <button type="button" className="hud__button" onClick={onOpenIndex} aria-haspopup="dialog">
            Index
          </button>
          <a className="hud__button" href={profile.resume} target="_blank" rel="noopener">
            Resume <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <footer className="hud hud--bottom" aria-hidden="true">
        <p className="hud__ring">
          Ring {pad(activeRing)} / 07 <span className="hud__chapter">{chapterForRing(activeRing).label}</span>
        </p>
        <ol className="hud__ticks">
          {TICKS.map((ring) => (
            <li key={ring} className={ring === activeRing ? 'is-active' : ring > activeRing ? 'is-passed' : undefined} />
          ))}
          <li className="hud__centre" />
        </ol>
      </footer>
    </>
  )
}
