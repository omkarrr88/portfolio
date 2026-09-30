import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** The page at `path` as HTML, for scripts/route-pages.ts to put in the built file; the browser then hydrates it. */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App serverPath={path} />
    </StrictMode>,
  )
}
