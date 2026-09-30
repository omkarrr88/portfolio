import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooths wheel scrolling on laptops. Touch keeps native momentum
 * (Lenis leaves touch alone by default), so phones scroll like phones.
 */
export function useSmoothScroll(enabled: boolean): Lenis | null {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return
    const instance = new Lenis({ autoRaf: false, lerp: 0.09 })
    const onTick = (time: number) => instance.raf(time * 1000)
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(onTick)
      instance.destroy()
      setLenis(null)
    }
  }, [enabled])

  return lenis
}
