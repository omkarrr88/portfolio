import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import type { RingScene, FrameInfo } from '../scene/RingScene'
import { buildRings, projectPlanePoint } from '../scene/formation'
import { chapterForRing } from '../content/site'
import type { StageListener } from '../hooks/useScrollStage'

interface FormationProps {
  readonly reducedMotion: boolean
  readonly ref?: Ref<StageListener>
}

const RINGS = buildRings()
const pad = (n: number) => String(n).padStart(2, '0')

/** Fades the ring label out mid-transition and back in once a ring has settled. */
const labelOpacity = (stage: number) => {
  const offInteger = Math.abs(stage - Math.round(stage))
  return 1 - Math.min(1, Math.max(0, (offInteger - 0.1) / 0.18))
}

/**
 * The fixed WebGL backdrop plus the label that rides on the active ring.
 * three.js is loaded after first paint so the text is readable immediately.
 */
export function Formation({ reducedMotion, ref }: FormationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<RingScene | null>(null)
  const lastStage = useRef(0)
  const [failed, setFailed] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      onStage: (stage) => {
        lastStage.current = reducedMotion ? 0 : stage
        sceneRef.current?.setTargetStage(lastStage.current)
      },
      onVelocity: (v) => sceneRef.current?.setVelocity(v),
    }),
    [reducedMotion],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let lastRing = 0

    const onFrame = ({ stage, activeRing, camera }: FrameInfo) => {
      const label = labelRef.current
      if (!label) return
      if (activeRing !== lastRing) {
        lastRing = activeRing
        label.textContent = `${pad(activeRing)} — ${chapterForRing(activeRing).label}`
      }
      const point = projectPlanePoint({ x: 0, y: RINGS[activeRing - 1].radius }, camera)
      if (!point) return
      label.style.transform = `translate3d(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px, 0) translate(-50%, -150%)`
      // On narrow screens the outer ring's label would collide with the hero text.
      const hidden = reducedMotion || (activeRing === 7 && camera.width < 700)
      label.style.opacity = hidden ? '0' : labelOpacity(stage).toFixed(3)
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
        scene.setTargetStage(lastStage.current)
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
