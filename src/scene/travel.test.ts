import { describe, expect, it } from 'vitest'
import { easeInOutCubic, sampleTravel, travelDuration, type Travel } from './travel'

describe('easeInOutCubic', () => {
  it('starts at 0, ends at 1, passes the middle at half way, and clamps', () => {
    expect(easeInOutCubic(0)).toBe(0)
    expect(easeInOutCubic(1)).toBe(1)
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10)
    expect(easeInOutCubic(-1)).toBe(0)
    expect(easeInOutCubic(2)).toBe(1)
  })
})

describe('travelDuration', () => {
  it('grows with distance and stays within bounds', () => {
    expect(travelDuration(0, 0)).toBeCloseTo(1.05, 10)
    expect(travelDuration(0, 2)).toBeGreaterThan(travelDuration(0, 1))
    expect(travelDuration(0, 100)).toBe(2.1)
    expect(travelDuration(4, 2)).toBe(travelDuration(2, 4))
  })
})

describe('sampleTravel', () => {
  const travel: Travel = { fromStage: 2, toStage: 4, fromYaw: 0, toYaw: 1, start: 10, duration: 2 }

  it('starts where it came from and ends where it is going', () => {
    expect(sampleTravel(travel, 10)).toEqual({ stage: 2, yaw: 0, progress: 0, done: false })
    expect(sampleTravel(travel, 12)).toEqual({ stage: 4, yaw: 1, progress: 1, done: true })
    expect(sampleTravel(travel, 20).done).toBe(true)
  })

  it('is half way at the midpoint', () => {
    const mid = sampleTravel(travel, 11)
    expect(mid.stage).toBeCloseTo(3, 10)
    expect(mid.yaw).toBeCloseTo(0.5, 10)
  })

  it('treats a zero duration as already arrived', () => {
    expect(sampleTravel({ ...travel, duration: 0 }, 10).done).toBe(true)
  })
})
