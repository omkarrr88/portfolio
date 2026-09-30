import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/familjen-grotesk/400.css'
import '@fontsource/familjen-grotesk/500.css'
import '@fontsource/familjen-grotesk/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/frame.css'
import './styles/pages.css'
import './styles/tiles.css'
import './styles/blocks.css'
import './styles/chapters.css'
import './styles/sheets.css'
import './styles/centre.css'
import App from './App.tsx'
import { parseRoute } from './router/routes'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element in index.html')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Built pages arrive with their content already in the HTML (scripts/route-pages.ts) and are hydrated. A host that
// answers an address with some other page's HTML (a preview server's fallback) gets a fresh render instead.
const routeKey = (path: string) => JSON.stringify(parseRoute(path))
const prerendered = root.dataset.path
if (prerendered !== undefined && root.firstElementChild && routeKey(prerendered) === routeKey(window.location.pathname)) {
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
