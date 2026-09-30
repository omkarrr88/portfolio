import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import type Lenis from 'lenis'
import { Formation } from './components/Formation'
import { Hud } from './components/Hud'
import { IndexPanel } from './components/IndexPanel'
import { chapterForStage, chapters } from './content/chapters'
import { usePageScroll, type ScrollListener } from './hooks/usePageScroll'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { PageFor } from './pages/PageFor'
import { metaFor, placementFor } from './router/meta'
import { RouterProvider, useRouter, type NavigationKind } from './router/Router'
import { SECTIONS, sectionOf, type Route, type SectionKey } from './router/routes'
import { LeavingContext } from './router/transition'
import { activeRingForStage } from './scene/formation'
import { MAX_SCROLL_DEPTH } from './scroll/depth'

/** How long the old page takes to fade before the new one is put in its place. */
const LEAVE_MS = 420
/** Fonts usually arrive well before this; never hold the first reveal longer. */
const FONT_WAIT_MS = 900
/** Where the camera starts pulling back to show the whole formation from above. */
const FINALE_STAGE = 6
/** Where a chapter's heading lands when you jump to it: clear of the HUD. */
const LAND_OFFSET_PX = -84
/** A smooth in-page scroll (Index chapter, back to the top), in seconds. */
const IN_PAGE_SCROLL_S = 1.6

/** Analytics only report from the deployed site, not from local or LAN previews. */
const isDeployed = (host: string) => !/^(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+)$/.test(host)

interface View {
  readonly path: string
  readonly hash: string
  readonly route: Route
  readonly kind: NavigationKind
  readonly scrollY: number
}

/**
 * Scrolls to an element id or a position, through Lenis when it's running. A
 * chapter lands with its heading ([data-land]) just under the HUD, so the
 * whole section is on screen.
 */
function scrollPage(lenis: Lenis | null, target: string | number, smooth: boolean): void {
  const el = typeof target === 'string' ? document.getElementById(target) : null
  const land = el?.querySelector<HTMLElement>('[data-land]') ?? el
  const offset = land && land !== el ? LAND_OFFSET_PX : 0
  const top = land ? land.getBoundingClientRect().top + window.scrollY + offset : typeof target === 'number' ? target : 0
  if (lenis) {
    // Lenis clamps to the page height it last measured; a page that just swapped in may be much taller.
    lenis.resize()
    lenis.scrollTo(top, smooth ? { duration: IN_PAGE_SCROLL_S } : { immediate: true, force: true })
    return
  }
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const lenis = useSmoothScroll(!reducedMotion)
  const onSamePage = useCallback(
    (hash: string | null) => scrollPage(lenis, hash ?? 0, !reducedMotion),
    [lenis, reducedMotion],
  )
  return (
    <RouterProvider onSamePage={onSamePage}>
      <Site lenis={lenis} reducedMotion={reducedMotion} />
    </RouterProvider>
  )
}

function Site({ lenis, reducedMotion }: { readonly lenis: Lenis | null; readonly reducedMotion: boolean }) {
  const { path, hash, route, kind, scrollY } = useRouter()
  const [view, setView] = useState<View>({ path, hash, route, kind, scrollY })
  const [leavingTo, setLeavingTo] = useState<string | null>(null)
  const [indexOpen, setIndexOpen] = useState(false)
  // At home the ring and the chapter follow the scroll.
  const [homeRing, setHomeRing] = useState(7)
  const [homeChapter, setHomeChapter] = useState(chapters[0].anchor)
  const pageRef = useRef<HTMLElement>(null)
  const formationRef = useRef<ScrollListener>(null)

  // The camera sets off the moment the URL changes; the page content follows once the old page has faded.
  const placement = useMemo(() => placementFor(route), [route])
  const meta = useMemo(() => metaFor(route), [route])
  const atHome = route.kind === 'home'
  const ring = atHome ? homeRing : activeRingForStage(placement.stage)
  const chapter = chapters.find((c) => c.anchor === homeChapter) ?? chapters[0]
  const section: SectionKey | null = atHome
    ? (SECTIONS.find((s) => s.key === homeChapter)?.key ?? null)
    : sectionOf(route)
  // The ring label names a chapter only on the ring where that chapter settles; rings in between stay unnamed.
  const labelFor = useCallback(
    (r: number) => (atHome ? (chapters.find((c) => activeRingForStage(c.stage) === r)?.label ?? '') : meta.label),
    [atHome, meta.label],
  )

  useEffect(() => {
    if (path === view.path) return
    setIndexOpen(false)
    const next: View = { path, hash, route, kind, scrollY }
    if (reducedMotion) {
      setView(next)
      return
    }
    setLeavingTo(path)
    const timer = window.setTimeout(() => {
      setView(next)
      setLeavingTo(null)
    }, LEAVE_MS)
    return () => window.clearTimeout(timer)
  }, [path, hash, route, kind, scrollY, view.path, reducedMotion])

  // Read at swap time only: Lenis starting up must not re-run the swap and throw the reader back to the top.
  const lenisRef = useRef(lenis)
  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  // Once the new page is in the DOM: put the scroll where it belongs, name the tab, move focus for keyboard users.
  useLayoutEffect(() => {
    scrollPage(lenisRef.current, view.hash || view.scrollY, false)
    document.title = metaFor(view.route).title
    if (view.kind !== 'initial') pageRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [view])

  const onOffset = useCallback(
    (offset: number) => {
      if (view.route.kind !== 'home') return
      setHomeRing(activeRingForStage(offset))
      setHomeChapter(chapterForStage(offset).anchor)
    },
    [view.route.kind],
  )
  // Pages drift a little deeper as you scroll them, but never into the pull-back at the centre.
  const maxDepth = Math.max(0, Math.min(MAX_SCROLL_DEPTH, FINALE_STAGE - placementFor(view.route).stage))
  usePageScroll(formationRef, { pageKey: view.path, enabled: leavingTo === null, onOffset, maxDepth })

  useEffect(() => {
    const root = pageRef.current
    if (!root || reducedMotion) return
    let cleanup: (() => void) | undefined
    let cancelled = false
    const fonts = Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS))])
    Promise.all([fonts, import('./motion/reveals')])
      .then(([, { initReveals }]) => {
        // After a navigation, hold the entrance until the camera is most of the way there.
        if (!cancelled) cleanup = initReveals(root, { delay: view.kind === 'initial' ? 0 : 0.35 })
      })
      .catch((error: unknown) => console.error('Reveals failed to start; content stays visible.', error))
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [view.path, view.kind, reducedMotion])

  const toTop = useCallback(() => scrollPage(lenis, 0, !reducedMotion), [lenis, reducedMotion])

  const classes = ['page', `page--${view.route.kind}`, leavingTo ? 'is-leaving' : '', view.kind !== 'initial' ? 'is-arriving' : '']

  return (
    <LeavingContext.Provider value={leavingTo}>
      <Formation ref={formationRef} reducedMotion={reducedMotion} placement={placement} labelFor={labelFor} />
      <Hud
        ring={ring}
        section={section}
        crumbs={meta.crumbs}
        label={atHome ? chapter.label : meta.label}
        onOpenIndex={() => setIndexOpen(true)}
      />
      <IndexPanel open={indexOpen} path={path} section={section} onClose={() => setIndexOpen(false)} />
      <main ref={pageRef} key={view.path} className={classes.filter(Boolean).join(' ')} data-page>
        <PageFor route={view.route} ring={activeRingForStage(placementFor(view.route).stage)} onTop={toTop} />
      </main>
      {isDeployed(window.location.hostname) ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </LeavingContext.Provider>
  )
}
