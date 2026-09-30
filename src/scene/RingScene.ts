import {
  RING_GROWTH,
  activeRingForStage,
  buildRings,
  frameRadiusPx,
  worldZoomForViewport,
  type CameraParams,
} from './formation'
import { fragmentShader, vertexShader } from './shaders'
import { GLError, createFullScreenTriangle, createProgram, uniformLocations, type UniformLocations } from './gl'
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

const UNIFORMS = [
  'uResolution',
  'uPixelRatio',
  'uTime',
  'uStage',
  'uPitch',
  'uYaw',
  'uDistance',
  'uFocal',
  'uWorldZoom',
  'uActive',
  'uDustDensity',
  'uBg',
  'uInk',
  'uAccent',
  'uRadius',
  'uDir',
  'uSpeed',
  'uGap',
  'uTicks',
] as const
type UniformName = (typeof UNIFORMS)[number]

export interface FrameInfo {
  readonly stage: number
  readonly activeRing: number
  readonly camera: CameraParams
}

export interface RingSceneOptions {
  readonly reducedMotion: boolean
  readonly onFrame?: (info: FrameInfo) => void
  /** Called if WebGL2 is missing, the shader is rejected, or the context is lost for good. */
  readonly onError?: (message: string) => void
}

interface GpuResources {
  readonly program: WebGLProgram
  readonly vao: WebGLVertexArrayObject
  readonly buffer: WebGLBuffer
  readonly uniforms: UniformLocations<UniformName>
}

const rgb = ([r, g, b]: readonly [number, number, number]) => [r / 255, g / 255, b / 255] as const

/**
 * Owns the canvas that draws the formation: one WebGL2 program and one
 * full-screen triangle, no engine. Throws GLError from the constructor if
 * WebGL2 is unavailable so the caller can show the static fallback.
 */
export class RingScene {
  private readonly canvas: HTMLCanvasElement
  private readonly gl: WebGL2RenderingContext
  private readonly options: RingSceneOptions
  private gpu: GpuResources | null = null
  private frame = 0

  private width = 1
  private height = 1
  private pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
  private worldZoom = 1
  private stage = 0
  private targetStage = 0
  private pointerX = 0
  private pointerY = 0
  private smoothX = 0
  private smoothY = 0
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
    this.canvas = canvas
    this.options = options
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    })
    if (!gl) throw new GLError('WebGL2 is not available')
    this.gl = gl
    this.gpu = this.createResources()
    canvas.addEventListener('webglcontextlost', this.onContextLost)
    canvas.addEventListener('webglcontextrestored', this.onContextRestored)
    this.frame = requestAnimationFrame(this.tick)
  }

  resize(width: number, height: number): void {
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.worldZoom = worldZoomForViewport(this.width, this.height, DISTANCE, FOCAL)
    this.applyPixelRatio(this.pixelRatio)
  }

  setTargetStage(stage: number): void {
    this.targetStage = stage
  }

  /** Normalised pointer, -1..1 on both axes. */
  setPointer(x: number, y: number): void {
    this.pointerX = x
    this.pointerY = y
  }

  /** Scroll velocity in px per ms; tilts the formation slightly while moving. */
  setVelocity(pxPerMs: number): void {
    this.targetVelocityTilt = Math.max(-0.08, Math.min(0.08, pxPerMs * 0.02))
  }

  dispose(): void {
    cancelAnimationFrame(this.frame)
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored)
    this.releaseResources()
  }

  private createResources(): GpuResources {
    const gl = this.gl
    const program = createProgram(gl, vertexShader, fragmentShader)
    const { vao, buffer } = createFullScreenTriangle(gl)
    const uniforms = uniformLocations(gl, program, UNIFORMS)
    const rings = buildRings()

    gl.useProgram(program)
    gl.uniform1f(uniforms.uDistance, DISTANCE)
    gl.uniform1f(uniforms.uFocal, FOCAL)
    gl.uniform3fv(uniforms.uBg, rgb(palette.bg))
    gl.uniform3fv(uniforms.uInk, rgb(palette.ink))
    gl.uniform3fv(uniforms.uAccent, rgb(palette.accent))
    gl.uniform1fv(uniforms.uRadius, rings.map((r) => r.radius))
    gl.uniform1fv(uniforms.uDir, rings.map((r) => r.direction))
    gl.uniform1fv(uniforms.uSpeed, rings.map((r) => r.speed))
    gl.uniform1fv(uniforms.uGap, rings.map((r) => r.gapAt))
    gl.uniform1fv(uniforms.uTicks, rings.map((r) => r.ticks))
    return { program, vao, buffer, uniforms }
  }

  private releaseResources(): void {
    const { gl, gpu } = this
    if (!gpu || gl.isContextLost()) {
      this.gpu = null
      return
    }
    gl.deleteProgram(gpu.program)
    gl.deleteVertexArray(gpu.vao)
    gl.deleteBuffer(gpu.buffer)
    this.gpu = null
  }

  private readonly onContextLost = (event: Event): void => {
    event.preventDefault()
    cancelAnimationFrame(this.frame)
    this.gpu = null
  }

  private readonly onContextRestored = (): void => {
    try {
      this.gpu = this.createResources()
      this.applyPixelRatio(this.pixelRatio)
      this.frame = requestAnimationFrame(this.tick)
    } catch (error: unknown) {
      this.options.onError?.(error instanceof Error ? error.message : 'WebGL context could not be restored')
    }
  }

  private applyPixelRatio(ratio: number): void {
    this.pixelRatio = ratio
    const w = Math.max(1, Math.round(this.width * ratio))
    const h = Math.max(1, Math.round(this.height * ratio))
    if (this.canvas.width !== w) this.canvas.width = w
    if (this.canvas.height !== h) this.canvas.height = h
    const { gl, gpu } = this
    if (!gpu) return
    gl.viewport(0, 0, w, h)
    gl.useProgram(gpu.program)
    gl.uniform2f(gpu.uniforms.uResolution, w, h)
    gl.uniform1f(gpu.uniforms.uPixelRatio, ratio)
    // Keep dust density constant on screen: small screens get fewer cells per unit.
    gl.uniform1f(gpu.uniforms.uDustDensity, DUST_PER_UNIT * (frameRadiusPx(this.width, this.height) / DUST_REFERENCE_FRAME_PX))
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
    this.frame = requestAnimationFrame(this.tick)
    const { gl, gpu } = this
    if (!gpu) return

    const dtMs = this.lastTime ? Math.min(100, time - this.lastTime) : 16
    this.lastTime = time
    const dt = dtMs / 1000
    const reduced = this.options.reducedMotion
    if (!reduced) this.elapsed += dt
    this.watchFrameTime(dtMs)

    const ease = (rate: number) => 1 - Math.exp(-dt * rate)
    this.stage = reduced ? this.targetStage : this.stage + (this.targetStage - this.stage) * ease(6)
    this.smoothX += (this.pointerX - this.smoothX) * ease(3)
    this.smoothY += (this.pointerY - this.smoothY) * ease(3)
    this.velocityTilt += (this.targetVelocityTilt - this.velocityTilt) * ease(4)
    this.targetVelocityTilt *= 1 - ease(3)

    const pitch = BASE_PITCH + (reduced ? 0 : this.smoothY * 0.05 + this.velocityTilt)
    const yaw = reduced ? 0 : this.smoothX * 0.07
    const activeRing = activeRingForStage(this.stage)
    const u = gpu.uniforms

    gl.useProgram(gpu.program)
    gl.uniform1f(u.uTime, this.elapsed)
    gl.uniform1f(u.uStage, this.stage)
    gl.uniform1f(u.uPitch, pitch)
    gl.uniform1f(u.uYaw, yaw)
    gl.uniform1f(u.uWorldZoom, this.worldZoom)
    gl.uniform1f(u.uActive, activeRing)
    gl.bindVertexArray(gpu.vao)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

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
