import type { Route } from '../router/routes'
import { AboutPage } from './AboutPage'
import { NotFound } from './NotFound'
import { ProjectPage } from './ProjectPage'
import { RecordPage } from './RecordPage'
import { ScrollHome } from './ScrollHome'

interface PageForProps {
  readonly route: Route
  /** Where the page sits in the formation, for its marker. */
  readonly ring: number
  /** Back to the top of the home scroll. */
  readonly onTop: () => void
}

/** The page for a route. */
export function PageFor({ route, ring, onTop }: PageForProps) {
  switch (route.kind) {
    case 'home':
      return <ScrollHome onTop={onTop} />
    case 'project':
      return <ProjectPage id={route.id} ring={ring} />
    case 'achievement':
      return <RecordPage id={route.id} ring={ring} />
    case 'aboutItem':
      return <AboutPage id={route.id} ring={ring} />
    case 'notFound':
      return <NotFound ring={ring} />
  }
}
