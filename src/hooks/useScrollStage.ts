import { useEffect, useRef, useState, type RefObject } from 'react'
import { stageFromScroll } from '../scroll/stage'
import { dimForScroll, type Span } from '../scroll/dim'
import { activeRingForStage, isWideLandscape } from '../scene/formation'

export interface StageListener {
  onStage(stage: number): void
  onVelocity(pxPerMs: number): void
  /** 0..1: how deep the viewport centre is inside a block of dense text. */
  onDim(amount: number): void
  /** Page positions of every block of text the ring label should keep clear of. */
  onTextBlocks(blocks: readonly Span[]): void
}

const documentTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY

const spanOf = (el: Element): Span => {
  const top = documentTop(el)
  return { top, bottom: top + el.getBoundingClientRect().height }
}

/**
 * Dense text: `data-dense` always, `data-dense="narrow"` only when the layout
 * stacks (on laptops that text sits beside the formation, not over it).
 */
const denseBlocks = (): Span[] => {
  const stacked = !isWideLandscape(window.innerWidth, window.innerHeight)
  return Array.from(document.querySelectorAll<HTMLElement>('[data-dense]'))
    .filter((el) => el.dataset.dense !== 'narrow' || stacked)
    .map(spanOf)
}

/**
 * Turns the scroll position into the formation's stage, tells it when the
 * reader is inside dense text ([data-dense]) so it can step back, and where
 * text sits ([data-dense], [data-quiet]) so the ring label can keep clear.
 * Positions are re-measured whenever the page's size changes (fonts,
 * images, rotation). Returns the ring the reader is currently on.
 */
export function useScrollStage(
  sectionRefs: readonly RefObject<HTMLElement | null>[],
  listener: RefObject<StageListener | null>,
): number {
  const [activeRing, setActiveRing] = useState(7)
  const tops = useRef<number[]>([])
  const dense = useRef<Span[]>([])

  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()

    const measure = () => {
      tops.current = sectionRefs.map((ref) => (ref.current ? documentTop(ref.current) : Number.POSITIVE_INFINITY))
      dense.current = denseBlocks()
      const quiet = Array.from(document.querySelectorAll('[data-quiet]'), spanOf)
      listener.current?.onTextBlocks([...dense.current, ...quiet])
      update()
    }

    const update = () => {
      const y = window.scrollY
      const stage = stageFromScroll(y, tops.current, window.innerHeight)
      const now = performance.now()
      const dt = Math.max(1, now - lastT)
      listener.current?.onStage(stage)
      listener.current?.onVelocity((y - lastY) / dt)
      listener.current?.onDim(dimForScroll(y, window.innerHeight, dense.current))
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
