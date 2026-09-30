import type { ReactNode } from 'react'
import { pad } from '../content/chapters'

interface ChapterHeadProps {
  readonly ring: number
  readonly label: string
  readonly titleId: string
  readonly title: ReactNode
  readonly lede?: ReactNode
}

/** The opening of a chapter: ring marker, headline, one-line lede. Sits over the formation. */
export function ChapterHead({ ring, label, titleId, title, lede }: ChapterHeadProps) {
  return (
    <header className="chapter-head" data-quiet>
      <p className="marker" data-reveal>
        <span className="marker__ring">{ring === 0 ? '··' : pad(ring)}</span>
        <span className="marker__rule" aria-hidden="true" />
        <span className="marker__label">{label}</span>
      </p>
      <h2 id={titleId} className="chapter-head__title" data-split>
        {title}
      </h2>
      {lede ? (
        <p className="chapter-head__lede" data-reveal>
          {lede}
        </p>
      ) : null}
    </header>
  )
}
