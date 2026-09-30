import type { ReactNode } from 'react'
import { Link } from '../router/Router'
import type { Crumb } from '../router/meta'
import { pad } from '../lib/format'

interface PageHeadProps {
  /** Ring the page sits on; 0 is the centre. */
  readonly ring: number
  readonly crumbs: readonly Crumb[]
  readonly title: ReactNode
  /** Lets the page's section point at its heading with aria-labelledby. */
  readonly titleId?: string
  readonly lede?: ReactNode
  readonly className?: string
}

/** The opening of every page: where you are in the formation, the headline, one line of context. */
export function PageHead({ ring, crumbs, title, titleId, lede, className }: PageHeadProps) {
  return (
    <header className={className ? `page-head ${className}` : 'page-head'} data-quiet>
      <Marker ring={ring} crumbs={crumbs} />
      <h1 id={titleId} className="page-head__title" data-split tabIndex={-1}>
        {title}
      </h1>
      {lede ? (
        <p className="page-head__lede" data-reveal>
          {lede}
        </p>
      ) : null}
    </header>
  )
}

/** "05 ——— Work / Chakravyuh": ring number, then a breadcrumb whose earlier steps link back. */
export function Marker({ ring, crumbs }: { readonly ring: number; readonly crumbs: readonly Crumb[] }) {
  return (
    <nav className="marker" aria-label="Breadcrumb" data-reveal>
      <span className="marker__ring" aria-hidden="true">
        {ring === 0 ? '··' : pad(ring)}
      </span>
      <span className="marker__rule" aria-hidden="true" />
      <ol className="marker__crumbs">
        {crumbs.map((c, i) =>
          i < crumbs.length - 1 ? (
            <li key={c.href}>
              <Link to={c.href} className="marker__link">
                {c.label}
              </Link>
            </li>
          ) : (
            <li key={c.href} aria-current="page">
              {c.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}
