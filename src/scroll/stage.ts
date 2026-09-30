/** Fraction of the viewport height where a transition finishes (section top at 35%). */
const TRANSITION_END = 0.35

/**
 * Continuous stage from the scroll position. Section 0 is the intro; each
 * later section carries the camera from the previous section's stage to its
 * own while its top travels from the bottom of the viewport to 35% of its
 * height, and holds there while you read it. Without explicit stages, each
 * section is one stage deeper than the last.
 */
export function stageFromScroll(
  scrollY: number,
  sectionTops: readonly number[],
  viewportHeight: number,
  sectionStages: readonly number[] = sectionTops.map((_, i) => i),
): number {
  if (viewportHeight <= 0 || sectionTops.length === 0) return 0
  const span = viewportHeight * (1 - TRANSITION_END)
  return sectionTops.slice(1).reduce((stage, top, i) => {
    const progress = Math.min(1, Math.max(0, (scrollY + viewportHeight - top) / span))
    const step = (sectionStages[i + 1] ?? i + 1) - (sectionStages[i] ?? i)
    return stage + step * progress
  }, sectionStages[0] ?? 0)
}
