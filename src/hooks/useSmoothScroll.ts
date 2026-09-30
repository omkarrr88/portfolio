import { useEffect, useState } from 'react'
import Lenis from 'lenis'

/**
 * Lenis smooths wheel scrolling on laptops. Touch keeps native momentum
 * (Lenis leaves touch alone by default), so phones scroll like phones.
 * Lenis drives the real window scroll, so ScrollTrigger (loaded later with
 * the reveals) sees ordinary scroll events and needs no extra wiring.
 */
export function useSmoothScroll(enabled: boolean): Lenis | null {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return
    // `anchors` routes in-page links (#chakravyuh and so on) through the same easing.
    const instance = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { duration: 1.6 } })
    setLenis(instance)
    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [enabled])

  return lenis
}
