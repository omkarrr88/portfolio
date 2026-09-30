import { describe, expect, it } from 'vitest'
import { MAX_SCROLL_DEPTH, scrollDepth } from './depth'

describe('scrollDepth', () => {
  it('is 0 at the top and the maximum at the bottom', () => {
    expect(scrollDepth(0, 3000, 800)).toBe(0)
    expect(scrollDepth(2200, 3000, 800)).toBe(MAX_SCROLL_DEPTH)
    expect(scrollDepth(1100, 3000, 800)).toBeCloseTo(MAX_SCROLL_DEPTH / 2, 10)
  })

  it('is 0 when the page fits on one screen, and clamps overscroll', () => {
    expect(scrollDepth(0, 800, 800)).toBe(0)
    expect(scrollDepth(-50, 3000, 800)).toBe(0)
    expect(scrollDepth(5000, 3000, 800)).toBe(MAX_SCROLL_DEPTH)
  })

  it('stays under half a stage so the active ring never flips while scrolling', () => {
    expect(MAX_SCROLL_DEPTH).toBeLessThan(0.5)
  })
})
