import type { ReactNode } from 'react'
import type { Project } from '../content/types'
import { pad } from '../lib/format'
import { Link } from '../router/Router'
import { useLeavingTo } from '../router/transition'

/** "7th of 31,000+ teams · Meta PyTorch Hackathon" → ["7th of 31,000+ teams", "Meta PyTorch Hackathon"]. */
const splitPlacement = (placement?: string): [string, string] => {
  const [first = '', ...rest] = (placement ?? '').split(' · ')
  return [first, rest.join(' · ')]
}

interface TileLinkProps {
  readonly to: string
  readonly className: string
  readonly children: ReactNode
}

/** A card that is one big link; stays lit while the site dives into it. */
export function TileLink({ to, className, children }: TileLinkProps) {
  const leavingTo = useLeavingTo()
  return (
    <Link to={to} className={leavingTo === to ? `${className} is-chosen` : className}>
      {children}
      <span className="tile-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  )
}

/** A small preview of the project's real figure. */
function TileFigure({ project }: { readonly project: Project }) {
  const layout = project.figureLayout ?? 'chart'
  const shown = layout === 'phones' ? project.figures : project.figures.slice(0, 1)
  return (
    <div className={`tile__figure tile__figure--${layout}`} aria-hidden="true">
      {shown.map((f) => (
        <img key={f.src} src={f.src} alt="" width={f.width} height={f.height} loading="lazy" decoding="async" />
      ))}
    </div>
  )
}

/** A featured build: figure, name, result. */
export function LargeProjectTile({ project, index }: { readonly project: Project; readonly index: number }) {
  const [result, event] = splitPlacement(project.placement)
  return (
    <TileLink to={`/work/${project.id}`} className="tile tile--large">
      <TileFigure project={project} />
      <div className="tile__body">
        <span className="tile__meta">
          No. {pad(index + 1)} · {project.category}
        </span>
        <h3 className="tile__title">{project.title}</h3>
        <span className="tile__subtitle">{project.subtitle}</span>
        <span className="tile__result">
          <span className="tile__rank">{result}</span>
          <span className="tile__event">{event}</span>
        </span>
      </div>
    </TileLink>
  )
}

/** The rest of the work: name, one line, one number. */
export function SmallProjectTile({ project, index }: { readonly project: Project; readonly index: number }) {
  const lead = project.numbers[0]
  return (
    <TileLink to={`/work/${project.id}`} className="tile tile--small">
      <span className="tile__meta">
        No. {pad(index + 1)} · {project.category}
      </span>
      <h3 className="tile__title">{project.title}</h3>
      <span className="tile__subtitle">{project.subtitle}</span>
      {lead ? (
        <span className="tile__number">
          <b>{lead.value}</b> {lead.label}
        </span>
      ) : null}
    </TileLink>
  )
}

/** A project referenced from elsewhere (a result, the degree): name, note, two numbers. */
export function ProjectCard({ project, note }: { readonly project: Project; readonly note: string }) {
  return (
    <TileLink to={`/work/${project.id}`} className="card">
      <span className="card__note">{note}</span>
      <h3 className="card__title">{project.title}</h3>
      <span className="card__subtitle">{project.subtitle}</span>
      <span className="card__numbers">
        {project.numbers.slice(0, 2).map((n) => (
          <span key={n.label} className="card__number">
            <b>{n.value}</b> {n.label}
          </span>
        ))}
      </span>
    </TileLink>
  )
}
