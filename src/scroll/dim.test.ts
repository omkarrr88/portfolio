import { describe, expect, it } from 'vitest'
import { clearance, dimForScroll } from './dim'

const vh = 800
// One dense block from 1000 to 3000 on the page.
const blocks = [{ top: 1000, bottom: 3000 }] as const
// scrollY that puts the viewport centre at a given page position.
const centredAt = (y: number) => y - vh / 2

describe('dimForScroll', () => {
  it('is 0 with no dense blocks or no viewport', () => {
    expect(dimForScroll(500, vh, [])).toBe(0)
    expect(dimForScroll(500, 0, blocks)).toBe(0)
  })

  it('is 0 while the viewport centre is outside every block', () => {
    expect(dimForScroll(centredAt(900), vh, blocks)).toBe(0)
    expect(dimForScroll(centredAt(3100), vh, blocks)).toBe(0)
  })

  it('ramps up over the first quarter-screen of a block', () => {
    expect(dimForScroll(centredAt(1000 + vh / 8), vh, blocks)).toBeCloseTo(0.5, 10)
    expect(dimForScroll(centredAt(1000 + vh / 4), vh, blocks)).toBe(1)
  })

  it('ramps back down before the block ends', () => {
    expect(dimForScroll(centredAt(3000 - vh / 8), vh, blocks)).toBeCloseTo(0.5, 10)
  })

  it('takes the deepest block when several are near', () => {
    const two = [
      { top: 0, bottom: 1000 },
      { top: 1000, bottom: 4000 },
    ]
    expect(dimForScroll(centredAt(2000), vh, two)).toBe(1)
  })
})

describe('clearance', () => {
  const spans = [{ top: 1000, bottom: 2000 }] as const

  it('is 0 inside a block', () => {
    expect(clearance(1500, spans, 50)).toBe(0)
  })

  it('rises to 1 over the ramp on either side', () => {
    expect(clearance(975, spans, 50)).toBeCloseTo(0.5, 10)
    expect(clearance(2025, spans, 50)).toBeCloseTo(0.5, 10)
    expect(clearance(900, spans, 50)).toBe(1)
  })

  it('is 1 with no blocks, and never divides by zero', () => {
    expect(clearance(1500, [], 50)).toBe(1)
    expect(clearance(1500, spans, 0)).toBe(1)
  })
})
