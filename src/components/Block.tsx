import type { ReactNode } from 'react'

interface BlockProps {
  readonly id: string
  readonly label: string
  readonly note?: string
  readonly children: ReactNode
}

/** A labelled part of a chapter. On wide screens the label keeps pace in its own column. */
export function Block({ id, label, note, children }: BlockProps) {
  return (
    <section className="block" aria-labelledby={id}>
      <div className="block__aside">
        <h3 id={id} className="block__label">
          {label}
        </h3>
        {note ? <p className="block__note">{note}</p> : null}
      </div>
      <div className="block__body">{children}</div>
    </section>
  )
}
