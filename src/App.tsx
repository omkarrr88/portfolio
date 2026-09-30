import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Formation } from './components/Formation'
import { Hud } from './components/Hud'
import { IndexPanel } from './components/IndexPanel'
import { Hero, NowChapter, ProjectSheet, PrototypeEnd } from './components/Sections'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useScrollStage, type StageListener } from './hooks/useScrollStage'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const lenis = useSmoothScroll(!reducedMotion)
  const [indexOpen, setIndexOpen] = useState(false)

  const mainRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const nowRef = useRef<HTMLElement>(null)
  const sheetRef = useRef<HTMLElement>(null)
  const formationRef = useRef<StageListener>(null)
  const sections = useMemo(() => [heroRef, nowRef, sheetRef], [])

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

  return (
    <>
      <Formation ref={formationRef} reducedMotion={reducedMotion} />
      <Hud activeRing={activeRing} onOpenIndex={() => setIndexOpen(true)} onHome={() => scrollTo(0)} />
      <IndexPanel open={indexOpen} onClose={() => setIndexOpen(false)} onNavigate={navigate} />
      <main ref={mainRef}>
        <Hero ref={heroRef} />
        <NowChapter ref={nowRef} />
        <ProjectSheet ref={sheetRef} />
        <PrototypeEnd />
      </main>
    </>
  )
}
