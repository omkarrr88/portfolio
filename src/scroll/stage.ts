/** Fraction of the viewport height where a transition finishes (section top at 35%). */
const TRANSITION_END = 0.35

/**
 * Continuous stage from the scroll position. Section 0 is the hero; each later
 * section adds one stage while its top travels from the bottom of the viewport
 * to 35% of its height, and holds while you read it.
 */
export function stageFromScroll(scrollY: number, sectionTops: readonly number[], viewportHeight: number): number {
  if (viewportHeight <= 0) return 0
  const span = viewportHeight * (1 - TRANSITION_END)
  return sectionTops.slice(1).reduce((stage, top) => {
    const progress = (scrollY + viewportHeight - top) / span
    return stage + Math.min(1, Math.max(0, progress))
  }, 0)
}
