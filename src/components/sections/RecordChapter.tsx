import { achievements, publication } from '../../content/profile'
import { projectById } from '../../content/projects'
import { BrandMarks } from '../BrandMarks'
import { ChapterHead } from '../ChapterHead'
import { TileLink } from '../Tiles'

const projectName = (id: string) => projectById(id)?.short ?? projectById(id)?.title ?? id

/** Ring 04: every result and the paper on one screen, each opening its own page. */
export function RecordChapter() {
  return (
    <section id="record" className="chapter chapter--screen" aria-labelledby="record-title" data-chapter data-stage={3}>
      <ChapterHead
        ring={4}
        label="Record"
        titleId="record-title"
        title="Three hackathon results in 2026, and a paper under review."
        lede="Plus a finalist place in Mumbai University’s research competition. Open any of them for the story and the project behind it."
      />
      <ul className="results" data-stagger data-quiet>
        {achievements.map((a) => (
          <li key={a.id}>
            <TileLink to={`/record/${a.id}`} className="result-tile">
              <span className="result-tile__brands">
                <BrandMarks ids={a.brands} />
              </span>
              <span className="result-tile__result">{a.result}</span>
              <span className="result-tile__field">{a.field ?? a.organiser}</span>
              <h3 className="result-tile__event">{a.event}</h3>
              <span className="result-tile__meta">
                {a.place} · {a.date}
              </span>
              <span className="result-tile__with">with {a.wonWith.map((w) => projectName(w.projectId)).join(' and ')}</span>
            </TileLink>
          </li>
        ))}
      </ul>
      <div data-reveal data-quiet>
        <TileLink to={`/record/${publication.id}`} className="paper-tile">
          <span className="paper-tile__status">
            {publication.status} · {publication.date}
          </span>
          <h3 className="paper-tile__title">{publication.title}</h3>
          <span className="paper-tile__venue">
            {publication.role}. <i>{publication.venue}</i>.
          </span>
        </TileLink>
      </div>
    </section>
  )
}
