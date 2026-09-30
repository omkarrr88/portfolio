import { describe, expect, it } from 'vitest'
import {
  BASE_PITCH,
  CENTRE,
  FINALE_PITCH,
  RING_COUNT,
  RING_GROWTH,
  activeRingForStage,
  buildRings,
  cameraBasis,
  cameraForStage,
  centreFrame,
  finaleProgress,
  frameRadiusPx,
  projectPlanePoint,
  worldZoomForViewport,
  zoomExponentForRadius,
  type CameraParams,
} from './formation'

const topDown = (overrides: Partial<CameraParams> = {}): CameraParams => ({
  pitch: 0,
  yaw: 0,
  distance: 4,
  focal: 2,
  zoom: 1,
  width: 1000,
  height: 800,
  ...overrides,
})

describe('buildRings', () => {
  const rings = buildRings()

  it('builds seven rings, innermost first', () => {
    expect(rings).toHaveLength(RING_COUNT)
    expect(rings.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('normalises the outer ring to radius 1 and grows geometrically', () => {
    expect(rings[6].radius).toBeCloseTo(1, 10)
    for (let i = 1; i < rings.length; i += 1) {
      expect(rings[i].radius / rings[i - 1].radius).toBeCloseTo(RING_GROWTH, 10)
    }
  })

  it('alternates rotation direction so neighbouring rings counter-rotate', () => {
    for (let i = 1; i < rings.length; i += 1) {
      expect(Math.sign(rings[i].direction)).toBe(-Math.sign(rings[i - 1].direction))
    }
  })

  it('returns a new array each call so callers cannot mutate shared state', () => {
    expect(buildRings()).not.toBe(buildRings())
  })
})

describe('activeRingForStage', () => {
  it('maps stage 0 to the outer ring and counts inward', () => {
    expect(activeRingForStage(0)).toBe(7)
    expect(activeRingForStage(1)).toBe(6)
    expect(activeRingForStage(2)).toBe(5)
  })

  it('switches at the halfway point of a transition', () => {
    expect(activeRingForStage(1.49)).toBe(6)
    expect(activeRingForStage(1.51)).toBe(5)
  })

  it('reaches the centre (0) after the innermost ring', () => {
    expect(activeRingForStage(6)).toBe(1)
    expect(activeRingForStage(7)).toBe(CENTRE)
  })

  it('clamps to the valid range, outer ring to centre', () => {
    expect(activeRingForStage(-3)).toBe(7)
    expect(activeRingForStage(99)).toBe(CENTRE)
  })
})

describe('cameraBasis', () => {
  it('looks straight down the plane normal at zero pitch', () => {
    const { position, forward, up } = cameraBasis(0, 4)
    position.forEach((value, i) => expect(value).toBeCloseTo([0, 0, 4][i], 10))
    expect(forward[2]).toBeCloseTo(-1, 10)
    expect(up[1]).toBeCloseTo(1, 10)
  })

  it('keeps the basis orthonormal when pitched', () => {
    const { forward, right, up } = cameraBasis(0.7, 4)
    const dot = (a: readonly number[], b: readonly number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    expect(dot(forward, right)).toBeCloseTo(0, 10)
    expect(dot(forward, up)).toBeCloseTo(0, 10)
    expect(dot(right, up)).toBeCloseTo(0, 10)
    expect(dot(forward, forward)).toBeCloseTo(1, 10)
    expect(dot(up, up)).toBeCloseTo(1, 10)
  })
})

describe('projectPlanePoint', () => {
  it('projects the origin to the viewport centre', () => {
    const p = projectPlanePoint({ x: 0, y: 0 }, topDown())
    expect(p).not.toBeNull()
    expect(p!.x).toBeCloseTo(500, 6)
    expect(p!.y).toBeCloseTo(400, 6)
  })

  it('scales by focal / distance and half the viewport height when looking straight down', () => {
    // uv = r * focal / distance = 1 * 2 / 4 = 0.5; px = uv * height / 2 = 200
    const p = projectPlanePoint({ x: 1, y: 0 }, topDown())
    expect(p!.x).toBeCloseTo(700, 6)
    expect(p!.y).toBeCloseTo(400, 6)
  })

  it('puts positive plane y above the centre (screen y grows downward)', () => {
    const p = projectPlanePoint({ x: 0, y: 1 }, topDown())
    expect(p!.y).toBeLessThan(400)
  })

  it('applies zoom as a uniform scale on the plane', () => {
    const p = projectPlanePoint({ x: 1, y: 0 }, topDown({ zoom: 2 }))
    expect(p!.x).toBeCloseTo(900, 6)
  })

  it('keeps the horizontal extent exact under pitch for points on the x axis', () => {
    const p = projectPlanePoint({ x: 1, y: 0 }, topDown({ pitch: 0.7 }))
    expect(p!.x).toBeCloseTo(700, 6)
  })

  it('foreshortens the far side and enlarges the near side under pitch', () => {
    const cam = topDown({ pitch: 0.7 })
    const far = projectPlanePoint({ x: 0, y: 1 }, cam)!
    const near = projectPlanePoint({ x: 0, y: -1 }, cam)!
    expect(400 - far.y).toBeLessThan(near.y - 400)
  })

  it('returns null for points behind the camera', () => {
    const p = projectPlanePoint({ x: 0, y: -50 }, topDown({ pitch: 1.2 }))
    expect(p).toBeNull()
  })
})

describe('frameRadiusPx and worldZoomForViewport', () => {
  it('is limited by width on a portrait phone', () => {
    expect(frameRadiusPx(390, 844)).toBeCloseTo(0.44 * 390, 6)
  })

  it('is limited by 1.5 × height on a wide laptop', () => {
    expect(frameRadiusPx(1440, 900)).toBeCloseTo(0.44 * 1350, 6)
  })

  it('makes the outer ring project exactly to the frame radius', () => {
    for (const [width, height] of [
      [1440, 900],
      [390, 844],
    ] as const) {
      const zoom = worldZoomForViewport(width, height, 4, 2)
      const p = projectPlanePoint({ x: 1, y: 0 }, topDown({ width, height, zoom, pitch: 0.7 }))!
      expect(p.x - width / 2).toBeCloseTo(frameRadiusPx(width, height), 6)
    }
  })
})

describe('finaleProgress', () => {
  it('stays 0 while diving through the rings', () => {
    expect(finaleProgress(0)).toBe(0)
    expect(finaleProgress(RING_COUNT - 1)).toBe(0)
  })

  it('eases from the innermost ring to the centre and holds there', () => {
    expect(finaleProgress(RING_COUNT - 0.5)).toBeCloseTo(0.5, 10)
    expect(finaleProgress(RING_COUNT)).toBe(1)
    expect(finaleProgress(RING_COUNT + 3)).toBe(1)
  })
})

describe('centreFrame', () => {
  it('puts the formation right of the text on a laptop and keeps it on screen', () => {
    const f = centreFrame(1440, 900)
    expect(f.offsetX).toBeGreaterThan(0)
    expect(f.offsetY).toBe(0)
    expect(1440 / 2 + f.offsetX + f.radius).toBeLessThan(1440)
    expect(f.radius).toBeLessThan(900 / 2)
  })

  it('lifts the formation above the text on a phone and keeps it on screen', () => {
    const f = centreFrame(390, 844)
    expect(f.offsetX).toBe(0)
    expect(f.offsetY).toBeLessThan(0)
    expect(844 / 2 + f.offsetY - f.radius).toBeGreaterThan(60)
    expect(f.radius * 2).toBeLessThan(390)
  })
})

describe('zoomExponentForRadius', () => {
  it('is 0 for the stage-0 framing radius and negative for anything smaller', () => {
    expect(zoomExponentForRadius(frameRadiusPx(1440, 900), 1440, 900)).toBeCloseTo(0, 10)
    expect(zoomExponentForRadius(frameRadiusPx(1440, 900) / RING_GROWTH, 1440, 900)).toBeCloseTo(-1, 10)
  })
})

describe('cameraForStage', () => {
  it('dives one ring step per stage on the way in', () => {
    for (const stage of [0, 1, 2.5, 6]) {
      const cam = cameraForStage(stage, 1440, 900)
      expect(cam.zoomExponent).toBeCloseTo(stage, 10)
      expect(cam.pitch).toBeCloseTo(BASE_PITCH, 10)
      expect(cam.finale).toBe(0)
    }
  })

  it('pulls back and looks down at the centre', () => {
    const cam = cameraForStage(RING_COUNT, 1440, 900)
    const frame = centreFrame(1440, 900)
    expect(cam.pitch).toBeCloseTo(FINALE_PITCH, 10)
    expect(cam.zoomExponent).toBeCloseTo(zoomExponentForRadius(frame.radius, 1440, 900), 10)
    expect(cam.offsetX).toBeCloseTo(frame.offsetX, 10)
  })

  it('is continuous where the finale starts', () => {
    const before = cameraForStage(RING_COUNT - 1 - 1e-6, 390, 844)
    const after = cameraForStage(RING_COUNT - 1 + 1e-6, 390, 844)
    expect(after.zoomExponent).toBeCloseTo(before.zoomExponent, 4)
    expect(after.pitch).toBeCloseTo(before.pitch, 4)
  })
})

describe('projectPlanePoint with an offset', () => {
  it('shifts the projected centre by the offset', () => {
    const p = projectPlanePoint({ x: 0, y: 0 }, topDown({ offsetX: 120, offsetY: -40 }))
    expect(p?.x).toBeCloseTo(500 + 120, 6)
    expect(p?.y).toBeCloseTo(400 - 40, 6)
  })
})
