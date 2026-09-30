/**
 * A camera move between two places in the formation (navigation), eased in
 * and out so a dive reads as deliberate rather than as a scroll.
 */
export interface Travel {
  readonly fromStage: number
  readonly toStage: number
  readonly fromYaw: number
  readonly toYaw: number
  /** Seconds, on the scene's clock. */
  readonly start: number
  readonly duration: number
}

export interface TravelSample {
  readonly stage: number
  readonly yaw: number
  /** 0..1, eased: how much of the way the camera has come. */
  readonly progress: number
  readonly done: boolean
}

const MIN_SECONDS = 1.05
const SECONDS_PER_STAGE = 0.16
const MAX_SECONDS = 2.1

/** Longer dives take a little longer, within limits. */
export function travelDuration(fromStage: number, toStage: number): number {
  return Math.min(MAX_SECONDS, MIN_SECONDS + SECONDS_PER_STAGE * Math.abs(toStage - fromStage))
}

export function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function sampleTravel(travel: Travel, now: number): TravelSample {
  const progress = travel.duration <= 0 ? 1 : (now - travel.start) / travel.duration
  const k = easeInOutCubic(progress)
  return {
    stage: travel.fromStage + (travel.toStage - travel.fromStage) * k,
    yaw: travel.fromYaw + (travel.toYaw - travel.fromYaw) * k,
    progress: k,
    done: progress >= 1,
  }
}
