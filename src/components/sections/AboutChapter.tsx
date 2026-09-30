import { about } from '../../content/copy'
import { education, experience, leadership, person, skills } from '../../content/profile'
import { ChapterHead } from '../ChapterHead'
import { TileLink } from '../Tiles'

const [job] = experience
const [degree, ...school] = education
const toolCount = skills.reduce((n, g) => n + g.items.length, 0)
const FIRST_TOOLS = ['Python', 'TypeScript', 'React', 'Node.js', 'FastAPI', 'PyTorch', 'PostgreSQL', 'LangGraph', 'Docker']

/** Ring 02: the job, the degree, leadership and the toolkit, each a way into its own page. */
export function AboutChapter() {
  return (
    <section id="about" className="chapter chapter--screen" aria-labelledby="about-title" data-chapter data-stage={5}>
      <ChapterHead
        ring={2}
        label="About"
        titleId="about-title"
        title={about.title()}
        lede={about.lede()}
      />
      <ul className="about-grid" data-stagger data-quiet>
        <li className="about-grid__job">
          <TileLink to="/about/riamona" className="about-tile about-tile--job">
            <span className="about-tile__kind">Experience · {job.period}</span>
            <h3 className="about-tile__title">{job.role}</h3>
            <span className="about-tile__line">
              {job.org} · {job.place}
            </span>
            <span className="about-tile__stack">{job.stack.join(' / ')}</span>
          </TileLink>
        </li>
        <li>
          <TileLink to="/about/terna" className="about-tile">
            <span className="about-tile__kind">Education · {about.degreeYears()}</span>
            <h3 className="about-tile__title">{degree.title}</h3>
            <span className="about-tile__line">
              {degree.school} · {degree.place}
            </span>
            <span className="about-tile__foot">Before that: CBSE 12th and 10th, {school[0]?.school}</span>
          </TileLink>
        </li>
        <li>
          <TileLink to="/about/leadership" className="about-tile">
            <span className="about-tile__kind">Leadership · {leadership.length} committees</span>
            <h3 className="about-tile__title">Started as a member, went on to lead</h3>
            <span className="about-tile__line">{leadership.map((l) => l.peak).join(' · ')}</span>
          </TileLink>
        </li>
        <li className="about-grid__wide">
          <TileLink to="/about/toolkit" className="about-tile">
            <span className="about-tile__kind">
              Toolkit · {skills.length} groups, {toolCount} tools
            </span>
            <h3 className="about-tile__title">What I reach for</h3>
            <span className="about-tile__line">{FIRST_TOOLS.join(' · ')} …</span>
          </TileLink>
        </li>
      </ul>
      <p className="chapter__aside" data-reveal>
        Looking for {person.lookingFor.charAt(0).toLowerCase()}
        {person.lookingFor.slice(1, -1)}, and open to freelance and contract work.
      </p>
    </section>
  )
}
