import { AboutChapter } from '../components/sections/AboutChapter'
import { Centre } from '../components/sections/Centre'
import { Intro } from '../components/sections/Intro'
import { RecordChapter } from '../components/sections/RecordChapter'
import { WorkChapter } from '../components/sections/WorkChapter'

/**
 * The home page: one long scroll through the formation, from the outer ring
 * to the centre. Each chapter ([data-chapter], settling at its data-stage)
 * shows a whole section on one screen; every item in it opens its own page.
 */
export function ScrollHome({ onTop }: { readonly onTop: () => void }) {
  return (
    <>
      <Intro />
      <WorkChapter />
      <RecordChapter />
      <AboutChapter />
      <Centre onTop={onTop} />
    </>
  )
}
