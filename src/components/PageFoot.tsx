import type { Crumb } from '../router/meta'
import { Link } from '../router/Router'

interface PageFootProps {
  readonly back: Crumb
  readonly prev?: Crumb
  readonly next?: Crumb
  /** Names the list the reader is stepping through, for screen readers. */
  readonly within: string
}

/** Way back to the overview, and on to the neighbouring items. */
export function PageFoot({ back, prev, next, within }: PageFootProps) {
  return (
    <nav className="page-foot" aria-label={`More in ${within}`}>
      <Link to={back.href} className="page-foot__back">
        <span aria-hidden="true">←</span> {back.label}
      </Link>
      <div className="page-foot__steps">
        {prev ? (
          <Link to={prev.href} className="page-foot__step" rel="prev">
            <span className="page-foot__dir">Previous</span>
            <span className="page-foot__name">{prev.label}</span>
          </Link>
        ) : null}
        {next ? (
          <Link to={next.href} className="page-foot__step page-foot__step--next" rel="next">
            <span className="page-foot__dir">Next</span>
            <span className="page-foot__name">{next.label}</span>
          </Link>
        ) : null}
      </div>
    </nav>
  )
}

/** Previous and next in a list, wrapping round at the ends. */
export function neighbours<T>(items: readonly T[], index: number): { prev: T; next: T } {
  const n = items.length
  return { prev: items[(index - 1 + n) % n], next: items[(index + 1) % n] }
}
