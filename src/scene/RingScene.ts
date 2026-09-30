import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  RING_GROWTH,
  activeRingForStage,
  buildRings,
  frameRadiusPx,
  worldZoomForViewport,
  type CameraParams,
} from './formation'
import { fragmentShader, vertexShader } from './shaders'
import { palette } from '../theme/palette'

const BASE_PITCH = 0.74
const DISTANCE = 4
const FOCAL = 2
const MAX_PIXEL_RATIO = 2
const SLOW_FRAME_MS = 24
const FRAME_SAMPLE = 90
/** Dust cells per plane unit when the frame ring is this many CSS px wide. */
const DUST_PER_UNIT = 26
const DUST_REFERENCE_FRAME_PX = 594

export interface FrameInfo {
  readonly stage: number
  readonly activeRing: number
  readonly camera: CameraParams
}

export interface RingSceneOptions {
  readonly reducedMotion: boolean
  readonly onFrame?: (info: FrameInfo) => void
  /** Called once if the GPU rejects the shader, so the caller can fall back. */
  readonly onError?: (message: string) => void
}

const toVec3 = ([r, g, b]: readonly [number, number, number]) => new Vector3(r / 255, g / 255, b / 255)

/** Owns the WebGL canvas that draws the formation. One instance per canvas. */
export class RingScene {
  private readonly renderer: WebGLRenderer
  private readonly scene = new Scene()
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly material: ShaderMaterial
  private readonly geometry = new PlaneGeometry(2, 2)
  private readonly options: RingSceneOptions

  private width = 1
  private height = 1
  private pixelRatio = 1
  private worldZoom = 1
  private stage = 0
  private targetStage = 0
  private pointer = { x: 0, y: 0 }
  private smoothPointer = { x: 0, y: 0 }
  private velocityTilt = 0
  private targetVelocityTilt = 0
  private elapsed = 0
  private lastTime = 0
  // Ring buffer of recent frame times; mutated in place so the render loop never allocates.
  private readonly frameTimes = new Float32Array(FRAME_SAMPLE)
  private frameIndex = 0
  private frameCount = 0
  private frameSum = 0

  constructor(canvas: HTMLCanvasElement, options: RingSceneOptions) {
    this.options = options
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
    this.renderer.debug.onShaderError = (gl, program) => {
      this.renderer.setAnimationLoop(null)
      options.onError?.(gl.getProgramInfoLog(program) ?? 'shader failed to compile')
    }
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)

    const rings = buildRings()
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uResolution: { value: new Vector2(1, 1) },
        uPixelRatio: { value: this.pixelRatio },
        uTime: { value: 0 },
        uStage: { value: 0 },
        uPitch: { value: BASE_PITCH },
        uYaw: { value: 0 },
        uDistance: { value: DISTANCE },
        uFocal: { value: FOCAL },
        uWorldZoom: { value: 1 },
        uActive: { value: 7 },
        uDustDensity: { value: DUST_PER_UNIT },
        uBg: { value: toVec3(palette.bg) },
        uInk: { value: toVec3(palette.ink) },
        uAccent: { value: toVec3(palette.accent) },
        uRadius: { value: rings.map((r) => r.radius) },
        uDir: { value: rings.map((r) => r.direction) },
        uSpeed: { value: rings.map((r) => r.speed) },
        uGap: { value: rings.map((r) => r.gapAt) },
        uTicks: { value: rings.map((r) => r.ticks) },
      },
    })
    this.scene.add(new Mesh(this.geometry, this.material))
    this.renderer.setAnimationLoop(this.tick)
  }

  resize(width: number, height: number): void {
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.worldZoom = worldZoomForViewport(this.width, this.height, DISTANCE, FOCAL)
    // Keep dust density constant on screen: small screens get fewer cells per unit.
    this.material.uniforms.uDustDensity.value =
      DUST_PER_UNIT * (frameRadiusPx(this.width, this.height) / DUST_REFERENCE_FRAME_PX)
    this.applyPixelRatio(this.pixelRatio)
  }

  setTargetStage(stage: number): void {
    this.targetStage = stage
  }

  /** Normalised pointer, -1..1 on both axes. */
  setPointer(x: number, y: number): void {
    this.pointer = { x, y }
  }

  /** Scroll velocity in px per ms; tilts the formation slightly while moving. */
  setVelocity(pxPerMs: number): void {
    this.targetVelocityTilt = Math.max(-0.08, Math.min(0.08, pxPerMs * 0.02))
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null)
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }

  private applyPixelRatio(ratio: number): void {
    this.pixelRatio = ratio
    this.renderer.setPixelRatio(ratio)
    this.renderer.setSize(this.width, this.height, false)
    const size = this.renderer.getDrawingBufferSize(new Vector2())
    this.material.uniforms.uResolution.value.copy(size)
    this.material.uniforms.uPixelRatio.value = ratio
  }

  /** Drops resolution if the device can't keep up (mid-range phones). O(1), no allocation. */
  private watchFrameTime(dt: number): void {
    if (this.pixelRatio <= 1 || this.elapsed < 2) return
    this.frameSum += dt - this.frameTimes[this.frameIndex]
    this.frameTimes[this.frameIndex] = dt
    this.frameIndex = (this.frameIndex + 1) % FRAME_SAMPLE
    this.frameCount = Math.min(FRAME_SAMPLE, this.frameCount + 1)
    if (this.frameCount < FRAME_SAMPLE || this.frameSum / FRAME_SAMPLE <= SLOW_FRAME_MS) return
    this.frameTimes.fill(0)
    this.frameSum = 0
    this.frameCount = 0
    this.applyPixelRatio(Math.max(1, this.pixelRatio * 0.7))
  }

  private readonly tick = (time: number): void => {
    const dtMs = this.lastTime ? Math.min(100, time - this.lastTime) : 16
    this.lastTime = time
    const dt = dtMs / 1000
    const reduced = this.options.reducedMotion
    if (!reduced) this.elapsed += dt
    this.watchFrameTime(dtMs)

    const ease = (rate: number) => 1 - Math.exp(-dt * rate)
    this.stage = reduced ? this.targetStage : this.stage + (this.targetStage - this.stage) * ease(6)
    this.smoothPointer = {
      x: this.smoothPointer.x + (this.pointer.x - this.smoothPointer.x) * ease(3),
      y: this.smoothPointer.y + (this.pointer.y - this.smoothPointer.y) * ease(3),
    }
    this.velocityTilt += (this.targetVelocityTilt - this.velocityTilt) * ease(4)
    this.targetVelocityTilt *= 1 - ease(3)

    const pitch = BASE_PITCH + (reduced ? 0 : this.smoothPointer.y * 0.05 + this.velocityTilt)
    const yaw = reduced ? 0 : this.smoothPointer.x * 0.07
    const activeRing = activeRingForStage(this.stage)

    const u = this.material.uniforms
    u.uTime.value = this.elapsed
    u.uStage.value = this.stage
    u.uPitch.value = pitch
    u.uYaw.value = yaw
    u.uWorldZoom.value = this.worldZoom
    u.uActive.value = activeRing

    this.renderer.render(this.scene, this.camera)

    this.options.onFrame?.({
      stage: this.stage,
      activeRing,
      camera: {
        pitch,
        yaw,
        distance: DISTANCE,
        focal: FOCAL,
        zoom: this.worldZoom * Math.pow(RING_GROWTH, this.stage),
        width: this.width,
        height: this.height,
      },
    })
  }
}
