import { useEffect, useRef } from 'react'
import { chapters, pad } from '../content/chapters'
import { person } from '../content/profile'
import { ExternalLink } from './ExternalLink'

interface IndexPanelProps {
  readonly open: boolean
  readonly activeRing: number
  readonly onClose: () => void
  readonly onNavigate: (anchor: string) => void
}

/** Flat list of every chapter, for anyone who wants the content without the journey. */
export function IndexPanel({ open, activeRing, onClose, onNavigate }: IndexPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={dialogRef} className="index" aria-label="Index" onClose={onClose} onCancel={onClose} data-lenis-prevent>
      <div className="index__head">
        <p className="index__title">Index</p>
        <button type="button" className="hud__button" onClick={onClose}>
          Close
        </button>
      </div>
      <ol className="index__list">
        {chapters.map((chapter) => {
          const current = chapter.ring === activeRing
          return (
            <li key={chapter.ring}>
              <button
                type="button"
                className={current ? 'index__item is-current' : 'index__item'}
                aria-current={current ? 'location' : undefined}
                onClick={() => onNavigate(chapter.anchor)}
              >
                <span className="index__ring">{chapter.ring ? pad(chapter.ring) : '··'}</span>
                <span className="index__label">{chapter.label}</span>
                {current ? <span className="index__note">You are here</span> : null}
              </button>
            </li>
          )
        })}
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
