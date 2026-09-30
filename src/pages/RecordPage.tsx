import { achievements, publication } from '../content/profile'
import { projectById, v2v } from '../content/projects'
import { Block } from '../components/Block'
import { BrandMarks } from '../components/BrandMarks'
import { ExternalLink } from '../components/ExternalLink'
import { Marker } from '../components/PageHead'
import { PageFoot, neighbours } from '../components/PageFoot'
import { ProjectCard } from '../components/Tiles'
import { metaFor } from '../router/meta'

const ITEMS = [...achievements.map((a) => ({ id: a.id, label: a.short })), { id: publication.id, label: publication.short }]
const toCrumb = (item: { id: string; label: string }) => ({ label: item.label, href: `/record/${item.id}` })

/** One result, or the paper: what happened, and the project behind it. */
export function RecordPage({ id, ring }: { readonly id: string; readonly ring: number }) {
  const index = ITEMS.findIndex((x) => x.id === id)
  const { prev, next } = neighbours(ITEMS, index)
  const crumbs = metaFor({ kind: 'achievement', id }).crumbs
  const foot = (
    <PageFoot within="Record" back={{ label: 'All results', href: '/#record' }} prev={toCrumb(prev)} next={toCrumb(next)} />
  )

  if (id === publication.id) {
    return (
      <article className="record-page" aria-labelledby="record-page-title">
        <header className="record-head record-head--paper" data-quiet>
          <Marker ring={ring} crumbs={crumbs} />
          <p className="record-head__result record-head__result--small" data-reveal>
            Under review
          </p>
          <h1 id="record-page-title" className="record-head__title record-head__title--long" data-split tabIndex={-1}>
            {publication.title}
          </h1>
          <p className="record-head__meta" data-reveal>
            {publication.role} · <i>{publication.venue}</i> · Submitted {publication.date}
          </p>
        </header>
        <div className="record-body" data-dense>
          <Block id="paper-status" label="Status">
            <p className="record-body__lead" data-reveal>
              Now under peer review. The paper comes out of the V2V project: a severity-gated
              collision-risk index for blind-spot detection, built and tested in SUMO simulation.
            </p>
          </Block>
          <Block id="paper-work" label="The work behind it">
            <div className="cards" data-stagger>
              <ProjectCard project={v2v} note="Research, May 2026" />
            </div>
          </Block>
        </div>
        {foot}
      </article>
    )
  }

  const a = achievements.find((x) => x.id === id)
  if (!a) return null
  return (
    <article className="record-page" aria-labelledby="record-page-title">
      <header className="record-head" data-quiet>
        <Marker ring={ring} crumbs={crumbs} />
        {a.brands.length > 0 ? (
          <p className="record-head__brands" data-reveal>
            <BrandMarks ids={a.brands} />
          </p>
        ) : null}
        <p className="record-head__result" data-reveal>
          {a.result}
          {a.field ? <span className="record-head__field"> {a.field}</span> : null}
        </p>
        <h1 id="record-page-title" className="record-head__title" data-split tabIndex={-1}>
          {a.event}
        </h1>
        <p className="record-head__meta" data-reveal>
          {a.organiser} · {a.place} · {a.date}
        </p>
      </header>
      <div className="record-body" data-dense>
        <Block id="record-what" label="What happened">
          <p className="record-body__lead" data-reveal>
            {a.detail}
          </p>
          {a.href ? (
            <p data-reveal>
              <ExternalLink href={a.href} className="text-link">
                The event’s page
              </ExternalLink>
            </p>
          ) : null}
        </Block>
        <Block id="record-with" label={a.wonWith.length > 1 ? 'The projects' : 'The project'}>
          <div className="cards" data-stagger>
            {a.wonWith.map((w) => {
              const project = projectById(w.projectId)
              return project ? <ProjectCard key={w.projectId} project={project} note={w.note} /> : null
            })}
          </div>
        </Block>
      </div>
      {foot}
    </article>
  )
}
