import { describe, expect, it } from 'vitest'
import { stageFromScroll } from './stage'

// Three sections: hero at 0, "now" at 900, project sheet at 2200. Viewport 900 tall.
const tops = [0, 900, 2200] as const
const vh = 900
// A transition runs while the next section's top travels from the viewport
// bottom (100%) to 35% of the viewport height.
const span = vh * (1 - 0.35)

describe('stageFromScroll', () => {
  it('is 0 at the top of the page', () => {
    expect(stageFromScroll(0, tops, vh)).toBe(0)
  })

  it('is halfway through the first transition halfway through its window', () => {
    expect(stageFromScroll(span / 2, tops, vh)).toBeCloseTo(0.5, 10)
  })

  it('completes the first transition once the section top reaches 35% of the viewport', () => {
    expect(stageFromScroll(900 - 0.35 * vh, tops, vh)).toBeCloseTo(1, 10)
  })

  it('holds between transitions', () => {
    expect(stageFromScroll(1000, tops, vh)).toBeCloseTo(1, 10)
    expect(stageFromScroll(1300, tops, vh)).toBeCloseTo(1, 10)
  })

  it('reaches the last stage and never exceeds it', () => {
    expect(stageFromScroll(2200, tops, vh)).toBeCloseTo(2, 10)
    expect(stageFromScroll(50_000, tops, vh)).toBeCloseTo(2, 10)
  })

  it('never goes below zero on overscroll', () => {
    expect(stageFromScroll(-400, tops, vh)).toBe(0)
  })

  it('is monotonic in scroll position', () => {
    let previous = -Infinity
    for (let y = 0; y <= 3000; y += 25) {
      const s = stageFromScroll(y, tops, vh)
      expect(s).toBeGreaterThanOrEqual(previous)
      previous = s
    }
  })

  it('returns 0 for a degenerate viewport instead of dividing by zero', () => {
    expect(stageFromScroll(500, tops, 0)).toBe(0)
  })
})

describe('stageFromScroll with explicit stages', () => {
  // Intro at 0, a chapter at stage 1, the next two stages further in.
  const stages = [0, 1, 3] as const

  it('moves by each chapter’s own step', () => {
    expect(stageFromScroll(900 - 0.35 * vh, tops, vh, stages)).toBeCloseTo(1, 10)
    expect(stageFromScroll(2200, tops, vh, stages)).toBeCloseTo(3, 10)
  })

  it('is halfway between two chapters halfway through the window', () => {
    const start = 2200 - vh
    expect(stageFromScroll(start + span / 2, tops, vh, stages)).toBeCloseTo(2, 10)
  })

  it('is 0 with no sections', () => {
    expect(stageFromScroll(100, [], vh)).toBe(0)
  })
})
