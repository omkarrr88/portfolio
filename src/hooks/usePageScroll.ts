import { useEffect, type RefObject } from 'react'
import { dimForScroll, type Span } from '../scroll/dim'
import { scrollDepth } from '../scroll/depth'
import { stageFromScroll } from '../scroll/stage'
import { isWideLandscape } from '../scene/formation'

/** What the formation needs to hear about scrolling within the current page. */
export interface ScrollListener {
  /**
   * How far scrolling has carried the camera beyond the page's place in the
   * formation: a whole ring per chapter in the home scroll, a slight drift on
   * other long pages.
   */
  onScrollOffset(offset: number): void
  onVelocity(pxPerMs: number): void
  /** 0..1: how deep the viewport centre is inside a block of dense text. */
  onDim(amount: number): void
  /** Page positions of every block of text the ring label should keep clear of. */
  onTextBlocks(blocks: readonly Span[]): void
}

interface PageScrollOptions {
  /** Unique per page, so measurements restart when the page changes. */
  readonly pageKey: string
  /** Off while a page is leaving, so its last scroll events don't pull the camera back. */
  readonly enabled: boolean
  /** Called with every new offset, for things outside the formation that follow it (the HUD). */
  readonly onOffset?: (offset: number) => void
  /** Cap on the drift down a page that isn't the home scroll (so a page near the centre never starts the finale). */
  readonly maxDepth: number
}

const spanOf = (el: Element): Span => {
  const rect = el.getBoundingClientRect()
  const top = rect.top + window.scrollY
  return { top, bottom: top + rect.height }
}

/**
 * Dense text: `data-dense` always, `data-dense="narrow"` only when the layout
 * stacks (on laptops that text sits beside the formation, not over it).
 */
const denseSpans = (): Span[] => {
  const stacked = !isWideLandscape(window.innerWidth, window.innerHeight)
  return Array.from(document.querySelectorAll<HTMLElement>('[data-dense]'))
    .filter((el) => el.dataset.dense !== 'narrow' || stacked)
    .map(spanOf)
}

/**
 * Feeds scroll position to the formation: through the rings chapter by
 * chapter ([data-chapter], timed by its [data-land] heading) on the home scroll, a little extra depth down
 * other long pages, stepping back behind dense text, and where text sits so
 * the ring label keeps clear. Re-measures (once per frame at most) when the
 * layout or the page changes.
 */
export function usePageScroll(listener: RefObject<ScrollListener | null>, options: PageScrollOptions): void {
  const { pageKey, enabled, onOffset, maxDepth } = options

  useEffect(() => {
    if (!enabled) return
    let dense: Span[] = []
    let chapterTops: number[] = []
    let chapterStages: number[] = []
    let lastY = window.scrollY
    let lastT = performance.now()
    let frame = 0

    const offsetAt = (y: number) =>
      chapterTops.length > 0
        ? stageFromScroll(y, chapterTops, window.innerHeight, chapterStages)
        : Math.min(maxDepth, scrollDepth(y, document.documentElement.scrollHeight, window.innerHeight))

    const update = () => {
      const y = window.scrollY
      const now = performance.now()
      const offset = offsetAt(y)
      const target = listener.current
      if (target) {
        target.onScrollOffset(offset)
        target.onVelocity((y - lastY) / Math.max(1, now - lastT))
        target.onDim(dimForScroll(y, window.innerHeight, dense))
      }
      onOffset?.(offset)
      lastY = y
      lastT = now
    }

    const measure = () => {
      frame = 0
      dense = denseSpans()
      const chapterEls = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
      // Each dive runs as the chapter's heading comes up, not its empty top padding, so a short
      // chapter on a tall screen keeps its ring while it's read.
      chapterTops = chapterEls.map((el) => spanOf(el.querySelector('[data-land]') ?? el).top)
      chapterStages = chapterEls.map((el, i) => Number(el.dataset.stage ?? i))
      const quiet = Array.from(document.querySelectorAll('[data-quiet]'), spanOf)
      listener.current?.onTextBlocks([...dense, ...quiet])
      update()
    }
    const scheduleMeasure = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', scheduleMeasure)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [listener, pageKey, enabled, onOffset, maxDepth])
}
