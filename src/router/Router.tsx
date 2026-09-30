import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { normalisePath, parseRoute, sectionAnchor, type Route } from './routes'

/** 'push' for a click, 'pop' for Back/Forward (which restores the old scroll position). */
export type NavigationKind = 'initial' | 'push' | 'pop'

interface Location {
  readonly path: string
  /** Element id to bring into view once the page is shown ("now" for /#now), or ''. */
  readonly hash: string
  readonly kind: NavigationKind
  /** Where to scroll once the page is shown, when there's no hash. */
  readonly scrollY: number
}

interface RouterValue extends Location {
  readonly route: Route
  navigate(to: string): void
}

const RouterContext = createContext<RouterValue | null>(null)

const HOME = '/'
/** Scroll position is written to history this long after scrolling stops. */
const SAVE_SCROLL_MS = 150

const savedScroll = (state: unknown): number =>
  typeof state === 'object' && state !== null && 'scrollY' in state && typeof state.scrollY === 'number'
    ? state.scrollY
    : 0

const hashOf = (raw: string) => decodeURIComponent(raw.replace(/^#/, ''))

/** Where a URL really goes: "/work" is the Work chapter of the home scroll, "/#work". */
function resolve(pathname: string, rawHash: string): { path: string; hash: string } {
  const anchor = sectionAnchor(pathname)
  return anchor ? { path: HOME, hash: anchor } : { path: normalisePath(pathname), hash: hashOf(rawHash) }
}

/** The address as it should read. */
const addressOf = (path: string, hash: string) => `${path}${hash ? `#${hash}` : ''}`

/**
 * First load: an old-style section address is rewritten to its chapter before anything renders.
 * At build time there's no window; the page being prerendered says where it is.
 */
function initialLocation(serverPath?: string): Location {
  if (typeof window === 'undefined') return { path: normalisePath(serverPath ?? HOME), hash: '', kind: 'initial', scrollY: 0 }
  const { path, hash } = resolve(window.location.pathname, window.location.hash)
  if (normalisePath(window.location.pathname) !== path) {
    window.history.replaceState(window.history.state, '', addressOf(path, hash))
  }
  return { path, hash, kind: 'initial', scrollY: 0 }
}

interface RouterProviderProps {
  /** Scrolls within the current page: to an element id, or to the top when null. */
  readonly onSamePage: (hash: string | null) => void
  /** The page being prerendered at build time; the browser's own address is used otherwise. */
  readonly serverPath?: string
  readonly children: ReactNode
}

/** History-API routing: real URLs, working Back/Forward, /#chapter links into the home scroll, no library. */
export function RouterProvider({ onSamePage, serverPath, children }: RouterProviderProps) {
  const [location, setLocation] = useState<Location>(() => initialLocation(serverPath))
  // Where the reader was in the home scroll, so the way back home lands there rather than at the top.
  const homeScroll = useRef(0)
  const samePage = useRef(onSamePage)

  useEffect(() => {
    samePage.current = onSamePage
  }, [onSamePage])

  useEffect(() => {
    // The page transition decides where to scroll; the browser shouldn't jump first.
    window.history.scrollRestoration = 'manual'
    const onPop = (event: PopStateEvent) => {
      const next = normalisePath(window.location.pathname)
      // A hash typed into the address bar: same page, nothing to transition.
      if (next === location.path) return
      if (location.path === HOME) homeScroll.current = window.scrollY
      setLocation({ path: next, hash: '', kind: 'pop', scrollY: savedScroll(event.state) })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [location.path])

  useEffect(() => {
    // Keep this entry's scroll position current, so Back and Forward both land where the reader left off.
    let timer = 0
    const onScroll = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(
        () => window.history.replaceState({ ...window.history.state, scrollY: window.scrollY }, ''),
        SAVE_SCROLL_MS,
      )
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [location.path])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin)
    const { path: next, hash } = resolve(url.pathname, url.hash)
    const current = normalisePath(window.location.pathname)
    if (next === current) {
      // Same page: just scroll, and let the address show where to (/#work), without a new history entry.
      window.history.replaceState(window.history.state, '', addressOf(next, hash))
      samePage.current(hash || null)
      return
    }
    const scrollY = window.scrollY
    if (current === HOME) homeScroll.current = scrollY
    // Remember where we were, so Back returns to the same spot.
    window.history.replaceState({ ...window.history.state, scrollY }, '')
    const arriveAt = next === HOME && !hash ? homeScroll.current : 0
    window.history.pushState({ scrollY: arriveAt }, '', addressOf(next, hash))
    setLocation({ path: next, hash, kind: 'push', scrollY: arriveAt })
  }, [])

  const value = useMemo<RouterValue>(
    () => ({ ...location, route: parseRoute(location.path), navigate }),
    [location, navigate],
  )
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used inside <RouterProvider>')
  return value
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  readonly to: string
}

/**
 * A real anchor, so middle-click, Cmd-click and "copy link" work; a plain
 * click stays in the app and plays the transition instead of reloading.
 */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
