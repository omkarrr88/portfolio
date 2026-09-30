import type { ReactNode } from 'react'
import type { Role } from '../content/types'
import { achievements, education, experience, leadership, person, publication, skills } from '../content/profile'
import { pad } from '../lib/format'
import { Ladders } from '../components/Ladders'
import { Block } from '../components/Block'
import { ExternalLink } from '../components/ExternalLink'
import { PageHead } from '../components/PageHead'
import { PageFoot, neighbours } from '../components/PageFoot'
import { ABOUT_LABELS, metaFor } from '../router/meta'
import { ABOUT_IDS, type AboutId } from '../router/routes'
import { Link } from '../router/Router'

const [job] = experience
const [degree, ...school] = education
const meta = achievements.find((a) => a.id === 'meta-pytorch')
const avishkar = achievements.find((a) => a.id === 'avishkar')

/** A committee's whole run, from the first role's start to the latest role's end ("Nov 2023 – Present"). */
const span = (roles: readonly Role[]): string => {
  const start = roles[roles.length - 1]?.period.split(' – ')[0] ?? ''
  const end = roles[0]?.period.split(' – ')[1] ?? ''
  return end ? `${start} – ${end}` : start
}

interface Shell {
  readonly title: ReactNode
  readonly lede?: ReactNode
  readonly body: ReactNode
}

/** One part of About in full: the job, the degree, leadership, or the toolkit. */
export function AboutPage({ id, ring }: { readonly id: AboutId; readonly ring: number }) {
  const { prev, next } = neighbours(ABOUT_IDS, ABOUT_IDS.indexOf(id))
  const toCrumb = (x: AboutId) => ({ label: ABOUT_LABELS[x], href: `/about/${x}` })
  const shell = SHELLS[id]
  return (
    <article className="about-page" aria-labelledby="about-page-title">
      <PageHead
        ring={ring}
        crumbs={metaFor({ kind: 'aboutItem', id }).crumbs}
        titleId="about-page-title"
        title={shell.title}
        lede={shell.lede}
      />
      <div className="chapter__blocks" data-dense>
        {shell.body}
      </div>
      <PageFoot within="About" back={{ label: 'All of About', href: '/#about' }} prev={toCrumb(prev)} next={toCrumb(next)} />
    </article>
  )
}

const JobBody = (
  <>
    <Block id="job-role" label="The role">
      <div className="job__head" data-reveal>
        <p className="job__role">{job.role}</p>
        <p className="job__period">{job.period}</p>
        <p className="job__org">
          {job.org} <span className="job__place">· {job.place}</span>
        </p>
      </div>
      <ol className="job__points" data-stagger>
        {job.points.map((point, i) => (
          <li key={point}>
            <span className="job__index" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ol>
    </Block>
    <Block id="job-stack" label="Day to day">
      <p className="inline-list" data-reveal>
        {job.stack.map((item) => (
          <span key={item} className="inline-list__item">
            {item}
          </span>
        ))}
      </p>
      <p className="about-page__more" data-reveal>
        The full list is in the <Link to="/about/toolkit" className="text-link">toolkit</Link>, and the dates are on the{' '}
        <ExternalLink href={person.resume} className="text-link">
          resume
        </ExternalLink>
        .
      </p>
    </Block>
  </>
)

const TernaBody = (
  <>
    <Block id="terna-alongside" label="Alongside the degree">
      <ul className="rows" data-stagger>
        {leadership.map((l) => (
          <li key={l.org} className="row">
            <span className="row__period">{span(l.roles)}</span>
            <span className="row__title">{l.peak}</span>
            <span className="row__detail">
              <Link to="/about/leadership" className="text-link">
                {l.org}
              </Link>
            </span>
          </li>
        ))}
        {avishkar ? (
          <li className="row">
            <span className="row__period">{avishkar.date}</span>
            <span className="row__title">Finalist, Avishkar</span>
            <span className="row__detail">
              <Link to={`/record/${avishkar.id}`} className="text-link">
                {avishkar.organiser}’s research competition
              </Link>
            </span>
          </li>
        ) : null}
        {meta ? (
          <li className="row">
            <span className="row__period">{meta.date}</span>
            <span className="row__title">7th of 31,000+ teams</span>
            <span className="row__detail">
              <Link to={`/record/${meta.id}`} className="text-link">
                {meta.event}
              </Link>
            </span>
          </li>
        ) : null}
        <li className="row">
          <span className="row__period">{publication.date}</span>
          <span className="row__title">Co-authored a paper</span>
          <span className="row__detail">
            <Link to={`/record/${publication.id}`} className="text-link">
              Under review at {publication.venue}
            </Link>
          </span>
        </li>
      </ul>
    </Block>
    <Block id="terna-before" label="Before Terna">
      <ul className="rows" data-stagger>
        {school.map((e) => (
          <li key={e.title} className="row">
            <span className="row__period">{e.period}</span>
            <span className="row__title">{e.title}</span>
            <span className="row__detail">{e.school}</span>
          </li>
        ))}
      </ul>
    </Block>
  </>
)

const LeadershipBody = (
  <Block id="leadership-ladders" label="Committees">
    <Ladders />
  </Block>
)

const ToolkitBody = (
  <Block id="toolkit-groups" label="By area">
    <dl className="spec" data-stagger>
      {skills.map((group) => (
        <div key={group.group} className="spec__row">
          <dt className="spec__group">{group.group}</dt>
          <dd className="spec__items">
            {group.items.map((item) => (
              <span key={item} className="spec__item">
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  </Block>
)

const SHELLS: Record<AboutId, Shell> = {
  riamona: {
    title: `${job.role} at Riamona`,
    lede: `${job.org}, ${job.place}. ${job.period}.`,
    body: JobBody,
  },
  terna: {
    title: degree.title,
    lede: `${degree.school}, ${degree.place}. ${degree.period}.`,
    body: TernaBody,
  },
  leadership: {
    title: 'Three committees at Terna, from member to lead.',
    lede: 'Computer Society of India, the Training & Placement Cell, and the Revive cultural fest.',
    body: LeadershipBody,
  },
  toolkit: {
    title: 'What I reach for.',
    lede: 'Grouped the way my resume lists it.',
    body: ToolkitBody,
  },
}
