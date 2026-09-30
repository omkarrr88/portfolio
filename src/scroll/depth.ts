/** How much deeper the formation goes by the bottom of a long page. Under half a stage, so the ring never changes. */
export const MAX_SCROLL_DEPTH = 0.45

/** 0 at the top of the page, MAX_SCROLL_DEPTH at the bottom; 0 when the page fits on one screen. */
export function scrollDepth(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  const room = scrollHeight - viewportHeight
  if (room <= 1) return 0
  return MAX_SCROLL_DEPTH * Math.min(1, Math.max(0, scrollY / room))
}
