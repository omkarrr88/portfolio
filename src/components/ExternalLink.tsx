import type { ReactNode } from 'react'

interface ExternalLinkProps {
  readonly href: string
  readonly className?: string
  readonly children: ReactNode
}

/** Opens in a new tab; the arrow says so visually and the hidden text says so to screen readers. */
export function ExternalLink({ href, className, children }: ExternalLinkProps) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
