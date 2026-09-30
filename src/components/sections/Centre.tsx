import { ChapterHead } from '../ChapterHead'
import { contactLede } from '../../content/copy'
import { Colophon, ContactBody } from '../ContactBody'

/** The centre of the formation: how to reach me, and the way back out. */
export function Centre({ onTop }: { readonly onTop: () => void }) {
  return (
    <section id="contact" className="centre" aria-labelledby="centre-title" data-chapter data-stage={7}>
      <div className="centre__inner">
        <ChapterHead ring={0} label="Contact" titleId="centre-title" title="You’ve reached the centre." lede={contactLede()} />
        <ContactBody />
      </div>
      <Colophon
        back={
          <button type="button" className="colophon__top" onClick={onTop}>
            Back to the outer ring <span aria-hidden="true">↑</span>
          </button>
        }
      />
    </section>
  )
}
