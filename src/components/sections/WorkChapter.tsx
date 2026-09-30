import { featured, moreWork } from '../../content/projects'
import { ChapterHead } from '../ChapterHead'
import { LargeProjectTile, SmallProjectTile } from '../Tiles'

/** Ring 06: every project on one screen, the three hackathon builds large and the other three beneath. */
export function WorkChapter() {
  return (
    <section id="work" className="chapter chapter--screen" aria-labelledby="work-title" data-chapter data-stage={1}>
      <ChapterHead
        ring={6}
        label="Work"
        titleId="work-title"
        title="Six builds, three hackathon results."
        lede="Chakravyuh, VayuNetra and Fitmon placed against 31,000, 15,000 and 7,000 teams. Open any project for the full write-up."
      />
      <ul className="tiles tiles--large" data-stagger data-quiet>
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
