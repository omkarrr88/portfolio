import { useEffect, useRef } from 'react'
import { achievements, person, publication } from '../content/profile'
import { projects } from '../content/projects'
import { pad } from '../lib/format'
import { ABOUT_LABELS } from '../router/meta'
import { Link } from '../router/Router'
import { ABOUT_IDS, SECTIONS, type SectionKey } from '../router/routes'
import { ExternalLink } from './ExternalLink'

interface IndexPanelProps {
  readonly open: boolean
  readonly path: string
  /** The section you're in: its chapter at home, or the section of the page you're on. */
  readonly section: SectionKey | null
  readonly onClose: () => void
}

interface Entry {
  readonly label: string
  readonly href: string
}

/** Every chapter of the home scroll and every page in it: the whole site on one screen. */
const ITEMS: Record<SectionKey, readonly Entry[]> = {
  work: projects.map((p) => ({ label: p.short ?? p.title, href: `/work/${p.id}` })),
  record: [
    ...achievements.map((a) => ({ label: a.short, href: `/record/${a.id}` })),
    { label: publication.short, href: `/record/${publication.id}` },
  ],
  about: ABOUT_IDS.map((id) => ({ label: ABOUT_LABELS[id], href: `/about/${id}` })),
  contact: [],
}

export function IndexPanel({ open, path, section, onClose }: IndexPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const current = (href: string) => (href === path ? 'page' : undefined)

  return (
    <dialog ref={dialogRef} className="index" aria-label="Index" onClose={onClose} onCancel={onClose} data-lenis-prevent>
      <div className="index__head">
        <p className="index__title">Index</p>
        <button type="button" className="hud__button" onClick={onClose}>
          Close
        </button>
      </div>
      <ol className="index__list">
        <li className="index__group">
          <Link
            to="/"
            className="index__item"
            aria-current={path === '/' && section === null ? 'location' : undefined}
            onClick={onClose}
          >
            <span className="index__num">00</span>
            <span className="index__label">Home</span>
          </Link>
        </li>
        {SECTIONS.map((s, i) => (
          <li key={s.key} className="index__group">
            <Link
              to={s.href}
              className="index__item"
              aria-current={s.key === section ? 'location' : undefined}
              onClick={onClose}
            >
              <span className="index__num">{pad(i + 1)}</span>
              <span className="index__label">{s.label}</span>
            </Link>
            {ITEMS[s.key].length > 0 ? (
              <ul className="index__subs">
                {ITEMS[s.key].map((e) => (
                  <li key={e.href}>
                    <Link to={e.href} className="index__sub" aria-current={current(e.href)} onClick={onClose}>
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="index__foot">
        <a href={`mailto:${person.email}`}>{person.email}</a>
        <ExternalLink href={person.resume}>Resume</ExternalLink>
        <ExternalLink href={person.linkedin}>LinkedIn</ExternalLink>
        <ExternalLink href={person.github}>GitHub</ExternalLink>
      </div>
    </dialog>
  )
}
