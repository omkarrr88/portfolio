/**
 * Geometry of the Chakravyuh formation: seven concentric rings lying on a
 * ground plane, seen by a pitched camera. Everything here is pure so the
 * shader, the DOM labels and the tests all agree on the same numbers.
 */

export const RING_COUNT = 7
/** Ratio between neighbouring ring radii. Scrolling one stage zooms by this. */
export const RING_GROWTH = 1.42

export interface Ring {
  /** 1 = innermost, 7 = outermost. */
  readonly index: number
  /** Radius on the plane; the outer ring is normalised to 1. */
  readonly radius: number
  /** +1 or -1: neighbouring rings counter-rotate. */
  readonly direction: number
  /** Relative rotation speed. */
  readonly speed: number
  /** Where the ring's single opening sits, in turns (0..1). */
  readonly gapAt: number
  /** Number of tick marks drawn outside the ring (0 = none). */
  readonly ticks: number
}

const GAP_POSITIONS = [0.08, 0.61, 0.27, 0.83, 0.44, 0.97, 0.75] as const
const TICK_COUNTS = [0, 24, 0, 48, 0, 72, 0] as const

export function buildRings(): Ring[] {
  return Array.from({ length: RING_COUNT }, (_, i) => ({
    index: i + 1,
    radius: Math.pow(RING_GROWTH, i - (RING_COUNT - 1)),
    direction: i % 2 === 0 ? 1 : -1,
    speed: 0.6 + 0.1 * ((i * 3) % 5),
    gapAt: GAP_POSITIONS[i],
    ticks: TICK_COUNTS[i],
  }))
}

/** Stage 0 frames ring 7; each whole stage moves one ring inward. */
export function activeRingForStage(stage: number): number {
  const ring = RING_COUNT - Math.round(stage)
  return Math.min(RING_COUNT, Math.max(1, ring))
}

export type Vec3 = readonly [number, number, number]

export interface CameraBasis {
  readonly position: Vec3
  readonly forward: Vec3
  readonly right: Vec3
  readonly up: Vec3
}

/**
 * Camera orbiting the plane's origin at `distance`, tilted `pitch` radians
 * away from looking straight down. Matches `cameraBasis` in the shader.
 */
export function cameraBasis(pitch: number, distance: number): CameraBasis {
  const s = Math.sin(pitch)
  const c = Math.cos(pitch)
  return {
    position: [0, -distance * s, distance * c],
    forward: [0, s, -c],
    right: [1, 0, 0],
    up: [0, c, s],
  }
}

export interface CameraParams {
  readonly pitch: number
  /** Rotation of the plane around its normal, radians. */
  readonly yaw: number
  readonly distance: number
  readonly focal: number
  /** Uniform scale applied to plane coordinates (the scroll "zoom"). */
  readonly zoom: number
  /** Viewport size in CSS pixels. */
  readonly width: number
  readonly height: number
}

export interface ScreenPoint {
  readonly x: number
  readonly y: number
}

/** Projects a point on the formation plane to CSS pixels, or null if it is behind the camera. */
export function projectPlanePoint(point: ScreenPoint, cam: CameraParams): ScreenPoint | null {
  const cy = Math.cos(cam.yaw)
  const sy = Math.sin(cam.yaw)
  const wx = (point.x * cy - point.y * sy) * cam.zoom
  const wy = (point.x * sy + point.y * cy) * cam.zoom

  const { position, forward, right, up } = cameraBasis(cam.pitch, cam.distance)
  const v: Vec3 = [wx - position[0], wy - position[1], -position[2]]
  const depth = v[0] * forward[0] + v[1] * forward[1] + v[2] * forward[2]
  if (depth <= 1e-6) return null

  const u = ((v[0] * right[0] + v[1] * right[1] + v[2] * right[2]) / depth) * cam.focal
  const w = ((v[0] * up[0] + v[1] * up[1] + v[2] * up[2]) / depth) * cam.focal
  const half = cam.height / 2
  return { x: cam.width / 2 + u * half, y: cam.height / 2 - w * half }
}

/** Screen radius (CSS px) that the framing ring should occupy horizontally. */
export function frameRadiusPx(width: number, height: number): number {
  return 0.44 * Math.min(width, 1.5 * height)
}

/** Plane zoom at stage 0 that puts the outer ring exactly on the frame radius. */
export function worldZoomForViewport(width: number, height: number, distance: number, focal: number): number {
  if (height <= 0 || focal <= 0) return 1
  return (frameRadiusPx(width, height) * 2 * distance) / (focal * height)
}
