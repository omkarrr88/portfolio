import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import type { RingScene, FrameInfo } from '../scene/RingScene'
import { buildRings, projectPlanePoint } from '../scene/formation'
import type { ScrollListener } from '../hooks/usePageScroll'
import type { Placement } from '../router/meta'
import { clearance, type Span } from '../scroll/dim'
import { pad } from '../lib/format'

interface FormationProps {
  readonly reducedMotion: boolean
  /** Where the current page sits in the formation; changing it makes the camera travel. */
  readonly placement: Placement
  /** Name shown on a ring once the camera settles on it (the chapter at home, the page elsewhere). */
  readonly labelFor: (ring: number) => string
  readonly ref?: Ref<ScrollListener>
}

const RINGS = buildRings()
/** The label fades out as it nears a block of text, fully gone this many px away. */
const LABEL_CLEARANCE_PX = 56

/** Fades the ring label out mid-transition and back in once a ring has settled. */
const labelOpacity = (stage: number) => {
  const offInteger = Math.abs(stage - Math.round(stage))
  return 1 - Math.min(1, Math.max(0, (offInteger - 0.1) / 0.18))
}

/**
 * The fixed WebGL backdrop plus the label that rides on the active ring.
 * The scene is loaded after first paint so the text is readable immediately.
 */
export function Formation({ reducedMotion, placement, labelFor, ref }: FormationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<RingScene | null>(null)
  const placementRef = useRef(placement)
  const labelText = useRef(labelFor)
  const lastDim = useRef(0)
  const textBlocks = useRef<readonly Span[]>([])
  const [failed, setFailed] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      onScrollOffset: (offset) => sceneRef.current?.setScrollOffset(offset),
      onVelocity: (v) => sceneRef.current?.setVelocity(v),
      onDim: (amount) => {
        lastDim.current = amount
        sceneRef.current?.setDim(amount)
      },
      onTextBlocks: (blocks) => {
        textBlocks.current = blocks
      },
    }),
    [],
  )

  useEffect(() => {
    labelText.current = labelFor
  }, [labelFor])

  useEffect(() => {
    placementRef.current = placement
    sceneRef.current?.travelTo(placement.stage, placement.yaw)
  }, [placement])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let shownText = ''

    const onFrame = ({ stage, activeRing, travelling, camera }: FrameInfo) => {
      const el = labelRef.current
      if (!el) return
      const ring = RINGS[activeRing - 1]
      const name = labelText.current(activeRing)
      // Nothing to label at the centre, on an unnamed ring, mid-flight, or with motion reduced.
      if (!ring || !name || travelling || reducedMotion) {
        el.style.opacity = '0'
        return
      }
      const text = `${pad(activeRing)} — ${name}`
      if (text !== shownText) {
        shownText = text
        el.textContent = text
      }
      const point = projectPlanePoint({ x: 0, y: ring.radius }, camera)
      if (!point) return
      el.style.transform = `translate3d(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px, 0) translate(-50%, -150%)`
      // On narrow screens the outer ring's label would collide with the hero text.
      const crowded = activeRing === 7 && camera.width < 700
      const room = clearance(window.scrollY + point.y - 10, textBlocks.current, LABEL_CLEARANCE_PX)
      el.style.opacity = crowded ? '0' : (labelOpacity(stage) * room).toFixed(3)
    }

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      sceneRef.current?.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
    }

    const resizeObserver = new ResizeObserver(() => sceneRef.current?.resize(canvas.clientWidth, canvas.clientHeight))

    import('../scene/RingScene')
      .then(({ RingScene }) => {
        if (disposed) return
        const onError = (message: string) => {
          console.error('Formation: shader rejected, showing the static fallback.', message)
          if (!disposed) setFailed(true)
        }
        const scene = new RingScene(canvas, { reducedMotion, onFrame, onError })
        scene.resize(canvas.clientWidth, canvas.clientHeight)
        scene.travelTo(placementRef.current.stage, placementRef.current.yaw, true)
        scene.setDim(lastDim.current)
        sceneRef.current = scene
        resizeObserver.observe(canvas)
        canvas.dataset.ready = 'true'
      })
      .catch((error: unknown) => {
        console.error('Formation: WebGL unavailable, showing the static fallback.', error)
        if (!disposed) setFailed(true)
      })

    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      disposed = true
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointer)
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [reducedMotion])

  return (
    <div className="formation" aria-hidden="true">
      {failed ? <div className="formation__fallback" /> : <canvas ref={canvasRef} className="formation__canvas" />}
      <div ref={labelRef} className="formation__label" />
    </div>
  )
}
