import { useEffect, useRef } from 'react'
import { chapters, profile } from '../content/site'

interface IndexPanelProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly onNavigate: (anchor: string) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Flat list of every chapter, for anyone who wants the content without the journey. */
export function IndexPanel({ open, onClose, onNavigate }: IndexPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={dialogRef} className="index" aria-label="Index" onClose={onClose} onCancel={onClose}>
      <div className="index__head">
        <p className="index__title">Index</p>
        <button type="button" className="hud__button" onClick={onClose}>
          Close
        </button>
      </div>
      <ol className="index__list">
        {chapters.map((chapter) => (
          <li key={chapter.ring}>
            {chapter.anchor ? (
              <button type="button" className="index__item" onClick={() => onNavigate(chapter.anchor!)}>
                <span className="index__ring">{chapter.ring ? pad(chapter.ring) : '··'}</span>
                <span className="index__label">{chapter.label}</span>
              </button>
            ) : (
              <span className="index__item is-pending">
                <span className="index__ring">{chapter.ring ? pad(chapter.ring) : '··'}</span>
                <span className="index__label">{chapter.label}</span>
                <span className="index__note">full build</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="index__foot">
        <a href={profile.resume} target="_blank" rel="noopener">
          Resume (PDF) ↗
        </a>
        <a href={profile.github} target="_blank" rel="noopener">
          GitHub ↗
        </a>
      </div>
    </dialog>
  )
}
