import type { Fact, Figure, FigureLayout, KeyNumber, Link } from '../content/types'
import { ExternalLink } from './ExternalLink'

/** Static figures from the repo, no counters: the numbers are the point, not the animation. */
export function KeyNumbers({ numbers, compact = false }: { readonly numbers: readonly KeyNumber[]; readonly compact?: boolean }) {
  return (
    <dl className={compact ? 'numbers numbers--compact' : 'numbers'} data-stagger>
      {numbers.map((n) => (
        <div key={n.label} className="numbers__item">
          <dt className="numbers__value">{n.value}</dt>
          <dd className="numbers__label">{n.label}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Facts({ facts }: { readonly facts: readonly Fact[] }) {
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div key={f.term} className={f.term === 'My part' ? 'facts__row facts__row--mine' : 'facts__row'}>
          <dt>{f.term}</dt>
          <dd>{f.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

export function LinkRow({ links }: { readonly links: readonly Link[] }) {
  return (
    <p className="link-row">
      {links.map((l) => (
        <ExternalLink key={l.href} href={l.href} className="paper-button">
          {l.label}
        </ExternalLink>
      ))}
    </p>
  )
}

interface SheetFigureProps {
  readonly layout: FigureLayout
  readonly figures: readonly Figure[]
  readonly caption?: string
}

/** Charts sit on a white mat, screens in a thin frame, phone screens side by side. */
export function SheetFigure({ layout, figures, caption }: SheetFigureProps) {
  if (figures.length === 0) return null
  return (
    <figure className={`figure figure--${layout}`} data-figure>
      <div className="figure__frame">
        {figures.map((f) => (
          <div key={f.src} className="figure__item">
            <img src={f.src} alt={f.alt} width={f.width} height={f.height} loading="lazy" decoding="async" />
            {f.label ? <span className="figure__label">{f.label}</span> : null}
          </div>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
