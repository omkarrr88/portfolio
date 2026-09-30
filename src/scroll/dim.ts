export interface Span {
  readonly top: number
  readonly bottom: number
}

/**
 * How far the viewport centre sits inside any dense block (0..1). The value
 * ramps over the first and last quarter-screen of each block (a third of the
 * block, if it is short), so the formation eases back while you read and
 * returns between blocks.
 */
export function dimForScroll(scrollY: number, viewportHeight: number, blocks: readonly Span[]): number {
  if (viewportHeight <= 0) return 0
  const centre = scrollY + viewportHeight / 2
  return blocks.reduce((dim, { top, bottom }) => {
    const ramp = Math.max(1, Math.min(viewportHeight / 4, (bottom - top) / 3))
    const inside = Math.min(centre - top, bottom - centre) / ramp
    return Math.max(dim, Math.min(1, Math.max(0, inside)))
  }, 0)
}

/**
 * How clear a horizontal line at page position `y` is of every block: 0 inside
 * one, rising to 1 once it is `ramp` px away. Used to keep the ring label off text.
 */
export function clearance(y: number, blocks: readonly Span[], ramp: number): number {
  if (ramp <= 0) return 1
  return blocks.reduce((room, { top, bottom }) => {
    const outside = Math.max(top - y, y - bottom)
    return Math.min(room, Math.min(1, Math.max(0, outside / ramp)))
  }, 1)
}
