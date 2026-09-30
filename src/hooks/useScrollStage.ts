import { useEffect, useRef, useState, type RefObject } from 'react'
import { stageFromScroll } from '../scroll/stage'
import { activeRingForStage } from '../scene/formation'

export interface StageListener {
  onStage(stage: number): void
  onVelocity(pxPerMs: number): void
}

const documentTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY

/**
 * Turns the scroll position into the formation's stage. Section tops are
 * re-measured whenever the page's size changes (fonts, images, rotation).
 * Returns the ring the reader is currently on.
 */
export function useScrollStage(
  sectionRefs: readonly RefObject<HTMLElement | null>[],
  listener: RefObject<StageListener | null>,
): number {
  const [activeRing, setActiveRing] = useState(7)
  const tops = useRef<number[]>([])

  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()

    const measure = () => {
      tops.current = sectionRefs.map((ref) => (ref.current ? documentTop(ref.current) : Number.POSITIVE_INFINITY))
      update()
    }

    const update = () => {
      const y = window.scrollY
      const stage = stageFromScroll(y, tops.current, window.innerHeight)
      const now = performance.now()
      const dt = Math.max(1, now - lastT)
      listener.current?.onStage(stage)
      listener.current?.onVelocity((y - lastY) / dt)
      lastY = y
      lastT = now
      setActiveRing(activeRingForStage(stage))
    }

    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
    }
  }, [sectionRefs, listener])

  return activeRing
}
