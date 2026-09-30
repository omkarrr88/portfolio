import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Formation } from './components/Formation'
import { Hud } from './components/Hud'
import { IndexPanel } from './components/IndexPanel'
import { Beyond } from './components/sections/Beyond'
import { Centre } from './components/sections/Centre'
import { Intro } from './components/sections/Intro'
import { MoreWork } from './components/sections/MoreWork'
import { Now } from './components/sections/Now'
import { ProjectChapter } from './components/sections/ProjectChapter'
import { chakravyuh, fitmon, vayunetra } from './content/projects'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useScrollStage, type StageListener } from './hooks/useScrollStage'
import { useSmoothScroll } from './hooks/useSmoothScroll'

/** Analytics only report from the deployed site, not from local or LAN previews. */
const isDeployed = (host: string) => !/^(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+)$/.test(host)

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const lenis = useSmoothScroll(!reducedMotion)
  const [indexOpen, setIndexOpen] = useState(false)

  const mainRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const nowRef = useRef<HTMLElement>(null)
  const chakravyuhRef = useRef<HTMLElement>(null)
  const vayunetraRef = useRef<HTMLElement>(null)
  const fitmonRef = useRef<HTMLElement>(null)
  const moreRef = useRef<HTMLElement>(null)
  const beyondRef = useRef<HTMLElement>(null)
  const centreRef = useRef<HTMLElement>(null)
  const formationRef = useRef<StageListener>(null)
  // One section per stage, outer ring to centre.
  const sections = useMemo(
    () => [introRef, nowRef, chakravyuhRef, vayunetraRef, fitmonRef, moreRef, beyondRef, centreRef],
    [],
  )

  const activeRing = useScrollStage(sections, formationRef)

  useEffect(() => {
    const root = mainRef.current
    if (!root || reducedMotion) return
    let cleanup: (() => void) | undefined
    let cancelled = false
    Promise.all([document.fonts.ready, import('./motion/reveals')])
      .then(([, { initReveals }]) => {
        if (!cancelled) cleanup = initReveals(root)
      })
      .catch((error: unknown) => console.error('Reveals failed to start; content stays visible.', error))
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reducedMotion])

  const scrollTo = useCallback(
    (target: string | number) => {
      const el = typeof target === 'string' ? document.getElementById(target) : null
      const top = typeof target === 'number' ? target : 0
      if (lenis) {
        lenis.scrollTo(el ?? top, { duration: 1.6 })
      } else if (el) {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      } else {
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' })
      }
    },
    [lenis, reducedMotion],
  )

  const navigate = useCallback(
    (anchor: string) => {
      setIndexOpen(false)
      scrollTo(anchor)
    },
    [scrollTo],
  )

  const toTop = useCallback(() => scrollTo(0), [scrollTo])

  return (
    <>
      <Formation ref={formationRef} reducedMotion={reducedMotion} />
      <Hud activeRing={activeRing} onOpenIndex={() => setIndexOpen(true)} onHome={toTop} />
      <IndexPanel open={indexOpen} activeRing={activeRing} onClose={() => setIndexOpen(false)} onNavigate={navigate} />
      <main ref={mainRef}>
        <Intro ref={introRef} />
        <Now ref={nowRef} />
        <ProjectChapter ref={chakravyuhRef} ring={5} project={chakravyuh} tilt="right" />
        <ProjectChapter ref={vayunetraRef} ring={4} project={vayunetra} tilt="left" />
        <ProjectChapter ref={fitmonRef} ring={3} project={fitmon} tilt="right" />
        <MoreWork ref={moreRef} />
        <Beyond ref={beyondRef} />
        <Centre ref={centreRef} onTop={toTop} />
      </main>
      {isDeployed(window.location.hostname) ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  )
}
