import type { CSSProperties } from 'react'
import { work } from '../../content/copy'
import { featured, moreWork } from '../../content/projects'
import { ChapterHead } from '../ChapterHead'
import { LargeProjectTile, SmallProjectTile } from '../Tiles'

/**
 * Columns for the featured builds: up to three across on a laptop (four as two pairs rather than three and one),
 * up to four across on a wide screen.
 */
const featuredColumns = (count: number): CSSProperties =>
  ({ '--cols': count === 4 ? 2 : Math.max(1, Math.min(count, 3)), '--cols-wide': Math.max(1, Math.min(count, 4)) }) as CSSProperties

/** Ring 06: every project, the featured builds large and the rest in the row beneath. */
export function WorkChapter() {
  return (
    <section id="work" className="chapter chapter--screen" aria-labelledby="work-title" data-chapter data-stage={1}>
      <ChapterHead
        ring={6}
        label="Work"
        titleId="work-title"
        title={work.title()}
        lede={work.lede()}
      />
      <ul
        className="tiles tiles--large"
        style={featuredColumns(featured.length)}
        data-stagger
        data-quiet
      >
        {featured.map((p, i) => (
          <li key={p.id}>
            <LargeProjectTile project={p} index={i} />
          </li>
        ))}
      </ul>
      <ul className="tiles tiles--small" data-stagger data-quiet>
        {moreWork.map((p, i) => (
          <li key={p.id}>
            <SmallProjectTile project={p} index={featured.length + i} />
          </li>
        ))}
      </ul>
    </section>
  )
}
